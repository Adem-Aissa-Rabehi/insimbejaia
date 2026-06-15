import React, { useState, useEffect } from 'react';
import { Phone, Mail, MapPin, ArrowRight } from 'lucide-react';

function Footer() {
  const [settings, setSettings] = useState({
    address: 'Cité Ihaddaden, Bejaia, Algérie',
    phone: '+213 (0) 34 12 34 56',
    mobile: '+213 (0) 550 123 456',
    email: 'contact@insimbejaia.com',
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    youtube: 'https://youtube.com'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/settings');
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
          localStorage.setItem('insim_settings', JSON.stringify(data));
        }
      } catch (err) {
        console.warn("Failed fetching settings from API, using fallback", err);
        const saved = localStorage.getItem('insim_settings');
        if (saved) {
          try {
            setSettings(JSON.parse(saved));
          } catch (e) {
            console.error(e);
          }
        }
      }
    };
    fetchSettings();
  }, []);

  const delimiter = settings.address && settings.address.includes('|') ? '|' : ',';
  const addresses = settings.address ? settings.address.split(delimiter).map(s => s.trim()).filter(Boolean) : [];
  const phones = settings.phone ? settings.phone.split(',').map(s => s.trim()).filter(Boolean) : [];
  const mobiles = settings.mobile ? settings.mobile.split(',').map(s => s.trim()).filter(Boolean) : [];
  const emails = settings.email ? settings.email.split(',').map(s => s.trim()).filter(Boolean) : [];

  return (
    <footer className="footer-v2">
      <div className="container">
        <div className="footer-bento-grid">
          
          {/* Card 1: Brand & About (span 2) */}
          <div className="footer-bento-card footer-bento-col-2">
            <div className="footer-bento-brand">
              <div className="footer-bento-logo-row">
                <img src="/logo.png" alt="INSIM Bejaia Logo" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                <span>INSIM BEJAIA</span>
              </div>
              <p className="footer-bento-tagline">
                Institut Supérieur d'Informatique et de Management de Bejaia. École de référence agréée par l'État, formant les leaders de demain en informatique, gestion, ressources humaines et tourisme.
              </p>
              <div className="footer-bento-badges">
                <span className="footer-badge">Agréé par l'État</span>
                <span className="footer-badge">BTS • BT • CMP</span>
                <span className="footer-badge">Depuis 1993</span>
              </div>
            </div>
          </div>

          {/* Card 2: Quick Links (span 1) */}
          <div className="footer-bento-card">
            <h4>Navigation</h4>
            <ul className="footer-bento-links">
              <li><a href="/">Accueil</a></li>
              <li><a href="/formations">Nos Formations</a></li>
              <li><a href="/a-propos">À propos</a></li>
              <li><a href="/contact">Contact & Localisation</a></li>
              <li><a href="/preinscription">Préinscription</a></li>
            </ul>
          </div>

          {/* Card 3: Social Networks & Call (span 1) */}
          <div className="footer-bento-card">
            <h4>Suivez-nous</h4>
            <p style={{ fontSize: '0.78rem', opacity: 0.8, marginBottom: '1rem', lineHeight: 1.4 }}>
              Rejoignez notre communauté en ligne pour suivre nos actualités, séminaires et événements.
            </p>
            <div className="social-icons-row" style={{ marginBottom: '1.25rem' }}>
              <a href={settings.facebook || "https://facebook.com"} target="_blank" rel="noreferrer" className="social-icon-btn" title="Facebook">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href={settings.instagram || "https://instagram.com"} target="_blank" rel="noreferrer" className="social-icon-btn" title="Instagram">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
              <a href={settings.linkedin || "https://linkedin.com"} target="_blank" rel="noreferrer" className="social-icon-btn" title="LinkedIn">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
              </a>
              <a href={settings.youtube || "https://youtube.com"} target="_blank" rel="noreferrer" className="social-icon-btn" title="YouTube">
                <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>
              </a>
            </div>
            <a href="tel:+21334123456" className="btn btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', padding: '0.5rem 1rem', width: '100%', justifyContent: 'center' }}>
              <Phone size={14} /> Appeler le Secrétariat
            </a>
          </div>

          {/* Card 4: Contact Us (span 2) */}
          <div className="footer-bento-card footer-bento-col-2">
            <h4>Contactez-nous</h4>
            <ul className="footer-bento-contacts-list">
              {addresses.length > 0 && (
                <li>
                  <MapPin size={15} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    {addresses.map((addr, idx) => <span key={idx}>{addr}</span>)}
                  </div>
                </li>
              )}
              {(phones.length > 0 || mobiles.length > 0) && (
                <li>
                  <Phone size={15} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {phones.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)', marginRight: '0.25rem' }}>Tél :</span>
                        {phones.map((p, idx) => <a key={idx} href={`tel:${p}`}>{p}</a>)}
                      </div>
                    )}
                    {mobiles.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.6)', marginRight: '0.25rem' }}>Port :</span>
                        {mobiles.map((m, idx) => <a key={idx} href={`tel:${m}`}>{m}</a>)}
                      </div>
                    )}
                  </div>
                </li>
              )}
              {emails.length > 0 && (
                <li>
                  <Mail size={15} style={{ color: 'var(--accent)', flexShrink: 0, marginTop: '2px' }} />
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', flexDirection: 'column' }}>
                    {emails.map((e, idx) => <a key={idx} href={`mailto:${e}`}>{e}</a>)}
                  </div>
                </li>
              )}
            </ul>
          </div>

          {/* Card 5: Inscription CTA (span 2) */}
          <div className="footer-bento-card footer-bento-col-2 footer-cta-card" style={{ background: 'linear-gradient(135deg, rgba(234,79,31,0.1) 0%, rgba(19,75,126,0.15) 100%)', borderColor: 'rgba(234,79,31,0.2)' }}>
            <div>
              <span style={{ fontSize: '0.65rem', fontWeight: '800', background: 'var(--accent)', color: '#fff', padding: '0.15rem 0.5rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Inscriptions Ouvertes
              </span>
              <h3 style={{ fontSize: '1.25rem', margin: '0.5rem 0', color: '#fff', fontWeight: '700', fontFamily: 'var(--font-heading)' }}>
                Lancez votre projet d'études dès aujourd'hui
              </h3>
              <p style={{ fontSize: '0.82rem', opacity: 0.8, lineHeight: 1.4, margin: '0 0 1.25rem 0' }}>
                Déposez votre dossier de préinscription en ligne pour réserver votre place. Nos conseillers d'orientation étudieront votre profil gratuitement sous 48 heures.
              </p>
            </div>
            <a href="/preinscription" className="btn btn-accent" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', textDecoration: 'none', fontWeight: '700', width: 'fit-content', padding: '0.6rem 1.5rem', fontSize: '0.85rem' }}>
              Démarrer ma préinscription <ArrowRight size={14} />
            </a>
          </div>

        </div>

        {/* Bottom copyright */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '1.25rem', textAlign: 'center', fontSize: '0.8rem', opacity: 0.7 }}>
          Copyright &copy; {new Date().getFullYear()} INSIM Business School Bejaia. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
