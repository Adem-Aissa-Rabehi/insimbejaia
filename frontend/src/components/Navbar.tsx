import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Landmark, Award, ShieldCheck, Lock, Globe, Network, Database, ChevronDown } from 'lucide-react';

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFormationsOpen, setMobileFormationsOpen] = useState(false);
  const [filieres, setFilieres] = useState([]);
  const [formations, setFormations] = useState([]);

  const fetchMenuData = async () => {
    try {
      const [resFils, resForms] = await Promise.all([
        fetch('/filieres'),
        fetch('/formations-data')
      ]);
      if (resFils.ok && resForms.ok) {
        setFilieres(await resFils.json());
        setFormations(await resForms.json());
      }
    } catch (e) {
      console.error('Failed to load menu items', e);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  const getFiliereIcon = (filiereId) => {
    switch (filiereId) {
      case 'hotellerie-tourisme':
        return <Globe size={14} />;
      case 'sciences-gestion':
        return <Award size={14} />;
      case 'informatique-numerique':
        return <Network size={14} />;
      default:
        return <Database size={14} />;
    }
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        {/* Brand/Logo */}
        <Link to="/" className="navbar-brand" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <img src="/logo.png" alt="INSIM Bejaia Logo" style={{ height: '2.5rem', width: 'auto', objectFit: 'contain', size: '200px'  }} />
        </Link>

        {/* Desktop Menu */}
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/" className="navbar-link">Accueil</Link>
          </li>
          <li className="navbar-item">
            <Link to="/a-propos" className="navbar-link">À propos</Link>
          </li>
          
          {/* Mega Menu Trigger */}
          <li 
            className="navbar-item mega-menu-trigger"
            onMouseEnter={fetchMenuData}
          >
            <Link to="/formations" className="navbar-link">Formations</Link>
            
            {/* Mega Menu Dropdown */}
            {filieres.length > 0 && (
              <div 
                className="mega-menu" 
                style={{ 
                  gridTemplateColumns: `repeat(${Math.min(filieres.length, 4)}, 1fr)`, 
                  width: `${Math.min(filieres.length, 4) * 200 + 40}px`,
                  maxWidth: '95vw'
                }}
              >
                {filieres.map(filiere => {
                  const filiereFormations = formations.filter(f => f.filiereId === filiere.id);
                  return (
                    <div key={filiere.id} className="mega-menu-column">
                      <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {getFiliereIcon(filiere.id)} {filiere.name}
                      </h4>
                      <ul className="mega-menu-list">
                        {filiereFormations.map(f => (
                          <li key={f.id}>
                            <Link to={`/formations/${f.id}`} className="mega-menu-link">{f.title}</Link>
                          </li>
                        ))}
                        {filiereFormations.length === 0 && (
                          <li style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            Aucune formation
                          </li>
                        )}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}
          </li>

          <li className="navbar-item">
            <Link to="/contact" className="navbar-link">Contact</Link>
          </li>
          <li className="navbar-item">
            <Link to="/preinscription" className="btn btn-accent" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
              Préinscription
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button 
          className="btn btn-secondary navbar-toggle" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          backgroundColor: 'var(--bg-card)',
          borderBottom: '1px solid var(--border)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 99
        }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: 'var(--text-heading)' }}>Accueil</Link>
          <Link to="/a-propos" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: 'var(--text-heading)' }}>À propos</Link>
          
          {/* Collapsible Formations Accordion */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div 
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, color: 'var(--text-heading)', cursor: 'pointer' }}
              onClick={() => setMobileFormationsOpen(!mobileFormationsOpen)}
            >
              <span>Formations</span>
              <ChevronDown size={18} style={{ transform: mobileFormationsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: 'var(--text-muted)' }} />
            </div>
            {mobileFormationsOpen && (
              <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '1rem', gap: '0.75rem', marginTop: '0.75rem', borderLeft: '2px solid var(--border)' }}>
                {filieres.map(filiere => {
                  const filFormations = formations.filter(f => f.filiereId === filiere.id);
                  return (
                    <div key={filiere.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <div style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--accent)', textTransform: 'uppercase' }}>{filiere.name}</div>
                      {filFormations.map(f => (
                        <Link 
                          key={f.id} 
                          to={`/formations/${f.id}`} 
                          onClick={() => setMobileMenuOpen(false)} 
                          style={{ fontSize: '0.88rem', color: 'var(--text)', padding: '0.15rem 0' }}
                        >
                          {f.title}
                        </Link>
                      ))}
                      {filFormations.length === 0 && (
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>Aucune formation</span>
                      )}
                    </div>
                  );
                })}
                <Link to="/formations" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '0.88rem', color: 'var(--primary)', fontWeight: 700, marginTop: '0.25rem' }}>
                  Voir tout le catalogue &rarr;
                </Link>
              </div>
            )}
          </div>

          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} style={{ fontWeight: 600, color: 'var(--text-heading)' }}>Contact</Link>
          <Link to="/preinscription" onClick={() => setMobileMenuOpen(false)} className="btn btn-accent" style={{ width: '100%', marginTop: '0.5rem' }}>Préinscription en ligne</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
