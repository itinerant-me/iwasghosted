import './index.css'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import GhostedStory from './pages/GhostedStory'
import AllStories from './pages/AllStories'
import LandingPage from './pages/LandingPage'
import WallOfShame from './pages/WallOfShame'
import Insights from './pages/Insights'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import About from './pages/About'
import Header from './components/Header'

function AppContent() {
  const location = useLocation();
  const showHeader = location.pathname === '/';

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/submit" element={<GhostedStory />} />
        <Route path="/stories" element={<AllStories />} />
        <Route path="/wall-of-shame" element={<WallOfShame />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App