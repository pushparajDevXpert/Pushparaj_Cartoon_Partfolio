import { useEffect, useState } from 'react';

export default function Navbar({ theme, onThemeChange }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('home');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const page = document.documentElement;
      const scrollable = page.scrollHeight - window.innerHeight;
      setProgress(scrollable > 0 ? 100 * window.scrollY / scrollable : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const sections = document.querySelectorAll('main section[id]');
    const observer = 'IntersectionObserver' in window
      ? new IntersectionObserver(entries => entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.id);
        }), { rootMargin: '-25% 0px -64% 0px' }) : null;
    sections.forEach(el => observer?.observe(el));
    return () => { window.removeEventListener('scroll', onScroll); observer?.disconnect(); };
  }, []);

  return <>
    <div className="site-progress" aria-hidden="true" style={{ width: `${progress}%` }} />
    <nav className="pill-nav" aria-label="Main navigation">
      <a href="#home" className="nav-logo" aria-label="Pushparaj portfolio home">Portfolio<span className="orange-dot">.</span></a>
      <div className={`nav-links${menuOpen ? ' open' : ''}`} id="nav-links">
        {['Home', 'About', 'Skills', 'Projects', 'Contact'].map(item => <a
          key={item} href={`#${item.toLowerCase()}`}
          onClick={() => setMenuOpen(false)}
          className={`nav-link${active === item.toLowerCase() ? ' active' : ''}`}>{item}</a>)}
      </div>
      <div className="nav-actions">
        <button className="theme-toggle" aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          title="Toggle theme" type="button" onClick={() => onThemeChange(theme === 'dark' ? 'light' : 'dark')}>
          <span className="theme-sun">☀</span><span className="theme-moon">☾</span>
        </button>
        <a href="#contact" className="nav-hire">Hire Me <span>↗</span></a>
        <button className="menu-toggle" type="button" onClick={() => setMenuOpen(v => !v)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'} aria-controls="nav-links" aria-expanded={menuOpen}>
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  </>;
}
