import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  GraduationCap, 
  BookOpen, 
  Award, 
  Users, 
  CheckCircle, 
  ArrowRight, 
  Sparkles, 
  Clock, 
  Briefcase,
  Building,
  ShieldCheck
} from 'lucide-react';

function Home() {
  const [randomFormations, setRandomFormations] = useState([]);

  useEffect(() => {
    fetch('/formations-data')
      .then(res => res.json())
      .then(data => {
        // Select 3 random formations
        const shuffled = [...data].sort(() => 0.5 - Math.random());
        setRandomFormations(shuffled.slice(0, 3));
      })
      .catch(err => console.error('Failed to load formations from API', err));
  }, []);

  return (
    <div>
      {/* 1. HERO SECTION PREMIUM */}
      <section className="hero-premium">
        <div className="container hero-premium-container">
          
          <div className="hero-premium-content">
            <div className="hero-badge-pill">
              <span></span> Inscriptions Ouvertes 2026 / 2027
            </div>
            
            <h1 className="hero-premium-title">
              Formez-vous aux métiers d'avenir à l'INSIM Bejaia
            </h1>
            
            <p className="hero-premium-lead">
              Institut Supérieur d'Informatique et de Management de Bejaia. École de référence agréée par l'État, formant les leaders de demain en management, technologies et tourisme.
            </p>
            
            <div className="hero-trust-row">
              <div className="hero-trust-item">
                <ShieldCheck size={16} />
                <span>Diplômes Agréés par l'État</span>
              </div>
              <div className="hero-trust-item">
                <CheckCircle size={16} />
                <span>Avec ou Sans BAC</span>
              </div>
              <div className="hero-trust-item">
                <Briefcase size={16} />
                <span>Insertion & Stages Assurés</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
              <Link to="/preinscription" className="btn btn-accent" style={{ padding: '0.85rem 2rem' }}>
                S'inscrire en ligne <Sparkles size={16} style={{ marginLeft: '0.25rem' }} />
              </Link>
              <Link to="/formations" className="btn btn-secondary" style={{ padding: '0.85rem 2rem', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'transparent', color: '#ffffff' }}>
                Découvrir le Catalogue
              </Link>
            </div>
          </div>

          <div className="hero-premium-image-side">
            <div className="hero-premium-img-frame">
              <img 
                alt="Business School Campus Leaders" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNY5I5aCCIpAP4hk8bCJ303Xdg6dBZDbEXOQxwKRqlSMQ1TBByoS-ne4Pj4xVv8dA6joRjlF9utchNZH9Z6hFjse33TmjjjOEbky3iqqAdz8rd3QSlbe8_Mjavfu-iaH7KpRlaLb8N-UuSnt-CE_olycQKLxIHgvQl4HQohGrIulpp-p7G6tCGPiZwwcp63m-PrpzH3Mq-aOvESe9c8K_qjiICB1MZeFWHBbQDHX6xHJ55quQb_xPeH6yUh1MpPQWYeDfMpgRFmCdf"
              />
              <div className="hero-floating-glass-card">
                <div className="number">98%</div>
                <div className="label">
                  Taux d'insertion<br />professionnelle
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. STATS BAR SECTION */}
      <section className="stats-bar-section">
        <div className="container">
          <div className="stats-grid">
            
            <div className="stat-item-card">
              <div className="stat-card-icon">
                <Building size={24} />
              </div>
              <div className="stat-card-info">
                <span className="stat-card-number">30+ Ans</span>
                <span className="stat-card-label">d'expérience</span>
              </div>
            </div>

            <div className="stat-item-card">
              <div className="stat-card-icon">
                <Users size={24} />
              </div>
              <div className="stat-card-info">
                <span className="stat-card-number">5000+</span>
                <span className="stat-card-label">Diplômés actifs</span>
              </div>
            </div>

            <div className="stat-item-card">
              <div className="stat-card-icon">
                <Award size={24} />
              </div>
              <div className="stat-card-info">
                <span className="stat-card-number">100%</span>
                <span className="stat-card-label">Formations Agréées</span>
              </div>
            </div>

            <div className="stat-item-card">
              <div className="stat-card-icon">
                <GraduationCap size={24} />
              </div>
              <div className="stat-card-info">
                <span className="stat-card-number">3 Niveaux</span>
                <span className="stat-card-label">d'études homologués</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. LEVELS SECTION */}
      <section className="levels-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.1em' }}>
              Nos Niveaux d'Études
            </span>
            <h2 style={{ fontSize: '2.25rem', marginTop: '0.5rem', color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
              Des diplômes adaptés à votre parcours
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0.5rem auto 0' }}>
              Que vous ayez le BAC ou non, nous vous proposons des formations qualifiantes d'État pour propulser votre carrière.
            </p>
          </div>

          <div className="levels-grid">
            
            {/* BTS Card */}
            <div className="level-item-card bts">
              <span className="level-badge">BTS</span>
              <h3>Technicien Supérieur</h3>
              <p>
                Accessible avec le niveau terminal (3AS) ou équivalent. Durée de 30 mois. Conduisant à un diplôme d'État reconnu pour occuper des postes d'encadrement en entreprise.
              </p>
              <Link to="/formations?category=BTS" className="btn btn-secondary" style={{ alignSelf: 'flex-start', marginTop: 'auto', display: 'inline-flex', gap: '0.5rem' }}>
                Explorer BTS <ArrowRight size={14} />
              </Link>
            </div>

            {/* BT Card */}
            <div className="level-item-card bt">
              <span className="level-badge">BT</span>
              <h3>Technicien</h3>
              <p>
                Accessible avec le niveau de 4ème AM accompli ou équivalent. Durée de 24 mois. Une formation équilibrée combinant théorie et alternance en milieu professionnel.
              </p>
              <Link to="/formations?category=BT" className="btn btn-secondary" style={{ alignSelf: 'flex-start', marginTop: 'auto', display: 'inline-flex', gap: '0.5rem' }}>
                Explorer BT <ArrowRight size={14} />
              </Link>
            </div>

            {/* CMP Card */}
            <div className="level-item-card cmp">
              <span className="level-badge">CMP</span>
              <h3>Maîtrise Professionnelle</h3>
              <p>
                Formations qualifiantes ciblées et courtes, idéales pour acquérir des compétences pratiques immédiates ou pour une reconversion professionnelle rapide.
              </p>
              <Link to="/formations?category=CMP" className="btn btn-secondary" style={{ alignSelf: 'flex-start', marginTop: 'auto', display: 'inline-flex', gap: '0.5rem' }}>
                Explorer CMP <ArrowRight size={14} />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 4. DYNAMIC SHOWCASE SECTION */}
      <section className="featured-section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.1em' }}>
                Formations Vedettes
              </span>
              <h2 style={{ fontSize: '2.25rem', marginTop: '0.5rem', color: 'var(--primary)', fontFamily: 'var(--font-heading)', marginBottom: 0 }}>
                Programmes à la Une
              </h2>
            </div>
            <Link to="/formations" className="btn btn-primary" style={{ padding: '0.65rem 1.75rem' }}>
              Découvrir tout le catalogue
            </Link>
          </div>

          <div className="featured-grid">
            {randomFormations.map((formation) => (
              <div key={formation.id} className="featured-card">
                <div className="featured-card-meta">
                  <span className="featured-card-tag">
                    {formation.filiereName || 'Filière'}
                  </span>
                  <span className="featured-card-duration">
                    <Clock size={12} style={{ marginRight: '0.25rem', display: 'inline-block', verticalAlign: 'middle' }} />
                    {formation.categoryName === 'BTS' ? '30 Mois' : '24 Mois'}
                  </span>
                </div>
                <h3>
                  {formation.categoryName} - {formation.title}
                </h3>
                <p>
                  {formation.description ? 
                    (formation.description.length > 130 ? formation.description.slice(0, 130) + '...' : formation.description) 
                    : 'Aucune description disponible.'}
                </p>
                <Link to={`/formations/${formation.id}`} className="btn btn-secondary" style={{ marginTop: 'auto', alignSelf: 'flex-start', fontSize: '0.85rem' }}>
                  Voir le programme <ArrowRight size={14} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. WHY CHOOSE US - BENTO ADVANTAGES */}
      <section className="why-bento-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.1em' }}>
              Pourquoi l'INSIM ?
            </span>
            <h2 style={{ fontSize: '2.25rem', marginTop: '0.5rem', color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
              Les clés de votre réussite future
            </h2>
          </div>

          <div className="bento-advantages-grid">
            
            {/* Card 1: Pedagogie (span 2) */}
            <div className="bento-advantage-card bento-col-2">
              <h3>
                <Award size={22} style={{ color: 'var(--accent)' }} /> Excellence Académique & Corps Enseignant
              </h3>
              <p>
                Nos enseignants sont des praticiens chevronnés et des universitaires de haut niveau. Nos programmes sont continuellement mis à jour pour s'aligner sur les besoins des entreprises algériennes et internationales, garantissant une formation solide et immédiatement opérationnelle.
              </p>
            </div>

            {/* Card 2: Professionalisation (span 1) */}
            <div className="bento-advantage-card">
              <h3>
                <Briefcase size={22} style={{ color: 'var(--cyan)' }} /> Stages & Insertion
              </h3>
              <p>
                L'INSIM collabore étroitement avec un réseau de partenaires industriels pour assurer à chaque étudiant des stages de qualité et faciliter l'embauche post-diplôme.
              </p>
            </div>

            {/* Card 3: Modern Campus (span 1) */}
            <div className="bento-advantage-card">
              <h3>
                <Building size={22} style={{ color: 'var(--primary)' }} /> Infrastructures Modernes
              </h3>
              <p>
                Des salles de cours climatisées, des laboratoires informatiques équipés des derniers logiciels professionnels, et un cadre d'étude stimulant au centre de Bejaia.
              </p>
            </div>

            {/* Card 4: Accompagnement (span 2) */}
            <div className="bento-advantage-card bento-col-2">
              <h3>
                <Users size={22} style={{ color: 'var(--cyan)' }} /> Suivi & Accompagnement Personnalisé
              </h3>
              <p>
                Dès votre inscription et tout au long de votre cursus, nos conseillers pédagogiques vous guident dans votre projet professionnel, votre recherche de stage et votre préparation aux entretiens d'embauche.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 6. CTA PREMIUM BANNER */}
      <section className="cta-premium-section">
        <div className="container">
          <div className="cta-premium-card">
            <span className="cta-premium-tag">Inscriptions Actives</span>
            <h2>Prêt à lancer votre projet professionnel ?</h2>
            <p>
              Remplissez notre formulaire de préinscription en ligne en moins de 5 minutes. Nos conseillers d'orientation étudieront votre profil et vous contacteront sous 48 heures.
            </p>
            <Link to="/preinscription" className="btn btn-accent" style={{ padding: '1rem 2.5rem', fontSize: '1rem', fontWeight: 'bold' }}>
              Remplir le dossier d'inscription <ArrowRight size={18} style={{ marginLeft: '0.4rem' }} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;
