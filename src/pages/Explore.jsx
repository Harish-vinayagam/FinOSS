import { useEffect, useState, useCallback, useMemo } from "react";

const LANGUAGES = ["All", "JavaScript", "TypeScript", "Python", "Go", "Rust", "Java", "C++", "Ruby", "Shell"];
const SORT_OPTIONS = [
  { label: "⭐ Most Stars", value: "stars" },
  { label: "🍴 Most Forks", value: "forks" },
];
const MIN_STARS_OPTIONS = [
  { label: "Any", value: 0 },
  { label: "1k+", value: 1000 },
  { label: "10k+", value: 10000 },
  { label: "50k+", value: 50000 },
  { label: "100k+", value: 100000 },
];

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

  // Filter state
  const [selectedLang, setSelectedLang] = useState("All");
  const [sortBy, setSortBy] = useState("stars");
  const [minStars, setMinStars] = useState(0);

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

  const filteredRepos = useMemo(() => {
    let result = [...repos];

    // Filter by language
    if (selectedLang !== "All") {
      result = result.filter((r) => r.language === selectedLang);
    }

    // Filter by min stars
    if (minStars > 0) {
      result = result.filter((r) => r.stargazers_count >= minStars);
    }

    // Sort
    result.sort((a, b) =>
      sortBy === "forks"
        ? b.forks_count - a.forks_count
        : b.stargazers_count - a.stargazers_count
    );

    return result;
  }, [repos, selectedLang, minStars, sortBy]);

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

      {/* Filter Bar */}
      <div className="filter-bar">
        {/* Language */}
        <div className="filter-group">
          <span className="filter-label">Language</span>
          <div className="filter-chips">
            {LANGUAGES.map((lang) => (
              <button
                key={lang}
                className={`filter-chip ${selectedLang === lang ? "active" : ""}`}
                onClick={() => setSelectedLang(lang)}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="filter-group filter-group--row">
          <span className="filter-label">Sort by</span>
          <div className="filter-chips">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`filter-chip ${sortBy === opt.value ? "active" : ""}`}
                onClick={() => setSortBy(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Min Stars */}
        <div className="filter-group filter-group--row">
          <span className="filter-label">Min Stars</span>
          <div className="filter-chips">
            {MIN_STARS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                className={`filter-chip ${minStars === opt.value ? "active" : ""}`}
                onClick={() => setMinStars(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <span className="filter-count">
          {filteredRepos.length} {filteredRepos.length === 1 ? "repo" : "repos"}
        </span>
      </div>

      {error && <p className="error-msg">{error}</p>}

      {loading ? (
        <p className="loading-msg">Loading trending repositories...</p>
      ) : filteredRepos.length === 0 ? (
        <p className="loading-msg">No repositories match the selected filters.</p>
      ) : (
        <div className="repo-list">
          {filteredRepos.map((repo) => (
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
