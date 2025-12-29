import { useEffect, useState } from "react";

function Explore() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingRepos = async () => {
      try {
        
        const response = await fetch(
          "https://api.github.com/search/repositories?q=stars:%3E1000+pushed:%3E2024-01-01&sort=stars&order=desc&per_page=20"
        );

        const data = await response.json();
        setRepos(data.items || []);
      } catch (error) {
        console.error("Error fetching repositories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingRepos();
  }, []);

  return (
    <div className="explore-page">
      <h1>Trending Open Source</h1>
      <p className="subtitle">
        Popular repositories updated recently
      </p>

      {loading ? (
        <p>Loading trending repositories...</p>
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
                <span>{repo.language || "—"}</span>
                <span>⭐ {repo.stargazers_count}</span>
                <span>🍴 {repo.forks_count}</span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default Explore;
