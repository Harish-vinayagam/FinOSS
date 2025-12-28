import { Routes, Route, Link } from "react-router-dom";
import "./App.css";

import Explore from "./pages/Explore"; // make sure this exists

function App() {
  return (
    <>
      {/* Navbar */}
      <header className="navbar">
        <div className="brand">FinOSS</div>

        <a
          href="https://github.com/Harish-vinayagam/FinOSS"
          target="_blank"
          rel="noopener noreferrer"
          className="github-str"
        >
          ☆ Star on GitHub
        </a>
      </header>

      {/* Routes control what page is shown */}
      <Routes>
        {/* Landing Page */}
        <Route
          path="/"
          element={
            <section className="land">
              <video
                className="bg-video"
                autoPlay
                loop
                muted
                playsInline
              >
                {/* IMPORTANT: no /public in the path */}
                <source src="/bg-video.mp4" type="video/mp4" />
              </video>

              <div className="desc">
                A lightweight discovery layer on top of GitHub. Browse, filter,
                and find the perfect open-source tools for your next project—all
                in one clean interface.

                <Link to="/explore" className="primary-btn">
                  Explore Now
                </Link>
              </div>
            </section>
          }
        />

        {/* Explore Page */}
        <Route path="/explore" element={<Explore />} />
      </Routes>
    </>
  );
}

export default App;
