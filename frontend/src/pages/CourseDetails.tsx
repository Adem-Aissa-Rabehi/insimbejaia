import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  CheckCircle2, 
  X, 
  Clock, 
  Calendar, 
  BookOpen, 
  Award, 
  ChevronRight, 
  Users,
  Compass,
  Briefcase
} from 'lucide-react';

function CourseDetails() {
  const { id } = useParams();
  
  const [formation, setFormation] = useState(null);
  const [loadingCourse, setLoadingCourse] = useState(true);
  const [activeSemesterTab, setActiveSemesterTab] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    currentLevel: '', 
    preferredFormat: '', 
    source: '' 
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    fetch('/formations-data')
      .then(res => res.json())
      .then(data => {
        const found = data.find((f) => f.id === id);
        setFormation(found);
        setLoadingCourse(false);
        // Track the view in the database
        if (found) {
          fetch(`/track/formation/${found.id}`, { method: 'POST' }).catch(() => {});
          if (found.semesters && found.semesters.length > 0) {
            setActiveSemesterTab(found.semesters[0].number);
          }
        }
      })
      .catch(err => {
        console.error('Failed to load course details', err);
        setLoadingCourse(false);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoadingSubmit(true);

    try {
      const res = await fetch('/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || 'Non renseigné',
          formationId: formation.id,
          formationTitle: formation.title,
          currentLevel: formData.currentLevel || 'Non renseigné',
          preferredFormat: formData.preferredFormat || 'Non renseigné',
          source: formData.source || 'Non renseigné'
        })
      });
      
      if (res.ok) {
        setIsSubmitted(true);
      } else {
        alert('Une erreur est survenue, veuillez réessayer.');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingSubmit(false);
    }
  };

  const handleDownloadPdf = () => {
    if (formation.brochure && formation.brochure.startsWith('/uploads/')) {
      const fileUrl = `http://localhost:5000${formation.brochure}`;
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = formation.brochure.split('/').pop();
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const newWindow = window.open();
      newWindow.document.write(`
        <html>
          <head>
            <title>Brochure - ${formation.title}</title>
            <style>
              body { font-family: system-ui, sans-serif; padding: 3rem; text-align: center; color: #002a56; }
              .card { border: 2px solid #e2e8f0; padding: 2.5rem; max-width: 650px; margin: 0 auto; border-radius: 16px; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1); }
              h1 { margin-bottom: 0.5rem; color: #002a56; }
              h2 { color: #ff7a2d; margin-top: 0; }
              p { color: #475569; line-height: 1.6; }
              hr { border: 0; border-top: 1px solid #e2e8f0; margin: 1.5rem 0; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>INSIM Bejaia</h1>
              <h2>Brochure Officielle</h2>
              <hr/>
              <p><strong>Spécialité :</strong> ${formation.title}</p>
              <p><strong>Description :</strong> ${formation.description}</p>
              <p><strong>Niveau de formation :</strong> ${formation.categoryName || 'Technicien Supérieur'}</p>
              <p><strong>Durée d'études :</strong> ${formation.duration || '30 mois (Plein temps)'}</p>
              <hr/>
              <p style="font-size: 13px; color: #64748b;">Aucune brochure PDF n'a encore été uploadée pour cette formation.</p>
            </div>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
    setShowModal(false);
    setIsSubmitted(false);
    setFormData({ 
      name: '', 
      email: '', 
      phone: '', 
      currentLevel: '', 
      preferredFormat: '', 
      source: '' 
    });
  };

  if (loadingCourse) {
    return (
      <div className="container section" style={{ textAlign: 'center', padding: '6rem 0' }}>
        <h2 style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>Chargement des détails de la formation...</h2>
      </div>
    );
  }

  if (!formation) {
    return (
      <div className="container section" style={{ textAlign: 'center', padding: '6rem 0' }}>
        <h2 style={{ color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>Spécialité introuvable</h2>
        <p style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>Désolé, cette formation n'existe pas ou a été déplacée par l'administrateur.</p>
        <Link to="/formations" className="btn btn-primary">Retourner au catalogue</Link>
      </div>
    );
  }

  // Get active semester content
  const activeSemester = formation.semesters ? formation.semesters.find(s => s.number === activeSemesterTab) : null;

  return (
    <div className="section" style={{ backgroundColor: 'var(--bg)', padding: '3.5rem 0' }}>
      <div className="container">
        
        {/* Back Link */}
        <Link to="/formations" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2.5rem', fontWeight: '700', color: 'var(--primary)', transition: 'all 0.15s' }}>
          <ArrowLeft size={16} /> Retourner au catalogue des spécialités
        </Link>

        {/* Formation Detail Grid */}
        <div className="course-details-layout">
          
          {/* Left Side: General Info & Semesters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', minWidth: 0 }}>
            <div>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.05em' }}>
                  {formation.filiereName || 'Filière'}
                </span>
                <span style={{ width: '4px', height: '4px', backgroundColor: 'var(--border)', borderRadius: '50%' }}></span>
                <span style={{ 
                  fontSize: '0.72rem', 
                  fontWeight: '800', 
                  textTransform: 'uppercase', 
                  backgroundColor: formation.categoryName === 'BTS' ? 'var(--primary-light)' : (formation.categoryName === 'BT' ? 'var(--accent-light)' : 'var(--cyan-light)'), 
                  color: formation.categoryName === 'BTS' ? 'var(--primary)' : (formation.categoryName === 'BT' ? 'var(--accent)' : 'var(--cyan)'), 
                  padding: '0.15rem 0.5rem',
                  borderRadius: '4px'
                }}>
                  Diplôme d'État : {formation.categoryName || 'BTS'}
                </span>
              </div>
              
              <h2 style={{ fontSize: 'clamp(1.8rem, 5vw, 2.6rem)', color: 'var(--primary)', fontFamily: 'var(--font-heading)', marginBottom: '1.5rem', textAlign: 'left', lineHeight: '1.2', wordBreak: 'break-word' }}>
                {formation.title}
              </h2>
              
              <h3 style={{ fontSize: '1.35rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', color: 'var(--primary)', fontWeight: '700' }}>
                Présentation du programme
              </h3>
              <p style={{ fontSize: '1.05rem', color: 'var(--text)', lineHeight: '1.6', margin: 0 }}>
                {formation.description}
              </p>
            </div>

            {/* Objectives */}
            <div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', color: 'var(--primary)', fontWeight: '700' }}>
                Objectifs & Compétences visées
              </h3>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', padding: 0, margin: 0 }}>
                {formation.objectives && formation.objectives.map((obj, index) => (
                  <li key={index} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                    <CheckCircle2 size={18} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '0.2rem' }} />
                    <span style={{ fontSize: '1rem', color: 'var(--text)', lineHeight: '1.4' }}>{obj}</span>
                  </li>
                ))}
                {(!formation.objectives || formation.objectives.length === 0) && (
                  <li style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                    Aucun objectif spécifique configuré pour cette spécialité.
                  </li>
                )}
              </ul>
            </div>

            {/* Interactive Tabbed Semesters */}
            {formation.semesters && formation.semesters.length > 0 && (
              <div style={{ marginTop: '0.5rem' }}>
                <h3 style={{ fontSize: '1.35rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', color: 'var(--primary)', fontWeight: '700' }}>
                  Programme d'études par Semestre
                </h3>
                
                {/* Tabs Selector Row */}
                 <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.25rem', width: '100%', maxWidth: '100%', WebkitOverflowScrolling: 'touch' }}>
                  {formation.semesters.map((sem) => (
                    <button
                      key={sem.number}
                      onClick={() => setActiveSemesterTab(sem.number)}
                      style={{
                        padding: '0.65rem 1.5rem',
                        fontSize: '0.9rem',
                        fontWeight: '700',
                        borderRadius: '6px',
                        border: '1px solid',
                        borderColor: activeSemesterTab === sem.number ? 'var(--primary)' : 'var(--border)',
                        backgroundColor: activeSemesterTab === sem.number ? 'var(--primary)' : '#ffffff',
                        color: activeSemesterTab === sem.number ? '#ffffff' : 'var(--secondary)',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        fontFamily: 'var(--font-sans)',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      Semestre {sem.number}
                    </button>
                  ))}
                </div>

                {/* Tab Content Box */}
                {activeSemester && (
                  <div className="course-details-tab-content">
                    <h4 style={{ color: 'var(--primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1.15rem', fontWeight: '700' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--accent)', color: 'white', borderRadius: '4px', width: '24px', height: '24px', fontSize: '0.78rem', fontWeight: 'bold' }}>
                        S{activeSemester.number}
                      </span>
                      Liste des modules du Semestre {activeSemester.number}
                    </h4>
                    
                    {activeSemester.modules && activeSemester.modules.length > 0 ? (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '1rem' }}>
                        {activeSemester.modules.map((mod, idx) => (
                          <div 
                            key={idx} 
                            style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: '0.5rem', 
                              padding: '0.85rem 1rem', 
                              backgroundColor: 'var(--bg)', 
                              borderRadius: '6px',
                              border: '1px solid rgba(0,0,0,0.03)',
                              fontSize: '0.92rem',
                              color: 'var(--text-heading)',
                              fontWeight: '600'
                            }}
                          >
                            <span style={{ width: '6px', height: '6px', backgroundColor: 'var(--cyan)', borderRadius: '50%' }}></span>
                            <span>{mod}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', fontStyle: 'italic', margin: 0 }}>Aucun module défini pour ce semestre.</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="course-details-sidebar">
            <div className="course-sidebar-card">
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={{ width: '2rem', height: '2rem', borderRadius: '4px', backgroundColor: 'var(--accent-light)', color: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Clock size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>DURÉE D'ÉTUDES</div>
                    <div style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-heading)' }}>{formation.duration || '30 mois (inclus 6 mois de stage)'}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={{ width: '2rem', height: '2rem', borderRadius: '4px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Calendar size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>RITMES DISPONIBLES</div>
                    <div style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-heading)' }}>Cours du jour / Soir</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <div style={{ width: '2rem', height: '2rem', borderRadius: '4px', backgroundColor: 'var(--cyan-light)', color: 'var(--cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Briefcase size={16} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>STAGE DE FIN D'ÉTUDES</div>
                    <div style={{ fontSize: '0.92rem', fontWeight: '700', color: 'var(--text-heading)' }}>Obligatoire (6 mois conventionnés)</div>
                  </div>
                </div>
              </div>

              <h4 style={{ fontSize: '1.05rem', color: 'var(--primary)', fontWeight: '700', marginBottom: '0.5rem' }}>
                Télécharger le programme
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.4', marginBottom: '1.5rem' }}>
                Obtenez la brochure PDF complète contenant les coefficients, les conditions d'accès, et les débouchés professionnels.
              </p>
              
              <button 
                onClick={() => setShowModal(true)} 
                className="btn btn-primary" 
                style={{ width: '100%', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: '700' }}
              >
                <Download size={16} /> Brochure d'études (PDF)
              </button>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', marginTop: '1.5rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                  Ce programme vous intéresse ?
                </p>
                <Link to="/preinscription" className="btn btn-accent" style={{ width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  Déposer ma préinscription
                </Link>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Lead Capture Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '480px' }}>
            <button className="modal-close" onClick={() => { setShowModal(false); setIsSubmitted(false); }} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
              <X size={20} />
            </button>

            {!isSubmitted ? (
              <>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.45rem', fontWeight: '700', color: 'var(--primary)' }}>Brochure de formation</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', lineHeight: '1.4', marginBottom: '1.5rem' }}>
                  Renseignez ce formulaire rapide pour lancer instantanément le téléchargement de la brochure pour <strong>{formation.title}</strong>.
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div className="form-group">
                    <label htmlFor="name" style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--secondary)' }}>Nom complet *</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      required 
                      className="form-control" 
                      placeholder="Ex: Amine Kaci"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email" style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--secondary)' }}>Adresse E-mail *</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      required 
                      className="form-control" 
                      placeholder="Ex: amine@gmail.com"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="phone" style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--secondary)' }}>Numéro de Téléphone *</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      required
                      className="form-control" 
                      placeholder="Ex: 0550 12 34 56"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="currentLevel" style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--secondary)' }}>Niveau d'études actuel *</label>
                    <select 
                      id="currentLevel" 
                      name="currentLevel" 
                      required
                      className="form-control" 
                      value={formData.currentLevel}
                      onChange={handleInputChange}
                    >
                      <option value="">-- Sélectionner un niveau --</option>
                      <option value="Terminale / 3ème AS">Terminale / 3ème AS</option>
                      <option value="Baccalauréat">Baccalauréat</option>
                      <option value="Bac +2 (TS / DEUA)">Bac +2 (TS / DEUA)</option>
                      <option value="Licence (Bac +3)">Licence (Bac +3)</option>
                      <option value="Master (Bac +5)">Master (Bac +5)</option>
                      <option value="Autre / Niveau Moyen">Autre / Niveau Moyen</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="preferredFormat" style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--secondary)' }}>Rythme d'études souhaité *</label>
                    <select 
                      id="preferredFormat" 
                      name="preferredFormat" 
                      required
                      className="form-control" 
                      value={formData.preferredFormat}
                      onChange={handleInputChange}
                    >
                      <option value="">-- Sélectionner le rythme --</option>
                      <option value="Cours du Jour (Régulier)">Cours du Jour (Régulier)</option>
                      <option value="Cours du Soir (Intensif)">Cours du Soir (Intensif)</option>
                      <option value="Weekend (Alterné)">Weekend (Alterné)</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                    <label htmlFor="source" style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--secondary)' }}>Comment nous avez-vous connu ? *</label>
                    <select 
                      id="source" 
                      name="source" 
                      required
                      className="form-control" 
                      value={formData.source}
                      onChange={handleInputChange}
                    >
                      <option value="">-- Sélectionner une source --</option>
                      <option value="Facebook / Instagram">Facebook / Instagram</option>
                      <option value="Bouche à oreille / Ami">Bouche à oreille / Ami</option>
                      <option value="Recherche Google">Recherche Google</option>
                      <option value="Événement / Affichage">Événement / Affichage</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>
                  
                  <button 
                    type="submit" 
                    className="btn btn-primary" 
                    style={{ width: '100%', padding: '0.85rem 1rem', fontSize: '0.95rem' }}
                    disabled={loadingSubmit}
                  >
                    {loadingSubmit ? 'Envoi en cours...' : 'Valider et Télécharger'}
                  </button>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', backgroundColor: '#ecfdf5', color: '#10b981', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                  <CheckCircle2 size={36} />
                </div>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.45rem', fontWeight: '700', color: 'var(--primary)' }}>Formulaire validé !</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.4', marginBottom: '2rem' }}>
                  Vos coordonnées ont bien été enregistrées. Vous pouvez maintenant cliquer ci-dessous pour obtenir le programme complet de la formation.
                </p>
                <button 
                  onClick={handleDownloadPdf} 
                  className="btn btn-accent" 
                  style={{ width: '100%', padding: '0.85rem 1.5rem', fontSize: '0.98rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <Download size={16} /> Lancer le Téléchargement PDF
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CourseDetails;
