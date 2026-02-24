import { useEffect, useState, useCallback } from "react";

// Returns today's date minus `days` in YYYY-MM-DD format
function daysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split("T")[0];
}

const CACHE_KEY = "finoss_trending_repos";
const CACHE_DATE_KEY = "finoss_trending_date";

function Explore() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [error, setError] = useState(null);

  const fetchTrendingRepos = useCallback(async (force = false) => {
    const today = new Date().toISOString().split("T")[0];
    const cachedDate = localStorage.getItem(CACHE_DATE_KEY);
    const cachedRepos = localStorage.getItem(CACHE_KEY);

    // Use cache if it's from today and not a forced refresh
    if (!force && cachedDate === today && cachedRepos) {
      setRepos(JSON.parse(cachedRepos));
      setLastRefreshed(cachedDate);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Query: repos pushed in last 7 days, sorted by stars descending
      const since = daysAgo(7);
      const response = await fetch(
        `https://api.github.com/search/repositories?q=pushed:%3E${since}&sort=stars&order=desc&per_page=20`,
        { headers: { Accept: "application/vnd.github+json" } }
      );

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = await response.json();
      const items = data.items || [];

      // Cache results with today's date
      localStorage.setItem(CACHE_KEY, JSON.stringify(items));
      localStorage.setItem(CACHE_DATE_KEY, today);

      setRepos(items);
      setLastRefreshed(today);
    } catch (err) {
      console.error("Error fetching repositories:", err);
      setError("Failed to load repositories. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTrendingRepos();
  }, [fetchTrendingRepos]);

  return (
    <div className="explore-page">
      <div className="explore-header-row">
        <div>
          <h1>Trending Open Source</h1>
          <p className="subtitle">
            Most starred repositories — refreshes daily
            {lastRefreshed && (
              <span className="last-refreshed"> · Last updated: {lastRefreshed}</span>
            )}
          </p>
        </div>
        <button
          className="refresh-btn"
          onClick={() => fetchTrendingRepos(true)}
          disabled={loading}
          title="Force refresh"
        >
          {loading ? "⏳ Loading..." : "↺ Refresh"}
        </button>
      </div>

      {error && <p className="error-msg">{error}</p>}

      {loading ? (
        <p className="loading-msg">Loading trending repositories...</p>
      ) : (
        <div className="repo-list">
          {repos.map((repo) => (
            <a
              key={repo.id}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="repo-row"
            >
              <div className="repo-main">
                <h3>{repo.full_name}</h3>
                <p className="repo-desc">
                  {repo.description || "No description provided."}
                </p>
              </div>

              <div className="repo-meta">
                <span className="repo-lang">{repo.language || "—"}</span>
                <span>⭐ {repo.stargazers_count.toLocaleString()}</span>
                <span>🍴 {repo.forks_count.toLocaleString()}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default Explore;
