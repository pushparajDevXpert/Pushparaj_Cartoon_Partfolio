import { useEffect, useRef, useState } from 'react';

const phrases = ["Let's create something awesome!", 'Glad you stopped by! ✨', 'Python + creativity = magic! ✳', 'Let’s make ideas real! 🚀', 'Code. Create. Repeat. ✦'];

export default function HeroVisual() {
  const [waving, setWaving] = useState(false);
  const [speech, setSpeech] = useState(phrases[0]);
  const phraseIndex = useRef(0);
  const visualRef = useRef(null);
  const waveTimer = useRef(null);

  useEffect(() => () => clearTimeout(waveTimer.current), []);
  const wave = () => {
    clearTimeout(waveTimer.current);
    setWaving(false);
    // A frame between class changes restarts the arm animation.
    requestAnimationFrame(() => setWaving(true));
    phraseIndex.current = (phraseIndex.current + 1) % phrases.length;
    setSpeech(phrases[phraseIndex.current]);
    waveTimer.current = setTimeout(() => setWaving(false), 1400);
  };
  const pointerMove = (event) => {
    if (!window.matchMedia('(pointer:fine)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--look-x', `${((event.clientX - rect.left - rect.width / 2) / rect.width) * 2}px`);
    event.currentTarget.style.setProperty('--look-y', `${((event.clientY - rect.top - rect.height / 2) / rect.height) * 2}px`);
  };
  const pointerLeave = (event) => {
    event.currentTarget.style.setProperty('--look-x', '0px');
    event.currentTarget.style.setProperty('--look-y', '0px');
  };
  return (
    <div className={`hero-visual rise${waving ? ' waving' : ''}`} aria-label="Animated cartoon developer holding a laptop" onPointerMove={pointerMove} onPointerLeave={pointerLeave} ref={visualRef}>
      <div className="hero-orb" aria-hidden="true"></div>
      <div className="hero-dotted-orbit" aria-hidden="true"></div>
      <span className="deco sparkle sparkle-one" aria-hidden="true">✦</span><span className="deco sparkle sparkle-two" aria-hidden="true">✳</span><span className="deco sparkle sparkle-three" aria-hidden="true">✦</span>
      <span className="deco orbit-chip chip-py" aria-hidden="true">🐍 <b>Python</b></span>
      <span className="deco orbit-chip chip-ai" aria-hidden="true">✦ <b>AI</b></span>
      <span className="deco orbit-chip chip-react" aria-hidden="true">⚛ <b>React</b></span>
      <div className="hi-sticker" id="hi-sticker" aria-hidden="true">Hi!<span>✳</span></div>
      <svg className="developer-svg" viewBox="0 0 590 570" role="img" aria-label="Illustrated smiling developer in an orange hoodie holding a laptop" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="hoodie" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#ffae3f" /><stop offset=".5" stopColor="#fa8114" /><stop offset="1" stopColor="#cb4c08" /></linearGradient>
          <linearGradient id="hair" x1=".2" y1="0" x2=".8" y2="1"><stop stopColor="#43302e" /><stop offset="1" stopColor="#161722" /></linearGradient>
          <linearGradient id="skin" x1="0" y1="0" x2=".7" y2="1"><stop stopColor="#ffd3a6" /><stop offset="1" stopColor="#de9577" /></linearGradient>
          <linearGradient id="laptop" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#35445d" /><stop offset="1" stopColor="#111827" /></linearGradient>
          <filter id="softshadow" x="-25%" y="-25%" width="150%" height="150%"><feDropShadow dx="0" dy="12" stdDeviation="11" floodColor="#11131e" floodOpacity=".33" /></filter>
        </defs>
        <ellipse cx="295" cy="534" rx="217" ry="24" fill="#181222" opacity=".21" />
        <g id="developer-character" filter="url(#softshadow)">

          <g className="wave-arm" transform="translate(389 309)">
            <path d="M0 53 Q33 36 56 7 L83 14 Q73 71 27 103Z" fill="url(#hoodie)" stroke="#7d3b26" strokeWidth="7" />
            <path d="M60 16 Q46 -4 51 -26 Q48 -51 58 -51 Q69 -49 70 -29 L72 -69 Q74 -84 85 -79 Q95 -76 93 -62 L92 -41 Q108 -65 117 -60 Q131 -50 109 -24 Q135 -41 142 -29 Q145 -19 122 -5 Q134 -5 131 5 Q123 21 93 31 L86 50Z" fill="url(#skin)" stroke="#965b4d" strokeWidth="6" strokeLinejoin="round" />
          </g>

          <path d="M136 446 Q138 341 205 313 Q240 302 289 310 Q350 303 398 342 Q451 387 461 507 L423 541 L161 541Z" fill="url(#hoodie)" stroke="#8b3e2e" strokeWidth="8" />
          <path d="M204 327 Q246 379 302 379 Q343 378 375 333 Q350 318 330 312 L261 304Z" fill="#e66b10" stroke="#a34524" strokeWidth="6" />
          <path d="M247 361 L240 425 M337 359 L350 429" fill="none" stroke="#f7d8a7" strokeWidth="8" strokeLinecap="round" />
          <path d="M222 459 Q292 442 363 457 L349 503 L239 503Z" fill="#db6813" opacity=".56" />

          <path d="M249 282 L249 343 Q296 369 339 335 L331 278Z" fill="url(#skin)" stroke="#995c52" strokeWidth="6" />

          <ellipse cx="182" cy="229" rx="26" ry="40" fill="url(#skin)" stroke="#995e50" strokeWidth="6" />
          <ellipse cx="394" cy="229" rx="26" ry="40" fill="url(#skin)" stroke="#995e50" strokeWidth="6" />

          <path d="M189 155 Q203 104 274 95 Q350 89 387 157 L387 244 Q378 321 298 329 Q215 331 190 254Z" fill="url(#skin)" stroke="#975b50" strokeWidth="7" />

          <path d="M183 214 Q148 162 176 120 Q166 76 219 64 Q241 23 288 56 Q316 17 346 52 Q402 41 414 97 Q454 124 404 193 L389 204 Q388 159 369 144 Q335 147 319 129 Q268 153 239 137 Q209 178 188 173Z" fill="url(#hair)" stroke="#171722" strokeWidth="8" />
          <path d="M195 135 Q207 92 242 92 M244 116 Q250 65 298 77 M306 109 Q339 62 377 101" fill="none" stroke="#756058" strokeWidth="12" strokeLinecap="round" opacity=".65" />

          <path d="M218 200 Q244 190 262 201 M317 201 Q345 189 367 202" stroke="#463130" strokeWidth="9" strokeLinecap="round" fill="none" />

          <g fill="#fff" fillOpacity=".16" stroke="#242532" strokeWidth="9">
            <rect x="205" y="204" width="70" height="51" rx="21" />
            <rect x="307" y="204" width="70" height="51" rx="21" />
          </g>
          <path d="M276 219 Q291 210 306 219 M204 223 L187 215 M377 222 L396 215" stroke="#242532" strokeWidth="8" fill="none" strokeLinecap="round" />
          <g className="developer-eyes">
            <ellipse cx="241" cy="228" rx="7" ry="10" fill="#2d2531" />
            <ellipse cx="340" cy="228" rx="7" ry="10" fill="#2d2531" />
            <ellipse cx="244" cy="224" rx="2.5" ry="3" fill="white" />
            <ellipse cx="343" cy="224" rx="2.5" ry="3" fill="white" />
          </g>
          <path d="M290 235 Q281 265 299 266" stroke="#bb7969" strokeWidth="5" strokeLinecap="round" fill="none" />
          <path d="M266 284 Q294 303 327 284" stroke="#783d3e" strokeWidth="6" strokeLinecap="round" fill="none" />
          <circle cx="210" cy="270" r="15" fill="#ed937c" opacity=".22" /><circle cx="365" cy="270" r="15" fill="#ed937c" opacity=".22" />

          <path d="M184 375 Q146 395 131 450 Q128 479 166 489 L229 466 Q224 430 202 410Z" fill="url(#hoodie)" stroke="#8b3e2e" strokeWidth="7" />
          <ellipse cx="231" cy="469" rx="29" ry="19" transform="rotate(-12 231 469)" fill="url(#skin)" stroke="#9b5a4c" strokeWidth="5" />

          <g className="developer-laptop">
            <path d="M178 400 L418 400 Q430 400 428 418 L406 510 Q404 524 388 524 L207 524 Q191 524 188 510 L165 422 Q162 403 178 400Z" fill="url(#laptop)" stroke="#131d2b" strokeWidth="8" />
            <path d="M186 418 L408 418 L384 504 L209 504Z" fill="#36475f" opacity=".66" />
            <circle cx="297" cy="462" r="24" fill="#f79527" opacity=".91" />
            <path d="M288 456 L278 463 L288 470 M306 456 L317 463 L306 470" stroke="#fff" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M155 524 L433 524 L444 538 Q441 547 421 548 L168 548 Q148 545 151 537Z" fill="#8c9aab" stroke="#293043" strokeWidth="5" />
          </g>
        </g>
      </svg>
      <div className="hero-speech" id="hero-speech" aria-live="polite">{speech} <span>✦</span></div>
      <button className="wave-button" type="button" id="wave-button" onClick={wave} aria-label="Make the cartoon developer wave">👋 Say hi!</button>
    </div>
  );
}
