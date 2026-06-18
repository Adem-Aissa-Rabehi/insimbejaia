import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Catalog from './pages/Catalog';
import CourseDetails from './pages/CourseDetails';
import Contact from './pages/Contact';
import PreInscription from './pages/PreInscription';
import AdminDashboard from './pages/AdminDashboard';
import PrivacyPolicy from './pages/PrivacyPolicy';
import BackgroundAnimation from './components/BackgroundAnimation';
import PageLoader from './components/PageLoader';
import CookieConsent from './components/CookieConsent';
import './App.css';

function PageTracker() {
  const location = useLocation();

  React.useEffect(() => {
    // Send the visit to the backend (fire-and-forget, never block the UI)
    fetch('/track/page', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: location.pathname })
    }).catch(() => {}); // Silently ignore errors (e.g. backend down)
  }, [location]);

  React.useEffect(() => {
    // Scroll reveal observer initialization
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (revealElements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target); // Trigger only once
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
    };
  }, [location.pathname]);

  return null;
}

function LayoutWrapper({ children }) {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';
  return (
    <div id="root" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <BackgroundAnimation />
      {!isAdmin && <Navbar />}
      <main style={{ flexGrow: 1 }}>
        {children}
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <CookieConsent />}
    </div>
  );
}

function App() {
  return (
    <Router>
      <PageLoader />
      <PageTracker />
      <LayoutWrapper>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/a-propos" element={<About />} />
          <Route path="/formations" element={<Catalog />} />
          <Route path="/formations/:id" element={<CourseDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/preinscription" element={<PreInscription />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/politique-confidentialite" element={<PrivacyPolicy />} />
        </Routes>
      </LayoutWrapper>
    </Router>
  );
}

export default App;
