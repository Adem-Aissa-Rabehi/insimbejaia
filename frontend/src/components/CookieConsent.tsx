import React, { useState, useEffect } from 'react';
import { Cookie } from 'lucide-react';

function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('insim_cookie_consent');
    if (!consent) {
      // Show with a slight delay for smooth entry transition
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('insim_cookie_consent', 'accepted');
    setVisible(false);
  };

  const handleAcceptEssentials = () => {
    localStorage.setItem('insim_cookie_consent', 'essentials');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="cookie-consent-card">
      <style>{`
        .cookie-consent-card {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 380px;
          max-width: calc(100vw - 48px);
          background-color: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(226, 232, 240, 0.85);
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          z-index: 9999;
          display: flex;
          flex-direction: column;
          gap: 20px;
          animation: slideInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          font-family: var(--font-sans);
          box-sizing: border-box;
        }

        .cookie-icon-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          borderRadius: 50%;
          background-color: var(--primary-light); /* light blue site background */
          color: var(--primary); /* primary deep blue */
          flex-shrink: 0;
        }

        .cookie-btn-group {
          display: flex;
          gap: 12px;
          width: 100%;
        }

        .cookie-btn-primary {
          flex: 1;
          background-color: var(--accent); /* brand orange */
          color: #ffffff;
          border: none;
          border-radius: 12px;
          padding: 11px 16px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.1s ease;
          white-space: nowrap;
          text-align: center;
        }
        .cookie-btn-primary:hover {
          background-color: var(--accent-hover); /* dark orange */
        }
        .cookie-btn-primary:active {
          transform: scale(0.98);
        }

        .cookie-btn-secondary {
          flex: 1;
          background-color: var(--primary-light); /* light blue site background */
          color: var(--primary); /* primary deep blue text */
          border: none;
          border-radius: 12px;
          padding: 11px 16px;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s ease, transform 0.1s ease;
          white-space: nowrap;
          text-align: center;
        }
        .cookie-btn-secondary:hover {
          background-color: rgba(19, 75, 126, 0.15);
        }
        .cookie-btn-secondary:active {
          transform: scale(0.98);
        }

        .cookie-policy-link {
          font-size: 0.72rem;
          font-weight: 800;
          color: var(--primary); /* deep blue */
          text-decoration: none;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          transition: color 0.2s ease;
        }
        .cookie-policy-link:hover {
          color: var(--accent); /* hover to brand orange */
        }

        @keyframes slideInUp {
          from {
            transform: translateY(40px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        /* Mobile specific media query */
        @media (max-width: 480px) {
          .cookie-consent-card {
            bottom: 16px;
            right: 16px;
            left: 16px;
            width: auto;
            max-width: none;
            padding: 20px;
            gap: 16px;
            border-radius: 20px;
          }

          .cookie-btn-group {
            flex-direction: column;
            gap: 8px;
          }

          .cookie-btn-primary, .cookie-btn-secondary {
            width: 100%;
            padding: 13px 16px; /* larger tap targets on mobile */
            font-size: 0.9rem;
          }
        }
      `}</style>
      
      {/* Icon & Title Row */}
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <div className="cookie-icon-wrapper">
          <Cookie size={22} />
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <h4 
            style={{
              margin: 0,
              fontSize: '1.05rem',
              fontWeight: 700,
              color: 'var(--text-heading)',
            }}
          >
            Consentement aux Cookies
          </h4>
          <p 
            style={{
              margin: 0,
              fontSize: '0.86rem',
              lineHeight: '1.45',
              color: 'var(--text-muted)',
            }}
          >
            Nous utilisons des cookies pour améliorer votre expérience et analyser notre trafic. En cliquant sur 'Tout Accepter', vous consentez à notre utilisation des cookies.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="cookie-btn-group">
        <button onClick={handleAcceptAll} className="cookie-btn-primary">
          Tout Accepter
        </button>
        <button onClick={handleAcceptEssentials} className="cookie-btn-secondary">
          Essentiels Uniquement
        </button>
      </div>

      {/* Link to Privacy Policy */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2px' }}>
        <a href="/politique-confidentialite" className="cookie-policy-link">
          POLITIQUE DE CONFIDENTIALITÉ
        </a>
      </div>
    </div>
  );
}

export default CookieConsent;
