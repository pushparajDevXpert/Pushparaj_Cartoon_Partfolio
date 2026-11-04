import { useEffect, useState } from 'react';
import { safeURL } from '../utils.js';
import HeroVisual from './HeroVisual.jsx';

const ROLES = [
  'Full-Stack Python Developer',
  'AI & Data Science Explorer',
  'Building ideas into products'
];

function TypingRole() {
  const [text, setText] = useState(ROLES[0]);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

    let role = 0;
    let length = ROLES[0].length;
    let removing = true;
    let timer;

    function tick() {
      if (removing) {
        length = Math.max(0, length - 1);
        setText(ROLES[role].slice(0, length));
        if (length === 0) {
          role = (role + 1) % ROLES.length;
          removing = false;
          timer = setTimeout(tick, 300);
          return;
        }
      } else {
        length = Math.min(ROLES[role].length, length + 1);
        setText(ROLES[role].slice(0, length));
        if (length === ROLES[role].length) {
          removing = true;
          timer = setTimeout(tick, 1700);
          return;
        }
      }
      timer = setTimeout(tick, removing ? 45 : 70);
    }

    timer = setTimeout(tick, 1700);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="typing-line">
      <span className="typing-chevron">&gt;_</span>
      <span id="typing-role">{text}</span>
      <span className="typing-caret" aria-hidden="true" />
    </div>
  );
}

export function Hero({ profile, onOpenResume }) {
  const first = profile.shortName || profile.name?.split(' ')[0] || 'Pushparaj';
  const github = safeURL(profile.github);
  const linkedin = safeURL(profile.linkedin);
  const focusCount = (profile.focusAreas || []).length;

  return (
    <section id="home" className="hero shell" aria-labelledby="hero-heading">
      <div className="hero-grid">
        <div className="hero-copy rise">
          <div className="hero-socials">
            {github && (
              <a href={github} target="_blank" rel="noopener noreferrer" aria-label="Visit GitHub">GH</a>
            )}
            {linkedin ? (
              <a href={linkedin} target="_blank" rel="noopener noreferrer" aria-label="Visit LinkedIn">in</a>
            ) : (
              <span title="Add a LinkedIn URL in site-data.json" aria-label="LinkedIn not configured">in</span>
            )}
            <span className="social-line" />
            <span>LET'S CONNECT</span>
          </div>

          <h1 id="hero-heading">
            Hi, I'm <span className="orange-text">{first}.</span><br />
            <span className="hero-heading-second">I build <em>ideas</em> into reality.</span>
          </h1>
          <TypingRole />
          <p className="hero-desc">{profile.headline}</p>

          <div className="hero-actions">
            <a className="btn btn-primary" href="#projects">See What I've Built <span>↗</span></a>
            <button className="btn btn-outline" type="button" onClick={onOpenResume}>
              My Resume <span>↓</span>
            </button>
          </div>

          <div className="hero-mini-stats">
            <div><strong>{String(focusCount).padStart(2, '0')}</strong><span>FOCUS AREAS</span></div>
            <i aria-hidden="true" />
            <div><strong>Python</strong><span>BACKEND FIRST</span></div>
            <i aria-hidden="true" />
            <div><strong>AI</strong><span>CURIOUS MIND</span></div>
          </div>
        </div>
        <HeroVisual />
      </div>
    </section>
  );
}

// Repeat the same sequence twice so the marquee loops without a jump.
const TICKER_TEXT = [
  'FULL_STACK PYTHON DEVELOPMENT',
  'AI & MACHINE LEARNING',
  'WEB APPLICATIONS',
  'DATA SCIENCE',
  'REACT JS DEVELOPMENT',
  'PYTHON DEVELOPMENT',
  'DJANGO DEVELOPMENT',
  'MERN STACK DEVELOPMENT',
  'MYSQL DEVELOPMENT',
  'CREATIVE PROBLEM SOLVING'
].join(' ✳ ') + ' ✳ ';

export function Ticker() {
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">
        <span>{TICKER_TEXT}</span><span>{TICKER_TEXT}</span>
      </div>
    </div>
  );
}

export function About({ profile }) {
  return (
    <section id="about" className="section shell about" aria-labelledby="about-title">
      <div className="section-heading reveal">
        <h2 id="about-title">Behind the <span className="orange-text">code.</span></h2>
        <p>Curious mind. Creative hands. Always learning.</p>
      </div>
      <div className="about-grid">
        <div className="about-art reveal">
          <div className="about-art-inner">
            <div className="code-window">
              <div className="window-bar"><span /><span /><span /><small>hello.py</small></div>
              <pre>
                <span className="c-purple">class</span>{' '}<span className="c-yellow">Developer</span>{':\n  name = '}
                <span className="c-green">"Pushparaj"</span>{'\n  passion = [\n    '}
                <span className="c-green">"Python"</span>{',\n    '}
                <span className="c-green">"AI"</span>{',\n    '}
                <span className="c-green">"Building"</span>{'\n  ]\n\n  '}
                <span className="c-purple">def</span>{' '}<span className="c-yellow">mission</span>{'(self):\n    '}
                <span className="c-purple">return</span>{' '}<span className="c-green">"Make it happen!"</span>
              </pre>
            </div>
            <div className="about-star">✳</div>
            <div className="about-sticker">think<br />• create<br />• repeat</div>
          </div>
        </div>
        <div className="about-text reveal">
          <span className="mini-label">MORE THAN JUST CODE</span>
          <h3>Curious by nature.<br /><span>Creator by choice.</span></h3>
          <p>{profile.intro}</p>
          <p>{profile.about}</p>
          <div className="about-values">
            <div><span>✦</span> Building with Purpose</div>
            <div><span>✦</span> Learning Beyond Limits</div>
            <div><span>✦</span> Turning Ideas into Reality</div>
          </div>
          <a className="btn btn-outline" href="#contact">Let's collaborate <span>↗</span></a>
        </div>
      </div>
    </section>
  );
}

// Optional reusable section: kept in code, not mounted by default,
// because it is absent from the supplied HTML reference.
export function AssistantCallout({ onOpenChat }) {
  return (
    <section className="section special-section">
      <div className="shell">
        <div className="special-callout reveal">
          <div className="callout-glow" />
          <div className="callout-content">
            <span className="eyebrow">✳ / MEET MY PORTFOLIO ASSISTANT</span>
            <h2>Don't just read.<br /><span>Ask my AI.</span></h2>
            <p>Explore my skills, projects, and ways to connect through an AI-powered conversation.</p>
            <button type="button" onClick={onOpenChat} className="btn btn-primary">
              Chat with my assistant <span>↗</span>
            </button>
          </div>
          <div className="callout-robot" aria-hidden="true">
            <div className="robot-ant">●</div>
            <div className="robot-head"><span className="robot-eye" /><span className="robot-eye" /><span className="robot-smile" /></div>
            <div className="robot-neck" /><div className="robot-body">AI</div><span className="robot-spark">✦</span>
          </div>
        </div>
      </div>
    </section>
  );
}
