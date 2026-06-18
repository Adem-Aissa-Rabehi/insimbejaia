import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Landmark, Award, ShieldCheck, Lock, Globe, Network, Database, ChevronDown } from 'lucide-react';

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileFormationsOpen, setMobileFormationsOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [formations, setFormations] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [activeMobileCategory, setActiveMobileCategory] = useState('');

  const fetchMenuData = async () => {
    try {
      const [resCats, resFils, resForms] = await Promise.all([
        fetch('/categories'),
        fetch('/filieres'),
        fetch('/formations-data')
      ]);
      if (resCats.ok && resFils.ok && resForms.ok) {
        const cats = await resCats.json();
        setCategories(cats);
        setFilieres(await resFils.json());
        setFormations(await resForms.json());
        
        if (cats.length > 0) {
          setActiveCategory(prev => prev || cats[0].id);
          setActiveMobileCategory(prev => prev || cats[0].id);
        }
      }
    } catch (e) {
      console.error('Failed to load menu items', e);
    }
  };

  useEffect(() => {
    fetchMenuData();
  }, []);

  const getFiliereIcon = (filiereId) => {
    const id = filiereId?.toLowerCase() || '';
    if (id.includes('informatique') || id.includes('numerique')) {
      return <Network size={14} />;
    }
    if (id.includes('gestion') || id.includes('commerce') || id.includes('administration')) {
      return <Award size={14} />;
    }
    if (id.includes('tourisme') || id.includes('hotellerie') || id.includes('voyage')) {
      return <Globe size={14} />;
    }
    return <Database size={14} />;
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
            {formations.length > 0 && (
              <div 
                className="mega-menu" 
                style={{ 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.75rem',
                  width: '420px',
                  maxWidth: '95vw',
                  maxHeight: '80vh',
                  overflowY: 'auto',
                  padding: '1.25rem'
                }}
              >
                {categories.map(cat => {
                  const catFormations = formations.filter(f => f.categoryId === cat.id);
                  if (catFormations.length === 0) return null;
                  const isExpanded = activeCategory === cat.id;
                  return (
                    <div key={cat.id} style={{ display: 'flex', flexDirection: 'column' }}>
                      {/* Accordion Trigger Header */}
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setActiveCategory(isExpanded ? null : cat.id);
                        }}
                        style={{ 
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          width: '100%',
                          background: 'none',
                          border: 'none',
                          borderBottom: '1px solid var(--border)',
                          padding: '0.65rem 0.5rem',
                          cursor: 'pointer',
                          color: isExpanded ? 'var(--primary)' : 'var(--text-heading)',
                          fontFamily: 'var(--font-sans)',
                          fontWeight: '800',
                          fontSize: '0.85rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          textAlign: 'left',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          {cat.id === 'bts' ? <Award size={14} /> : cat.id === 'bt' ? <ShieldCheck size={14} /> : <Landmark size={14} />}
                          <span>{cat.name}</span>
                        </div>
                        <span style={{ 
                          fontSize: '0.8rem', 
                          color: 'var(--text-muted)',
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease',
                          lineHeight: 1
                        }}>
                          ▼
                        </span>
                      </button>

                      {/* Accordion Content */}
                      <div style={{ 
                        maxHeight: isExpanded ? `${catFormations.length * 36 + 20}px` : '0px',
                        overflow: 'hidden',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        opacity: isExpanded ? 1 : 0
                      }}>
                        <ul className="mega-menu-list" style={{ 
                          display: 'flex', 
                          flexDirection: 'column', 
                          gap: '0.15rem', 
                          listStyle: 'none', 
                          padding: '0.5rem 0.75rem 0.25rem 0.75rem', 
                          margin: 0 
                        }}>
                          {catFormations.map(f => (
                            <li key={f.id}>
                              <Link 
                                to={`/formations/${f.id}`} 
                                className="mega-menu-link" 
                                style={{ 
                                  fontSize: '0.92rem', 
                                  color: 'var(--text)',
                                  padding: '0.25rem 0.5rem',
                                  borderRadius: 'var(--radius-sm)',
                                  display: 'block',
                                  transition: 'all 0.15s ease'
                                }}
                              >
                                {f.title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
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
              <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '1rem', gap: '1rem', marginTop: '0.75rem', borderLeft: '2px solid var(--border)' }}>
                {categories.map(cat => {
                  const catFormations = formations.filter(f => f.categoryId === cat.id);
                  if (catFormations.length === 0) return null;
                  const isMobileCatExpanded = activeMobileCategory === cat.id;
                  return (
                    <div key={cat.id} style={{ display: 'flex', flexDirection: 'column' }}>
                      <div 
                        style={{ 
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          fontWeight: 700, 
                          fontSize: '0.82rem', 
                          color: isMobileCatExpanded ? 'var(--primary)' : 'var(--text-muted)', 
                          textTransform: 'uppercase',
                          cursor: 'pointer',
                          padding: '0.5rem 0'
                        }}
                        onClick={() => setActiveMobileCategory(isMobileCatExpanded ? null : cat.id)}
                      >
                        <span>{cat.name}</span>
                        <ChevronDown size={14} style={{ transform: isMobileCatExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', color: 'var(--text-muted)' }} />
                      </div>
                      {isMobileCatExpanded && (
                        <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: '0.75rem', gap: '0.35rem', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
                          {catFormations.map(f => (
                            <Link 
                              key={f.id} 
                              to={`/formations/${f.id}`} 
                              onClick={() => setMobileMenuOpen(false)} 
                              style={{ fontSize: '0.88rem', color: 'var(--text)', padding: '0.15rem 0' }}
                            >
                              {f.title}
                            </Link>
                          ))}
                        </div>
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
