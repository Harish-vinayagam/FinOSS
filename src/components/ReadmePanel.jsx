import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

function ReadmePanel({ repo, onClose, onPanelEnter, onPanelLeave }) {
  const [readme, setReadme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch README for the given repo
  useEffect(() => {
    if (!repo) return;

    setReadme(null);
    setLoading(true);
    setError(null);

    const fetchReadme = async () => {
      try {
        // GitHub API returns base64-encoded content
        const res = await fetch(
          `https://api.github.com/repos/${repo.full_name}/readme`,
          { headers: { Accept: "application/vnd.github+json" } }
        );

        if (!res.ok) {
          throw new Error(res.status === 404 ? "No README found." : `GitHub API error: ${res.status}`);
        }

        const data = await res.json();
        // Decode base64 content
        const decoded = atob(data.content.replace(/\n/g, ""));
        setReadme(decoded);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReadme();
  }, [repo]);

  if (!repo) return null;

  return (
    <aside
      className="readme-panel"
      onMouseEnter={onPanelEnter}
      onMouseLeave={onPanelLeave}
    >
        {/* Panel header */}
        <div className="panel-header">
          <div className="panel-header-info">
            <h2 className="panel-repo-name">{repo.full_name}</h2>
            <div className="panel-meta">
              {repo.language && <span className="repo-lang">{repo.language}</span>}
              <span>⭐ {repo.stargazers_count.toLocaleString()}</span>
              <span>🍴 {repo.forks_count.toLocaleString()}</span>
            </div>
          </div>
          <div className="panel-actions">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="panel-gh-btn"
              title="Open on GitHub"
            >
              ↗ GitHub
            </a>
            <button className="panel-close-btn" onClick={onClose} title="Close (Esc)">
              ✕
            </button>
          </div>
        </div>

        {/* README content */}
        <div className="panel-body">
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
                  // Open all links in new tab
                  a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer">
                      {children}
                    </a>
                  ),
                  // Resolve relative image URLs to GitHub raw content
                  img: ({ src, alt }) => {
                    const resolvedSrc =
                      src && src.startsWith("http")
                        ? src
                        : `https://raw.githubusercontent.com/${repo.full_name}/HEAD/${src}`;
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
