import { useEffect, useRef, useState } from 'react';
import { safeURL } from '../utils.js';

// function ResumeMenu({ available, forceOpen }) {
//   const [open, setOpen] = useState(false);
//   const wrapper = useRef(null);
//   useEffect(() => { if (forceOpen) setOpen(true); }, [forceOpen]);
//   useEffect(() => {
//     const onOutside = event => { if (!wrapper.current?.contains(event.target)) setOpen(false); };
//     document.addEventListener('pointerdown', onOutside);
//     return () => document.removeEventListener('pointerdown', onOutside);
//   }, []);
//   return <div className="resume-selector" ref={wrapper}>
//     <button type="button" id="resume-menu-toggle" aria-expanded={open} aria-controls="resume-popup" onClick={() => setOpen(x => !x)}>RESUME <span>↗</span></button>
//     <div id="resume-popup" className="resume-popup" hidden={!open}>
//       {available ? <>
//         <a href="/resume.pdf" target="_blank" rel="noopener noreferrer"><i className="fa-solid fa-eye" aria-hidden="true" /> View Resume</a>
//         <a href="/resume.pdf" download="Pushparaj_Supekar_Resume.pdf"><i className="fa-solid fa-download" aria-hidden="true" /> Download Resume</a>
//       </> : <span className="resume-unavailable">Add <code>resume.pdf</code> to the project root to enable this.</span>}
//     </div>
//   </div>;
// }

  function ResumeMenu({ forceOpen }) {
    const [open, setOpen] = useState(false);
    const wrapper = useRef(null);

    useEffect(() => {
      if (forceOpen) setOpen(true);
    }, [forceOpen]);

    useEffect(() => {
      const onOutside = event => {
        if (!wrapper.current?.contains(event.target)) {
          setOpen(false);
        }
      };

      document.addEventListener('pointerdown', onOutside);
      return () => document.removeEventListener('pointerdown', onOutside);
    }, []);

    return (
      <div className="resume-selector" ref={wrapper}>
        <button
          type="button"
          id="resume-menu-toggle"
          aria-expanded={open}
          aria-controls="resume-popup"
          onClick={() => setOpen(x => !x)}
        >
          RESUME <span>↗</span>
        </button>

        <div
          id="resume-popup"
          className="resume-popup"
          hidden={!open}
        >
          <a
            href="/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
          >
            <i className="fa-solid fa-eye" aria-hidden="true" />
            View Resume
          </a>

          <a
            href="/resume.pdf"
            download="Pushparaj_Supekar_Resume.pdf"
            onClick={() => setOpen(false)}
          >
            <i className="fa-solid fa-download" aria-hidden="true" />
            Download Resume
          </a>
        </div>
      </div>
    );
  }


function ContactForm() {
  const [status, setStatus] = useState({ text: 'Messages are submitted securely through Formspree without leaving this page.', type: '' });
  const [sending, setSending] = useState(false);
  const endpoint = import.meta.env.VITE_FORMSPREE_URL || '';
  const handleSubmit = async event => {
    event.preventDefault();
    if (sending) return;
    if (!/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(endpoint)) {
      setStatus({ text: 'Contact form is not configured. Set VITE_FORMSPREE_URL in .env, then rebuild.', type: 'error' });
      return;
    }
    const form = event.currentTarget;
    const formData = new FormData(form);
    const fullName = [formData.get('first'), formData.get('last')].filter(Boolean).join(' ').trim();
    formData.set('_subject', `Portfolio inquiry from ${fullName || 'a visitor'}`);
    setSending(true);
    setStatus({ text: 'Sending your message...', type: '' });
    try {
      const response = await fetch(endpoint, { method: 'POST', body: formData, headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`Formspree returned ${response.status}`);
      setStatus({ text: '✅ Your message was sent successfully!', type: 'success' });
      form.reset();
    } catch (error) {
      console.error('Contact form:', error);
      setStatus({ text: '❌ Unable to send your message. Check your form setup and try again.', type: 'error' });
    } finally { setSending(false); }
  };
  return <form className="contact-form reveal" id="contact-form" onSubmit={handleSubmit}>
    <h3>Send a message <span>↗</span></h3>
    <div className="field-row"><label>First name<input name="first" placeholder="First name" autoComplete="given-name" required maxLength={60} /></label>
      <label>Last name<input name="last" placeholder="Last name" autoComplete="family-name" maxLength={60} /></label></div>
    <label>Email address<input name="email" type="email" placeholder="you@example.com" autoComplete="email" required maxLength={120} /></label>
    <label>Your message<textarea name="message" placeholder="Tell me about your idea..." required rows={5} maxLength={2500} /></label>
    <button className="btn btn-primary contact-submit" type="submit" disabled={sending}>{sending ? 'Sending...' : <>Send Message <span>↗</span></>}</button>
    <p className={`form-note${status.type ? ` status-${status.type}` : ''}`} role="status" aria-live="polite">{status.text}</p>
  </form>;
}

export default function Contact({ profile, resumeAvailable, forceOpen }) {
  const github = safeURL(profile.github);
  const linkedin = safeURL(profile.linkedin);
  return <section id="contact" className="section contact-section" aria-labelledby="contact-title"><div className="shell">
    <div className="section-heading reveal">
      {/* <span className="eyebrow">04 / SAY HELLO</span> */}
      <h2 id="contact-title">Get in <span className="orange-text">Touch.</span></h2><p>Have an idea or opportunity? I'd love to hear about it.</p></div>
    <div className="contact-grid">
      <div className="contact-art reveal"><div className="contact-envelope"><span className="mail-bubble">✉</span><span className="mail-notification">1</span></div>
        <h3>Let's build something<br /><span>great together!</span></h3>
        <p>Open to discussing web development, AI ideas, and opportunities to collaborate.</p>
        <div className="contact-socials">{github && <a href={github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>}
          {linkedin && <a href={linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>}
        </div>
        <ResumeMenu forceOpen={forceOpen} />
      </div>
      <ContactForm />
    </div>
  </div></section>;
}
