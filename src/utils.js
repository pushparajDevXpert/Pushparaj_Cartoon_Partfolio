

export const safeURL = (value) => {
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
  } catch { return ''; }
};

export const skillIcons = {
  'Python': '🐍', 'FastAPI': '⚡', 'Django': 'D', 'React': '⚛',
  'JavaScript': 'JS', 'Pandas': '▥', 'SQL': '▤', 'PostgreSQL': '▣',
  'Machine Learning': '✧', 'Docker': '◈', 'NumPy': '∑', 'LLM Apps': '✳',
  'RAG': '⌘', 'HTML / CSS': '</>', 'Git / GitHub': '⌁',
  'scikit-learn': '◎', 'Data Visualization': '▥', 'Streamlit': 'S'
};
export const themes = ['purple', 'orange', 'blue', 'green'];
export function skillCategory(skill) {
  if (/python|django|fastapi|rest api/i.test(skill)) return 'Backend';
  if (/javascript|react|html|css/i.test(skill)) return 'Frontend';
  if (/sql|postgres/i.test(skill)) return 'Database';
  if (/pandas|numpy|visual|streamlit/i.test(skill)) return 'Data';
  if (/machine learning|scikit|llm|rag/i.test(skill)) return 'AI / ML';
  if (/docker|git/i.test(skill)) return 'Tools';
  return 'Development';
}
export const isResumeQuestion = (q) => /\b(resume|r[eé]sum[eé]|cv|curriculum vitae|bio[ -]?data)\b/i.test(q);
export const isContactQuestion = (q) => /\b(contact|email|gmail|linkedin|reach|connect|hire)\b/i.test(q);

export function fallbackReply(question, profile) {
  const q = question.toLowerCase();
  if (/project|work|built|portfolio/.test(q)) return `Projects on the site: ${profile.projects.map(p => p.title).join(', ')}. Some are explicitly labeled example concepts; check links for verified work.`;
  if (/skill|tech|python|api|stack|django|fastapi|react|data|ai|machine learning/.test(q)) return `The portfolio lists: ${profile.skills.join(', ')}. Ask Pushparaj for details about specific experience.`;
  if (/contact|email|linkedin|github|hire/.test(q)) return `GitHub: ${profile.github}. ${profile.email ? `Email: ${profile.email}.` : 'You can use the contact form after it is configured.'}`;
  return `Hi! Ask me about ${profile.shortName}'s projects, Python skills, or how to get in touch. Live AI requires a server-side API key.`;
}