# FinOSS

**Find Open Source. Faster.**

FinOSS is a clean and lightweight web application that helps developers discover **popular and recently updated open-source repositories on GitHub** through a simple, distraction-free interface.

It acts as a discovery layer on top of GitHub — surfacing trending projects without requiring complex search queries or bloated UIs.  
Built for speed, clarity, and developer-first usability.

---

## Features

- Browse **trending GitHub repositories** based on popularity and recent activity  
- Clean, minimal **table-style layout** for easy scanning  
- Direct redirection to GitHub repositories  
- Fast client-side rendering with a lightweight setup  
- No authentication, no clutter, no noise  

---

## Tech Stack

- **Frontend:** React + Vite  
- **Routing:** React Router  
- **Styling:** Custom CSS (minimal & responsive)  
- **Data Source:** GitHub Public Search API  

---

## Prerequisites

Make sure the following are installed before running the project:

- Node.js (v18 or later)
- npm (or any compatible package manager)

Verify installation:

```sh
node --version
npm --version


##  Getting Started

Follow these steps to run FinOSS locally.

### 1. Clone the Repository
```bash
git clone https://github.com/Harish-vinayagam/FinOSS.git
cd FinOSS
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```

The app will be available at:

[http://localhost:5173](http://localhost:5173)

---

##  Usage

Once the app is running:

### Landing Page
- Introduces FinOSS and provides a direct entry point to discovery.

### Explore Page
- Displays trending open-source repositories fetched from GitHub, ranked by popularity and recent updates.

### Repository Navigation
- Clicking on any repository redirects directly to its GitHub page in a new tab.

---

##  Project Structure

A simplified view of the project structure:

```
src/
├── pages/
│   └── Explore.jsx
├── App.jsx
├── App.css
├── main.jsx
public/
│   └── bg-video.mp4
index.html
package.json
README.md
```

---

##  GitHub API Usage

FinOSS uses GitHub’s public Search API directly from the client.

- **No authentication required**
- Ideal for demos and portfolio projects
- Subject to GitHub’s public rate limits

> For production-scale usage, API requests can be moved behind a backend to enable caching and higher rate limits.

---

##  Future Improvements

- Language-based filtering
- Sorting by stars, forks, or recent activity
- Loading skeletons for better UX
- Pagination or infinite scrolling
- Optional backend for caching and rate-limit handling
