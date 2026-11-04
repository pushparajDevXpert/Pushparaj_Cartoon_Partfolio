
import { useEffect, useRef, useState } from 'react';
import {
  isContactQuestion,
  isResumeQuestion,
  safeURL
} from '../utils.js';

const welcome = {
  id: 0,
  who: 'bot',
  text: "Hey there! 👋 I'm Pushparaj's portfolio guide. Ask me about the Python stack, projects, or how to get in touch."
};

const suggestions = [
  ['Python stack', 'What Python technologies does this portfolio feature?'],
  ['Projects', 'Tell me about the sample projects.'],
  ['Resume', 'Can I view your resume?'],
  ['Contact', 'How can I contact Pushparaj?']
];

function getCurrentPageContext() {
  const sections = [
    ...document.querySelectorAll('main section, main article')
  ];

  const visible = sections
    .map(section => {
      const rect = section.getBoundingClientRect();

      const height = Math.max(
        0,
        Math.min(rect.bottom, window.innerHeight) -
        Math.max(rect.top, 0)
      );

      return { section, height };
    })
    .sort((a, b) => b.height - a.height);

  const current = visible[0]?.height > 0
    ? visible[0].section
    : null;

  const root = current || document.querySelector('main');

  const nodes = root
    ? [...root.querySelectorAll(
      'h1, h2, h3, h4, p, li, a, button, span'
    )]
    : [];

  const text = nodes
    .filter(element => {
      const r = element.getBoundingClientRect();

      return (
        r.width > 0 &&
        r.height > 0 &&
        r.bottom > 0 &&
        r.top < window.innerHeight &&
        r.right > 0 &&
        r.left < window.innerWidth
      );
    })
    .map(element => element.innerText?.trim())
    .filter(Boolean);

  return {
    path: window.location.pathname,
    section: current?.id || 'home',
    visibleText: [...new Set(text)]
      .join(' ')
      .slice(0, 2500)
  };
}

function ProjectCards({ projects }) {
  if (!projects?.length) return null;

  return (
    <div className="chat-projects">
      {projects.map(project => {
        const demoUrl = safeURL(
          project.liveUrl || project.link
        );

        const githubUrl = safeURL(project.githubUrl);

        return (
          <article
            className="chat-project-card"
            key={project.number || project.title}
          >
            {project.image && (
              <img
                src={project.image}
                alt={`${project.title} preview`}
                loading="lazy"
              />
            )}

            <div className="chat-project-info">
              {project.category && (
                <span className="chat-project-category">
                  {project.category}
                </span>
              )}

              <h3>{project.title}</h3>
              <p>{project.description}</p>

              {project.tags?.length > 0 && (
                <div className="chat-project-tags">
                  {project.tags.map(tag => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              )}

              {(demoUrl || githubUrl) && (
                <div className="chat-project-links">
                  {demoUrl && (
                    <a
                      href={demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Live Demo ↗
                    </a>
                  )}

                  {githubUrl && (
                    <a
                      href={githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      GitHub ↗
                    </a>
                  )}
                </div>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

export default function Chatbot({
  profile,
  isOpen,
  onOpen,
  onClose
}) {
  const [status, setStatus] = useState({
    mode: 'demo',
    provider: 'demo'
  });

  const [messages, setMessages] = useState([welcome]);
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);

  const lastFocus = useRef(null);
  const inputRef = useRef(null);
  const panelRef = useRef(null);
  const scrollRef = useRef(null);
  const nextId = useRef(1);
  const busyRef = useRef(false);

  useEffect(() => {
    let active = true;

    fetch('/api/status')
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(data => {
        if (active) {
          setStatus({
            mode: data.mode || 'demo',
            provider: data.provider || 'demo'
          });
        }
      })
      .catch(() => {
        if (active) {
          setStatus({ mode: 'demo', provider: 'demo' });
        }
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('chat-open', isOpen);

    if (isOpen) {
      lastFocus.current = document.activeElement;
      requestAnimationFrame(() => inputRef.current?.focus());
    } else if (lastFocus.current) {
      lastFocus.current.focus?.();
      lastFocus.current = null;
    }

    return () => document.body.classList.remove('chat-open');
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop =
        scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!isOpen) return;

    const keyDown = event => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) return;

      const controls = [
        ...panelRef.current.querySelectorAll(
          'button:not(:disabled), input:not(:disabled), a[href]'
        )
      ];

      if (!controls.length) return;

      const first = controls[0];
      const last = controls[controls.length - 1];

      if (
        event.shiftKey &&
        document.activeElement === first
      ) {
        event.preventDefault();
        last.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === last
      ) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', keyDown);

    return () => {
      document.removeEventListener('keydown', keyDown);
    };
  }, [isOpen, onClose]);

  const update = (id, details) => {
    setMessages(previous =>
      previous.map(msg =>
        msg.id === id
          ? { ...msg, ...details, pending: false }
          : msg
      )
    );
  };

  async function sendQuestion(question) {
    const q = String(question || '').trim();

    if (!q || busyRef.current) return;

    busyRef.current = true;
    setBusy(true);
    setText('');

    const id = nextId.current++;
    const userId = nextId.current++;

    setMessages(prev => [
      ...prev,
      { id: userId, who: 'user', text: q },
      {
        id,
        who: 'bot',
        text: 'Thinking ···',
        pending: true
      }
    ]);

    try {
      // RESUME QUESTIONS
      if (isResumeQuestion(q)) {
        update(id, {
          text: 'Absolutely! You can view or download Pushparaj’s resume here:',
          links: [
            {
              text: 'View Resume',
              href: '/resume.pdf',
              icon: 'fa-solid fa-eye',
              target: '_blank'
            },
            {
              text: 'Download Resume',
              href: '/resume.pdf',
              icon: 'fa-solid fa-download',
              download: 'Pushparaj_Supekar_Resume.pdf'
            }
          ]
        });
      }

      // CONTACT QUESTIONS
      else if (isContactQuestion(q)) {
        const links = [];

        if (
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            profile.email || ''
          )
        ) {
          links.push({
            text: 'Email',
            href: `mailto:${profile.email}`,
            icon: 'fa-solid fa-envelope'
          });
        }

        if (safeURL(profile.linkedin)) {
          links.push({
            text: 'LinkedIn',
            href: safeURL(profile.linkedin),
            icon: 'fa-brands fa-linkedin',
            target: '_blank'
          });
        }

        if (safeURL(profile.github)) {
          links.push({
            text: 'GitHub',
            href: safeURL(profile.github),
            icon: 'fa-brands fa-github',
            target: '_blank'
          });
        }

        update(
          id,
          links.length
            ? {
              text: 'You can connect with Pushparaj through these links:',
              links
            }
            : {
              text: 'Please use the Contact section to reach out.'
            }
        );
      }

      // GEMINI AI QUESTIONS
      else {
        const controller = new AbortController();

        const timer = setTimeout(
          () => controller.abort(),
          39000
        );

        try {
          const res = await fetch('/api/chat', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              message: q,
              page: getCurrentPageContext()
            }),
            signal: controller.signal
          });

          const data = await res.json().catch(() => ({}));

          if (!res.ok) {
            throw new Error(
              data.error || `HTTP ${res.status}`
            );
          }

          update(id, {
            text: data.reply || 'No response was returned.',
            projects: Array.isArray(data.projects)
              ? data.projects
              : []
          });
        } finally {
          clearTimeout(timer);
        }
      }
    } catch (error) {
      console.warn('Chatbot:', error.message);

      update(id, {
        text: 'Sorry, I could not process your request right now. Please try again.',
        projects: []
      });
    } finally {
      busyRef.current = false;
      setBusy(false);
      inputRef.current?.focus();
    }
  }

  return (
    <>
      <button
        className="floating-chat"
        type="button"
        aria-label="Open AI portfolio assistant"
        aria-expanded={isOpen}
        onClick={onOpen}
      >
        <span className="floating-chat-icon">✳</span>
        <span>Ask My AI</span>
        <span className="online-indicator" />
      </button>

      <div
        className="chat-scrim"
        hidden={!isOpen}
        onClick={onClose}
      />

      <aside
        ref={panelRef}
        className={`chat-panel${isOpen ? ' open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="chat-heading"
        aria-hidden={!isOpen}
        inert={!isOpen}
      >
        <header className="chat-top">
          <div className="chat-bot-avatar">✳</div>

          <div>
            <h2 id="chat-heading">Portfolio AI</h2>
            <p>
              <span className="online-indicator" />{' '}
              <span>
                {status.mode === 'ai'
                  ? 'Live assistant'
                  : 'Demo assistant online'}
              </span>
            </p>
          </div>

          <button
            type="button"
            className="chat-close"
            aria-label="Close assistant"
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <div
          className="chat-messages"
          ref={scrollRef}
          aria-live="polite"
        >
          {messages.map(msg => (
            <div
              className={`chat-msg ${msg.who}${msg.pending ? ' pending' : ''}`}
              key={msg.id}
            >
              {msg.who === 'bot' && (
                <div className="msg-avatar">✳</div>
              )}

              <div className="chat-msg-content">
                {msg.links?.length ? (
                  <div className="resume-chat-content">
                    <p>{msg.text}</p>

                    <div className="resume-chat-actions">
                      {msg.links.map(link => (
                        <a
                          key={link.text}
                          href={link.href}
                          target={link.target}
                          rel={
                            link.target === '_blank'
                              ? 'noopener noreferrer'
                              : undefined
                          }
                          download={link.download}
                        >
                          <i
                            className={link.icon}
                            aria-hidden="true"
                          />
                          <span>{link.text}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p>{msg.text}</p>
                )}

                <ProjectCards projects={msg.projects} />
              </div>
            </div>
          ))}
        </div>

        <div className="chat-suggestions">
          {suggestions.map(([label, question]) => (
            <button
              type="button"
              key={label}
              disabled={busy}
              onClick={() => sendQuestion(question)}
            >
              {label}
            </button>
          ))}
        </div>

        <form
          className="chat-form"
          onSubmit={e => {
            e.preventDefault();
            sendQuestion(text);
          }}
        >
          <label className="sr-only" htmlFor="chat-input">
            Ask a question
          </label>

          <input
            ref={inputRef}
            id="chat-input"
            autoComplete="off"
            placeholder="Ask about this portfolio..."
            maxLength={500}
            required
            value={text}
            onChange={e => setText(e.target.value)}
          />

          <button
            type="submit"
            aria-label="Send message"
            disabled={busy}
          >
            ➤
          </button>
        </form>

        <p className="chat-disclaimer">
          {status.mode === 'ai'
            ? 'AI responses may make mistakes. Verify important facts.'
            : 'Demo mode. Set GEMINI_API_KEY on the server for live responses.'}
        </p>
      </aside>
    </>
  );
}
