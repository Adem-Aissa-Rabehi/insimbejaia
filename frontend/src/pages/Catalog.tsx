import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  SlidersHorizontal, 
  Search, 
  Trash2, 
  Clock, 
  Network, 
  Globe, 
  Award, 
  Database,
  Building,
  Computer,
  Sparkles,
  BookOpen
} from 'lucide-react';

function Catalog() {
  const [searchParams] = useSearchParams();
  const filiereParam = searchParams.get('filiere');

  const [categories, setCategories] = useState([]); // Levels (Niveaux)
  const [filieres, setFilieres] = useState([]); // Sectors (Secteurs)
  const [formations, setFormations] = useState([]); // Specialities

  const [selectedCategories, setSelectedCategories] = useState({});
  const [selectedFilieres, setSelectedFilieres] = useState({});
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // Load categories (Levels)
    fetch('/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        const initial = {};
        data.forEach(c => { initial[c.id] = false; });
        setSelectedCategories(initial);
      })
      .catch(err => console.error('Failed to fetch categories', err));

    // Load filieres (Secteurs)
    fetch('/filieres')
      .then(res => res.json())
      .then(data => {
        setFilieres(data);
        const initial = {};
        data.forEach(f => {
          initial[f.id] = f.id === filiereParam;
        });
        setSelectedFilieres(initial);
      })
      .catch(err => console.error('Failed to fetch filieres', err));

    // Load formations
    fetch('/formations-data')
      .then(res => res.json())
      .then(data => setFormations(data))
      .catch(err => console.error('Failed to fetch formations', err));
  }, [filiereParam]);

  const handleCategoryChange = (id) => {
    setSelectedCategories(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFiliereChange = (id) => {
    setSelectedFilieres(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const clearFilters = () => {
    const clearedCats = {};
    categories.forEach(c => { clearedCats[c.id] = false; });
    setSelectedCategories(clearedCats);

    const clearedFils = {};
    filieres.forEach(f => { clearedFils[f.id] = false; });
    setSelectedFilieres(clearedFils);
    setSearchQuery('');
  };

  // Dynamic filter matching
  const filteredFormations = formations.filter((formation) => {
    // Sector (Filière) filter match
    const noSectorSelected = !Object.values(selectedFilieres).some(Boolean);
    const matchesSector = noSectorSelected || selectedFilieres[formation.filiereId];

    // Level (Catégorie) filter match
    const noLevelSelected = !Object.values(selectedCategories).some(Boolean);
    const matchesLevel = noLevelSelected || selectedCategories[formation.categoryId];

    // Text search match
    const matchesSearch = !searchQuery.trim() || 
      formation.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (formation.description && formation.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (formation.filiereName && formation.filiereName.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesSector && matchesLevel && matchesSearch;
  });

  const getFiliereIcon = (filiereId) => {
    const id = filiereId?.toLowerCase() || '';
    if (id.includes('informatique') || id.includes('numerique')) {
      return <Network size={20} />;
    }
    if (id.includes('gestion') || id.includes('commerce') || id.includes('administration')) {
      return <Award size={20} />;
    }
    if (id.includes('tourisme') || id.includes('hotellerie') || id.includes('voyage')) {
      return <Globe size={20} />;
    }
    return <Database size={20} />;
  };

  return (
    <div className="section" style={{ backgroundColor: 'var(--bg)', padding: '3.5rem 0' }}>
      <div className="container">
        
        {/* Header section */}
        <div style={{ marginBottom: '3rem', borderBottom: '1px solid var(--border)', paddingBottom: '2rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.1em' }}>
            OFFRE DE FORMATION
          </span>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)', fontFamily: 'var(--font-heading)', marginTop: '0.25rem', marginBottom: '0.5rem', textAlign: 'left' }}>
            Découvrez nos Programmes de Formation
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '800px', margin: 0, fontSize: '1.05rem', lineHeight: '1.5' }}>
            Des diplômes d'État (BTS, BT) et des certificats de maîtrise professionnelle (CMP) conçus pour former des experts recherchés par les recruteurs.
          </p>
        </div>

        <div className="catalog-layout">
          {/* Left Column: Filters Sidebar */}
          <aside className="filters-sidebar" style={{ position: 'sticky', top: '7.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', padding: 0, margin: 0 }}>
                <SlidersHorizontal size={16} /> Filtres de recherche
              </h3>
              {(Object.values(selectedFilieres).some(Boolean) || Object.values(selectedCategories).some(Boolean) || searchQuery) && (
                <button 
                  onClick={clearFilters}
                  style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                >
                  <Trash2 size={12} /> Effacer
                </button>
              )}
            </div>
            
            {/* Sector Filters (Filières) */}
            <div className="filter-section">
              <h4 style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--secondary)', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                Filière / Secteur
              </h4>
              <div className="checkbox-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {filieres.map(f => (
                  <label key={f.id} className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.92rem', color: 'var(--text)', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={!!selectedFilieres[f.id]} 
                      onChange={() => handleFiliereChange(f.id)} 
                      style={{ accentColor: 'var(--primary)', width: '1rem', height: '1rem', cursor: 'pointer' }}
                    />
                    {f.categoryId ? `${f.categoryId.toUpperCase()} - ` : ''}{f.name}
                  </label>
                ))}
                {filieres.length === 0 && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Aucun secteur défini</span>}
              </div>
            </div>

            {/* Level Filters (Catégories) */}
            <div className="filter-section" style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
              <h4 style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--secondary)', letterSpacing: '0.05em', marginBottom: '1rem' }}>
                Niveau de diplôme
              </h4>
              <div className="checkbox-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {categories.map(c => (
                  <label key={c.id} className="checkbox-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.92rem', color: 'var(--text)', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={!!selectedCategories[c.id]} 
                      onChange={() => handleCategoryChange(c.id)} 
                      style={{ accentColor: 'var(--primary)', width: '1rem', height: '1rem', cursor: 'pointer' }}
                    />
                    {c.name}
                  </label>
                ))}
                {categories.length === 0 && <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Aucun niveau défini</span>}
              </div>
            </div>

            <button 
              onClick={clearFilters}
              className="btn btn-secondary" 
              style={{ width: '100%', marginTop: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.88rem' }}
            >
              Réinitialiser
            </button>
          </aside>

          {/* Right Column: Search & Grid */}
          <main>
            {/* Search bar inside Catalog */}
            <div style={{ position: 'relative', marginBottom: '2rem', display: 'flex', width: '100%' }}>
              <span style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                <Search size={18} />
              </span>
              <input 
                type="text" 
                placeholder="Rechercher une spécialité (ex: Comptabilité, Saisie, Marketing...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.85rem 1rem 0.85rem 3rem', 
                  borderRadius: '8px', 
                  border: '1px solid var(--border)',
                  backgroundColor: '#ffffff',
                  fontSize: '0.98rem',
                  outline: 'none',
                  fontFamily: 'var(--font-sans)',
                  transition: 'all 0.15s ease'
                }}
                className="form-search-input"
              />
            </div>

            {filteredFormations.length > 0 ? (
              <div className="course-grid">
                {filteredFormations.map((formation) => (
                  <div key={formation.id} className="course-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '2rem', backgroundColor: '#ffffff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', transition: 'all var(--transition-normal)' }}>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                      <div className="course-card-icon" style={{ width: '2.5rem', height: '2.5rem', borderRadius: '6px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: 0 }}>
                        {getFiliereIcon(formation.filiereId)}
                      </div>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        fontWeight: '800', 
                        textTransform: 'uppercase', 
                        backgroundColor: formation.categoryName === 'BTS' ? 'var(--primary-light)' : (formation.categoryName === 'BT' ? 'var(--accent-light)' : 'var(--cyan-light)'), 
                        color: formation.categoryName === 'BTS' ? 'var(--primary)' : (formation.categoryName === 'BT' ? 'var(--accent)' : 'var(--cyan)'), 
                        padding: '0.2rem 0.6rem',
                        borderRadius: '4px',
                        border: '1px solid rgba(0,0,0,0.05)'
                      }}>
                        {formation.categoryName || 'Formation'}
                      </span>
                    </div>

                    <span style={{ 
                      fontSize: '0.72rem', 
                      fontWeight: '800', 
                      textTransform: 'uppercase', 
                      color: 'var(--accent)',
                      marginBottom: '0.5rem',
                      display: 'block',
                      letterSpacing: '0.02em'
                    }}>
                      {formation.filiereName || 'Filière'}
                    </span>

                    <h3 style={{ fontSize: '1.35rem', color: 'var(--primary)', fontWeight: '700', marginBottom: '0.75rem', lineHeights: '1.3' }}>
                      {formation.title}
                    </h3>

                    <p style={{ fontSize: '0.95rem', color: 'var(--secondary)', marginBottom: '1.5rem', flexGrow: 1, lineHeights: '1.5' }}>
                      {formation.description ? 
                        (formation.description.length > 120 ? formation.description.slice(0, 120) + '...' : formation.description) 
                        : 'Aucune description disponible.'}
                    </p>

                    <div className="course-card-duration" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontFamily: 'var(--font-sans)', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem' }}>
                      <Clock size={14} />
                      <span>Durée d'étude : {formation.duration || '30 mois (inclus 6 mois de stage)'}</span>
                    </div>

                    <Link to={`/formations/${formation.id}`} className="btn btn-accent" style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      En savoir plus <Sparkles size={14} />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border)', borderRadius: '12px', padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <BookOpen size={48} style={{ color: 'var(--border)', marginBottom: '1rem', display: 'inline-block' }} />
                <h4 style={{ color: 'var(--primary)', marginBottom: '0.5rem', fontSize: '1.25rem' }}>Aucun résultat</h4>
                <p style={{ fontSize: '0.92rem' }}>Aucune formation ne correspond à vos critères de recherche. Essayez de réinitialiser vos filtres.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

export default Catalog;
