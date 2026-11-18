
import { useEffect, useState } from 'react';

import {
  SiPython,
  SiFastapi,
  SiDjango,
  SiJavascript,
  SiReact,
  SiHtml5,
  SiMysql,
  SiPostgresql,
  SiGit,
  SiGithub,
  SiPandas,
  SiNumpy,
  SiScikitlearn,
  SiStreamlit,
  SiDocker
} from 'react-icons/si';

import {
  FaServer,
  FaDatabase,
  FaBrain,
  FaRobot,
  FaChartBar,
  FaProjectDiagram,
  FaCode,
  FaCss3Alt
} from 'react-icons/fa';

import {
  safeURL,
  skillCategory,
  themes
} from '../utils.js';

// SKILL LOGOS
const skillLogos = {
  python: [{ Icon: SiPython, color: '#3776AB' }],
  fastapi: [{ Icon: SiFastapi, color: '#009688' }],
  django: [{ Icon: SiDjango, color: '#44B78B' }],

  'rest apis': [{ Icon: FaServer, color: '#FF951E' }],

  javascript: [{ Icon: SiJavascript, color: '#F7DF1E' }],
  react: [{ Icon: SiReact, color: '#61DAFB' }],
  'react.js': [{ Icon: SiReact, color: '#61DAFB' }],

  'html / css': [
    { Icon: SiHtml5, color: '#E34F26' },
    { Icon: FaCss3Alt, color: '#1572B6' }
  ],

  sql: [{ Icon: FaDatabase, color: '#FF951E' }],
  mysql: [{ Icon: SiMysql, color: '#4479A1' }],
  postgresql: [{ Icon: SiPostgresql, color: '#4169E1' }],

  'git / github': [
    { Icon: SiGit, color: '#F05032' },
    { Icon: SiGithub, color: '#FF951E' }
  ],

  pandas: [{ Icon: SiPandas, color: '#E70488' }],
  numpy: [{ Icon: SiNumpy, color: '#4DABCF' }],

  'scikit-learn': [
    { Icon: SiScikitlearn, color: '#F7931E' }
  ],

  'machine learning': [
    { Icon: FaBrain, color: '#FF951E' }
  ],

  'llm apps': [
    { Icon: FaRobot, color: '#FF951E' }
  ],

  rag: [
    { Icon: FaProjectDiagram, color: '#FF951E' }
  ],

  'data visualization': [
    { Icon: FaChartBar, color: '#FF951E' }
  ],

  streamlit: [
    { Icon: SiStreamlit, color: '#FF4B4B' }
  ],

  docker: [
    { Icon: SiDocker, color: '#2496ED' }
  ]
};

// SKILLS SECTION
export function Skills({ profile }) {
  const skills = [...new Set(profile?.skills || [])];

  return (
    <section
      id="skills"
      className="section skills-section"
      aria-labelledby="skills-title"
    >
      <div className="shell">

        <div className="section-heading reveal">
          <h2 id="skills-title">
            My <span className="orange-text">Skills.</span>
          </h2>
          <p>
            From crafting responsive interfaces to building
            powerful backends, these are the technologies I use
            to transform ideas into real-world applications.
          </p>
        </div>

        <div className="skills-grid" id="skills-grid">
          {skills.map(skill => {
            const key = String(skill).trim().toLowerCase();
            const logos = skillLogos[key] || [
              { Icon: FaCode, color: '#FF951E' }
            ];

            return (
              <article className="skill-card reveal" key={skill}>
                <div className="skill-row">

                  <span
                    className={`skill-icon ${
                      logos.length > 1 ? 'skill-icon-double' : ''
                    }`}
                    aria-hidden="true"
                  >
                    {logos.map(({ Icon, color }, index) => (
                      <Icon key={index} color={color} />
                    ))}
                  </span>

                  <span className="skill-category">
                    {skillCategory(skill)}
                  </span>
                </div>

                <h3>{skill}</h3>

                <div className="skill-track" aria-hidden="true">
                  <span style={{ '--bar-width': '100%' }} />
                </div>
              </article>
            );
          })}
        </div>

      </div>
    </section>
  );
}

// PROJECT BUTTONS
function ProjectActions({ project }) {
  const live = safeURL(project.liveUrl || project.link);
  const github = safeURL(project.githubUrl);

  if (!live && !github) {
    return (
      <span className="project-link is-placeholder">
        Demo and code links coming soon
      </span>
    );
  }

  return (
    <div className="project-actions">
      {live && (
        <a
          className="project-btn live"
          href={live}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i
            className="fa-solid fa-arrow-up-right-from-square"
            aria-hidden="true"
          />
          <span>Live Demo</span>
        </a>
      )}

      {github && (
        <a
          className="project-btn github"
          href={github}
          target="_blank"
          rel="noopener noreferrer"
        >
          <i
            className="fa-brands fa-github"
            aria-hidden="true"
          />
          <span>GitHub Code</span>
        </a>
      )}
    </div>
  );
}

// NORMALIZE PUBLIC IMAGE PATHS
function getProjectImagePath(image) {
  const path = String(image || '').trim();

  if (!path) return '';

  // Absolute URLs: https://example.com/image.png
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  // public/projects/example.png -> /projects/example.png
  if (path.startsWith('public/')) {
    return '/' + path.slice('public/'.length);
  }

  // ./projects/example.png -> /projects/example.png
  if (path.startsWith('./projects/')) {
    return path.slice(1);
  }

  // projects/example.png -> /projects/example.png
  if (path.startsWith('projects/')) {
    return '/' + path;
  }

  return path;
}

// PROJECT SCREENSHOT WITH FALLBACK
function ProjectThumbnail({ project, index }) {
  const imageSrc = getProjectImagePath(project.image);
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [imageSrc]);

  const showImage = Boolean(imageSrc) && !imageFailed;
  const symbol = ['✳', '</>', '▥', 'AI'][index % 4];

  return (
    <div
      className={`project-thumbnail ${
        themes[index % themes.length]
      } ${showImage ? 'has-image' : ''}`}
    >
      {showImage ? (
        <img
          src={imageSrc}
          alt={`${project.title} project screenshot`}
          className="project-screenshot"
          loading="lazy"
          decoding="async"
          onError={() => {
            console.error(
              'Project screenshot failed to load:',
              imageSrc
            );
            setImageFailed(true);
          }}
        />
      ) : (
        <div className="project-screen">
          <div className="project-screen-top">
            <i />
            <i />
            <i />
          </div>

          <div className="project-screen-inner">
            <div className="project-screen-side">
              <span />
              <span />
              <span />
              <span />
            </div>

            <div className="project-screen-main">
              <div className="project-screen-heading" />

              <div className="project-screen-panels">
                <b>{symbol}</b>
                <b>↗</b>
              </div>

              <div className="project-screen-footer" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// DYNAMIC PROJECTS SECTION
export function Projects({ profile }) {
  const github = safeURL(profile?.github);

  // Show all real projects, without a fixed limit
  const projects = (profile?.projects || []).filter(
    project =>
      !/^SAMPLE PROJECT/i.test(project.category || '')
  );

  return (
    <section
      id="projects"
      className="section shell projects-section"
      aria-labelledby="projects-title"
    >
      <div className="section-heading reveal">
        <h2 id="projects-title">
          Selected <span className="orange-text">Projects.</span>
        </h2>

        <p>
          Real ideas. Real code. Real solutions. Explore the
          projects that define my development journey.
        </p>
      </div>

      <div className="project-grid" id="project-grid">

        {projects.map((project, index) => (
          <article
            className="project-card reveal"
            key={`${project.title}-${index}`}
          >

            <ProjectThumbnail
              project={project}
              index={index}
            />

            <div className="project-content">
              <h3>{project.title}</h3>

              <p>{project.description}</p>

              <div className="project-tags">
                {(project.tags || []).slice(0, 5).map(tag => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>

              <div className="project-bottom">
                <ProjectActions project={project} />
              </div>
            </div>

          </article>
        ))}

      </div>

      {projects.length === 0 && (
        <p className="projects-empty">
          New projects coming soon.
        </p>
      )}

      {github && (
        <div className="center-actions">
          <a
            className="btn btn-outline"
            href={github}
            target="_blank"
            rel="noopener noreferrer"
          >
            Explore GitHub <span>↗</span>
          </a>
        </div>
      )}
    </section>
  );
}
