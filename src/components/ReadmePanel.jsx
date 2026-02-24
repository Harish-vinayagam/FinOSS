import { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function ReadmePanel({ repo, onClose, onPanelEnter, onPanelLeave }) {
  const [readme, setReadme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Controls the fade-transition when switching repos
  const [fading, setFading] = useState(false);
  const [displayRepo, setDisplayRepo] = useState(repo);
  const fadeTimer = useRef(null);

  // When repo changes while panel is open, fade out → swap → fade in
  useEffect(() => {
    if (!repo) return;

    if (displayRepo && displayRepo.id !== repo.id) {
      // Already showing a repo — fade out content first
      setFading(true);
      clearTimeout(fadeTimer.current);
      fadeTimer.current = setTimeout(() => {
        setDisplayRepo(repo);
        setFading(false);
      }, 180);
    } else {
      setDisplayRepo(repo);
    }
  }, [repo]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch README whenever displayRepo changes
  useEffect(() => {
    if (!displayRepo) return;

    setReadme(null);
    setLoading(true);
    setError(null);

    const fetchReadme = async () => {
      try {
        const res = await fetch(
          `https://api.github.com/repos/${displayRepo.full_name}/readme`,
          { headers: { Accept: "application/vnd.github+json" } }
        );

        if (!res.ok) {
          throw new Error(res.status === 404 ? "No README found." : `GitHub API error: ${res.status}`);
        }

        const data = await res.json();
        const decoded = atob(data.content.replace(/\n/g, ""));
        setReadme(decoded);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReadme();
  }, [displayRepo]);

  if (!repo) return null;

  return (
    <aside
      className="readme-panel"
      onMouseEnter={onPanelEnter}
      onMouseLeave={onPanelLeave}
    >
      {/* Panel header — fades on repo swap */}
      <div className={`panel-header ${fading ? "panel-content--fading" : ""}`}>
        <div className="panel-header-info">
          <h2 className="panel-repo-name">{displayRepo?.full_name}</h2>
          <div className="panel-meta">
            {displayRepo?.language && <span className="repo-lang">{displayRepo.language}</span>}
            <span>⭐ {displayRepo?.stargazers_count.toLocaleString()}</span>
            <span>🍴 {displayRepo?.forks_count.toLocaleString()}</span>
          </div>
        </div>
        <div className="panel-actions">
          <a
            href={displayRepo?.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="panel-gh-btn"
            title="Open on GitHub"
          >
            ↗ GitHub
          </a>
          <button className="panel-close-btn" onClick={onClose} title="Close">
            ✕
          </button>
        </div>
      </div>

      {/* README body — fades on repo swap */}
      <div className={`panel-body ${fading ? "panel-content--fading" : ""}`}>
        {loading && (
          <div className="panel-loading">
            <div className="panel-spinner" />
            <p>Loading README…</p>
          </div>
        )}
        {error && <p className="panel-error">{error}</p>}
        {readme && (
          <div className="markdown-body">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ href, children }) => (
                  <a href={href} target="_blank" rel="noopener noreferrer">{children}</a>
                ),
                img: ({ src, alt }) => {
                  const resolvedSrc =
                    src && src.startsWith("http")
                      ? src
                      : `https://raw.githubusercontent.com/${displayRepo.full_name}/HEAD/${src}`;
                  return <img src={resolvedSrc} alt={alt} style={{ maxWidth: "100%" }} />;
                },
              }}
            >
              {readme}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </aside>
  );
}

export default ReadmePanel;
