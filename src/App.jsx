import { useCallback, useEffect, useState } from 'react';
import profile from '../site-data.json';
import Navbar from './components/Navbar.jsx';
import { Hero, Ticker, About, AssistantCallout } from './components/HeroAbout.jsx';
import { Skills, Projects } from './components/SkillsProjects.jsx';
import Contact from './components/Contact.jsx';
import Chatbot from './components/Chatbot.jsx';

function useRevealOnScroll() {
  useEffect(() => {
    const nodes = document.querySelectorAll('.reveal, .rise');
    if (!('IntersectionObserver' in window)) { nodes.forEach(node => node.classList.add('visible')); return; }
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  }, []);
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem('portfolio-theme') === 'light' ? 'light' : 'dark'; }
    catch { return 'dark'; }
  });
  const [chatOpen, setChatOpen] = useState(false);
  const [resumeOpenTrigger, setResumeOpenTrigger] = useState(0);
  const [resumeAvailable, setResumeAvailable] = useState(false);
  useRevealOnScroll();

  useEffect(() => {
    document.body.dataset.theme = theme;
    try { localStorage.setItem('portfolio-theme', theme); } catch { /* blocked storage */ }
  }, [theme]);
  useEffect(() => {
    document.title = `${profile.shortName} Portfolio`;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.content = `${profile.name} — ${profile.role}. Animated React full-stack Python and AI portfolio.`;
    let active = true;
    fetch('/api/resume-status', { cache: 'no-store' }).then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { if (active) setResumeAvailable(Boolean(data.available)); })
      .catch(() => { if (active) setResumeAvailable(false); });
    return () => { active = false; };
  }, []);

  const openChat = useCallback(() => setChatOpen(true), []);
  const closeChat = useCallback(() => setChatOpen(false), []);
  const openResume = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    setResumeOpenTrigger(v => v + 1);
  };

  return <>
    <div className="noise" aria-hidden="true"/>
    <Navbar theme={theme} onThemeChange={setTheme}/>
    <main>
      <Hero profile={profile} onOpenResume={openResume}/>
      <Ticker/>
      <About profile={profile}/>
      <Skills profile={profile}/>
      <Projects profile={profile}/>
      <AssistantCallout onOpenChat={openChat}/>
      <Contact profile={profile} resumeAvailable={resumeAvailable} forceOpen={resumeOpenTrigger}/>
    </main>
    <footer className="site-footer"><div className="shell footer-inner"><a href="#home">Portfolio<span className="orange-dot">.</span></a>
      <p>Built with curiosity &amp; a little bit of magic ✳</p><span>© {new Date().getFullYear()} Pushparaj Supekar</span>
    </div></footer>
    <Chatbot profile={profile} isOpen={chatOpen} onOpen={openChat} onClose={closeChat} resumeAvailable={resumeAvailable}/>
  </>;
}
