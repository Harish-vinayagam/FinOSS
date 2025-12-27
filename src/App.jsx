import { useState } from 'react'
import { Link } from "react-router-dom";

import './App.css'

function App() {


  return (
    <>
      <header className="navbar">
        <div className="brand"> FinOSS</div>
      </header>
      <a
  href="https://github.com/Harish-vinayagam/FinOSS.git"
  target="_blank"
  rel="noopener noreferrer"
  className="github-str"
>
  ☆ Star on GitHub
</a>
<section className='land'>
<video
    className="bg-video"
    autoPlay
    loop
    muted
    playsInline
  >
    <source src="/public/bg-video.mp4" type="video/mp4" />
  </video>
  <div className='desc'> A lightweight discovery layer on top of GitHub. Browse, filter, and find the perfect open-source tools for your next project—all in one clean interface.
    <Link to="/explore" className='primary-btn'>Get Started </Link>

  </div>
</section>


    </>
    
  )
}

export default App
