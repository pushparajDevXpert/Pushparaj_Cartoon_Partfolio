# Pushparaj  AI Portfolio

An animated, responsive developer portfolio rebuilt in **React + Vite** from the original HTML/CSS/JavaScript portfolio, keeping its orange-accented design, animated illustration, skills, project cards, AI assistant, and contact/resume flows. A small Node server serves the production React build and provides server-side Gemini/OpenAI chat APIs.

## Stack

- Frontend: React 19, Vite, HTML/CSS, JavaScript, Font Awesome
- Backend: Node.js HTTP server (`server.cjs`)
- AI: Gemini (preferred) or OpenAI via **server-side secrets**, with safe demo responses when not configured
- Contact: Formspree AJAX integration (requires your own form URL)
- Deployment: One Render **Web Service** (backend + React build together)

## Setup

Requires **Node.js 20.19+**.

```bash
npm install
cp .env.example .env
```

Edit `.env` with your **own** credentials (never commit the file):

```dotenv
GEMINI_API_KEY=your_real_key
GEMINI_MODEL=gemini-2.5-flash
VITE_FORMSPREE_URL=https://formspree.io/f/your_real_form_id
```

The React frontend gets the Formspree URL at **build time**, so rebuild after changing it. The Gemini/OpenAI keys are read only by the Node server at runtime.

### Development — two terminals

```bash
# Terminal 1: AI backend / resume API (port 3000)
npm run server
```

```bash
# Terminal 2: React/Vite (port 5173), proxies /api and /resume.pdf to backend
npm run dev
```

Open **http://localhost:5173**. `localhost:3000` runs the API during development and doesn't contain the React build until you run `npm run build`.

### Production / local Render-like test

```bash
npm run build
npm start
```

Open **http://localhost:3000**. Never run `vite preview` as your production AI server.

## Render deployment (keep existing Web Service)

- Environment: Node
- Build command: `npm install --no-audit --no-fund && npm run build`
- Start command: `npm start`
- Set runtime `GEMINI_API_KEY` (or `OPENAI_API_KEY`) in Render Environment.
- Set build-time `VITE_FORMSPREE_URL` in Render Environment.
- Deploy from your GitHub branch; do **not** set a `dist` Publish Directory on the Web Service.
- To enable resume, add your real `resume.pdf` in the project root before deployment. Do not upload private PDFs you don't want public.

**Important:** A Vite-only Render Static Site cannot run the included Node AI endpoints. Use a **Web Service** for this combined deployment.

## Customize content

Edit [`site-data.json`](./site-data.json) (name, skills, projects, links, introduction). It is imported into the React build **and** read by the Node server. Rebuild and redeploy after edits.

Project entries accept `liveUrl` and `githubUrl`; missing links are never fabricated. Placeholder/concept projects are identified in their descriptions, not presented as verified completed work.

### Resume

Place `resume.pdf` in the project root. Check `GET /api/resume-status` and `GET /resume.pdf`. The chatbot and Contact section show resume links only if that PDF exists. No sample personal resume is supplied.

### Contact form

Create a Formspree form and set its **public endpoint** as `VITE_FORMSPREE_URL`. Without setup the form shows a clear error rather than pretending to send.

## Project structure

```
├── index.html
├── site-data.json
├── vite.config.js
├── server.cjs
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── utils.js
│   ├── styles.css
│   └── components/
│       ├── Navbar.jsx
│       ├── HeroAbout.jsx
│       ├── HeroVisual.jsx
│       ├── SkillsProjects.jsx
│       ├── Contact.jsx
│       └── Chatbot.jsx
├── public/favicon.svg
├── .env.example
└── package.json
```

## Sanity checks

```bash
npm run check
curl http://localhost:3000/api/status
curl http://localhost:3000/api/resume-status
```

Source GitHub: https://github.com/pushparajDevXpert/pushparaj-ai-portfolio

This React version is a separate downloadable project; uploading it to GitHub and deploying it is a user action and has not been performed automatically.
