import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Award, 
  BookOpen, 
  Users, 
  Target, 
  ChevronRight, 
  MapPin, 
  ExternalLink,
  BookOpenCheck,
  Tv,
  Compass,
  Smile,
  CircleDollarSign,
  Activity
} from 'lucide-react';

function About() {
  const [campuses, setCampuses] = useState([]);

  const facilities = [
    { 
      title: 'Bibliothèque moderne', 
      desc: 'Un fonds documentaire riche et des archives de recherche numérique pour accompagner vos études.',
      icon: <BookOpenCheck size={24} />
    },
    { 
      title: 'Salles de cours interactives', 
      desc: 'Des espaces collaboratifs équipés d\'écrans tactiles, vidéoprojecteurs et d\'une connectivité haut débit.',
      icon: <Tv size={24} />
    },
    { 
      title: "Pôle d'Innovation & Incubateur", 
      desc: 'Un espace dédié à l\'entrepreneuriat étudiant, à la création de projets innovants et aux travaux d\'équipe.',
      icon: <Compass size={24} />
    },
    { 
      title: 'Espaces de vie étudiante', 
      desc: 'Un hall d\'accueil spacieux et des espaces de détente pour favoriser les échanges et la synergie collective.',
      icon: <Smile size={24} />
    },
    { 
      title: 'Lab Financier / Simulation', 
      desc: 'Une salle dédiée à l\'analyse économique, aux jeux d\'entreprise et à la modélisation financière pratique.',
      icon: <CircleDollarSign size={24} />
    },
    { 
      title: 'Partenariats Sportifs & Loisirs', 
      desc: 'Accès privilégié à des infrastructures sportives conventionnées pour maintenir un équilibre de vie sain.',
      icon: <Activity size={24} />
    }
  ];

  useEffect(() => {
    const fetchCampuses = async () => {
      try {
        const res = await fetch('/campuses');
        if (res.ok) {
          const data = await res.json();
          setCampuses(data);
          return;
        }
      } catch (e) {
        console.warn("Backend API offline, falling back to local storage inside About page:", e);
      }
      
      const saved = localStorage.getItem('insim_campuses');
      if (saved) {
        try {
          setCampuses(JSON.parse(saved));
        } catch (e) {
          console.error(e);
        }
      }
    };
    fetchCampuses();
  }, []);

  return (
    <div>
      {/* 1. Hero Section */}
      <section className="about-hero" style={{ background: 'linear-gradient(rgba(19, 75, 126, 0.88), rgba(19, 75, 126, 0.93)), url("https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80")', backgroundSize: 'cover', backgroundPosition: 'center', borderBottom: '4px solid var(--accent)' }}>
        <div className="container">
          <span style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--cyan)', letterSpacing: '0.15rem' }}>À PROPOS DE L'INSTITUT</span>
          <h2 style={{ fontSize: '3rem', fontWeight: '800', marginTop: '0.5rem', color: '#fff', fontFamily: 'var(--font-heading)' }}>L'INSIM Bejaia</h2>
          <p style={{ fontSize: '1.25rem', opacity: 0.95, color: '#e2e8f0', maxWidth: '700px', margin: '0.5rem auto 0' }}>Façonner les leaders du management et de l'informatique en Algérie depuis 1995.</p>
        </div>
      </section>

      {/* 2. Our History & Mission Section */}
      <section className="section" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div className="about-timeline-section">
            
            {/* Left Column: Timeline */}
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.1em' }}>Rétrospective</span>
              <h3 style={{ fontSize: '2rem', marginBottom: '2rem', fontFamily: 'var(--font-heading)', color: 'var(--primary)' }}>
                Notre Histoire & Évolution
              </h3>
              
              <div className="timeline-list">
                {/* 1995 */}
                <div className="timeline-item">
                  <div className="timeline-badge" style={{ backgroundColor: 'var(--primary)' }}></div>
                  <div className="timeline-year">1995</div>
                  <div className="timeline-title" style={{ fontSize: '1.15rem', color: 'var(--primary)' }}>Fondation de l'Institut</div>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text)', lineHeight: '1.5' }}>
                    Création de l'établissement avec pour mission de proposer des cursus en management et gestion adaptés aux réformes économiques du pays.
                  </p>
                </div>
                {/* 2005 */}
                <div className="timeline-item">
                  <div className="timeline-badge" style={{ backgroundColor: 'var(--accent)' }}></div>
                  <div className="timeline-year">2005</div>
                  <div className="timeline-title" style={{ fontSize: '1.15rem', color: 'var(--primary)' }}>Agréments d'État & Extension</div>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text)', lineHeight: '1.5' }}>
                    Homologation officielle de nos diplômes de BTS par le Ministère de la Formation Professionnelle et inauguration de locaux modernes.
                  </p>
                </div>
                {/* 2020 */}
                <div className="timeline-item">
                  <div className="timeline-badge" style={{ backgroundColor: 'var(--cyan)' }}></div>
                  <div className="timeline-year">2020</div>
                  <div className="timeline-title" style={{ fontSize: '1.15rem', color: 'var(--primary)' }}>Digitalisation & Cursus courts</div>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text)', lineHeight: '1.5' }}>
                    Lancement de nos programmes hybrides et intégration des certifications professionnelles CMP pour répondre aux nouveaux besoins de reconversion.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Mission statement & image */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1.5rem' }}>
              <div style={{ borderLeft: '4px solid var(--accent)', padding: '0.5rem 0 0.5rem 1.5rem', backgroundColor: 'var(--bg)', borderRadius: '0 8px 8px 0' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.05em', display: 'block', marginBottom: '0.25rem' }}>Notre Mission Fondamentale</span>
                <p style={{ fontSize: '1.2rem', fontWeight: '500', color: 'var(--text-heading)', lineHeight: '1.6', fontFamily: 'var(--font-heading)' }}>
                  "Former des profils autonomes, hautement qualifiés et ancrés dans la réalité des affaires, en combinant l'excellence pédagogique avec des stages obligatoires en entreprise."
                </p>
              </div>
              
              <div style={{ 
                height: '280px', 
                borderRadius: '12px', 
                overflow: 'hidden',
                boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                position: 'relative'
              }}>
                <img 
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80"
                  alt="INSIM Business School group discussion" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  left: 0, 
                  right: 0, 
                  background: 'linear-gradient(transparent, rgba(19, 75, 126, 0.95))', 
                  padding: '1.5rem',
                  color: '#ffffff'
                }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--cyan)' }}>ENVIRONNEMENT D'ÉTUDE</span>
                  <h4 style={{ color: '#fff', fontSize: '1.15rem', margin: '0.25rem 0 0' }}>Groupes de travail collaboratifs</h4>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Campus Facilities */}
      <section className="section" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.1em' }}>Infrastructures</span>
            <h2 style={{ fontSize: '2.25rem', marginTop: '0.5rem', color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
              Un cadre idéal pour votre réussite
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0.5rem auto 0' }}>
              Nos locaux ont été spécifiquement aménagés pour assurer un équilibre parfait entre confort d'étude et technologies professionnelles.
            </p>
          </div>

          <div className="facilities-grid">
            {facilities.map((fac, idx) => (
              <div key={idx} className="facility-card" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div className="facility-card-image" style={{ 
                  backgroundImage: `url("https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=400&q=80")`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  height: '140px',
                  position: 'relative'
                }}>
                  <div style={{ width: '100%', height: '100%', backgroundColor: 'rgba(19,75,126,0.1)' }}></div>
                  <div style={{ position: 'absolute', bottom: '1rem', right: '1rem', width: '2.5rem', height: '2.5rem', borderRadius: '8px', backgroundColor: 'var(--primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}>
                    {fac.icon}
                  </div>
                </div>
                <div className="facility-card-content" style={{ textAlign: 'left', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <h4 style={{ fontSize: '1.2rem', color: 'var(--primary)', fontWeight: '700', marginBottom: '0.5rem' }}>{fac.title}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>{fac.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Partners & Networks (Group institutes) */}
      <section className="section" style={{ backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.1em' }}>RÉSEAU NATIONAL</span>
            <h2 style={{ fontSize: '2.25rem', marginTop: '0.5rem', color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
              Les Établissements Partenaires
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0.5rem auto 0' }}>
              Le réseau INSIM s'étend à travers tout le territoire national pour dispenser des cursus unifiés et rigoureux.
            </p>
          </div>

          <div className="team-grid">
            {campuses.map((inst) => (
              <div key={inst.id} className="team-card" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '2rem 1.5rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)' }}>
                <div className="team-avatar" style={{ 
                  backgroundColor: 'var(--primary-light)', 
                  color: 'var(--primary)', 
                  fontWeight: '800',
                  border: '2px solid var(--primary)',
                  boxShadow: '0 4px 10px rgba(19, 75, 126, 0.08)'
                }}>
                  {inst.name ? inst.name.split(' ').pop().charAt(0).toUpperCase() : 'I'}
                </div>
                
                <h4 style={{ fontSize: '1.2rem', color: 'var(--primary)', fontWeight: '700', marginTop: '1rem', marginBottom: '0.25rem' }}>
                  {inst.name}
                </h4>
                
                <div className="team-role" style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: '800', letterSpacing: '0.05em' }}>
                  Partenaire Groupe INSIM
                </div>
                
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '1.5rem', flexGrow: 1, lineHeight: '1.4' }}>
                  {inst.sieges && inst.sieges.length > 0 
                    ? `${inst.sieges.length} centre(s) d'étude : ${inst.sieges.map(s => s.city.split(' ')[0]).join(', ')}`
                    : 'Campus national conventionné'
                  }
                </p>
                
                <a href={inst.website} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ padding: '0.55rem 1rem', fontSize: '0.8rem', width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}>
                  Visiter le portail <ExternalLink size={12} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
