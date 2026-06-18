import React, { useState, useEffect } from 'react';
import { Shield, Eye, Lock, Database, FileText, CheckCircle } from 'lucide-react';

function PrivacyPolicy() {
  const [settings, setSettings] = useState({
    address: 'Cité Ihaddaden (près de la trémie) | 06000 Bejaia | Algérie',
    phone: '+213 (0) 34 12 34 56',
    email: 'contact@insimbejaia.com'
  });

  useEffect(() => {
    fetch('/settings')
      .then(res => {
        if (res.ok) return res.json();
      })
      .then(data => {
        if (data) setSettings(data);
      })
      .catch(err => console.warn('Offline or fallback settings', err));
  }, []);

  return (
    <div>
      {/* Hero Header Section */}
      <section 
        className="about-hero" 
        style={{ 
          background: 'linear-gradient(rgba(19, 75, 126, 0.9), rgba(19, 75, 126, 0.94)), url("https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80")', 
          backgroundSize: 'cover', 
          backgroundPosition: 'center', 
          borderBottom: '4px solid var(--accent)' 
        }}
      >
        <div className="container">
          <span style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--cyan)', letterSpacing: '0.15rem' }}>CHARTE DE CONFIDENTIALITÉ</span>
          <h2 style={{ fontSize: '2.8rem', fontWeight: '800', marginTop: '0.5rem', color: '#fff', fontFamily: 'var(--font-heading)' }}>Politique de Confidentialité</h2>
          <p style={{ fontSize: '1.2rem', opacity: 0.95, color: '#e2e8f0', maxWidth: '750px', margin: '0.5rem auto 0' }}>
            Nous accordons une importance cruciale à la protection de vos données personnelles et au respect de votre vie privée.
          </p>
        </div>
      </section>

      {/* Main Body Section */}
      <section className="section" style={{ backgroundColor: '#ffffff', minHeight: '60vh' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          
          <div style={{ textAlign: 'left', marginBottom: '2.5rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6', marginBottom: '2rem' }}>
              Dernière mise à jour : <strong>Juin 2026</strong>. Cette politique décrit la manière dont l'INSIM Bejaia collecte, utilise, traite et protège les informations que vous nous transmettez lorsque vous utilisez notre site internet ou que vous effectuez une demande de brochure ou une préinscription en ligne.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            
            {/* 1. Collecte des données */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', flexShrink: 0 }}>
                <Eye size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', fontWeight: '700', marginBottom: '0.75rem' }}>1. Collecte des données personnelles</h3>
                <p style={{ fontSize: '1.05rem', color: 'var(--text)', lineHeight: '1.6', marginBottom: '0.75rem' }}>
                  Nous recueillons plusieurs types de données personnelles lorsque vous interagissez avec notre plateforme :
                </p>
                <ul style={{ paddingLeft: '1.5rem', fontSize: '1.02rem', color: 'var(--text)', display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: '0.5rem 0' }}>
                  <li><strong>Formulaires de préinscription :</strong> Nom, prénom, date et lieu de naissance, numéro de téléphone, adresse e-mail, diplôme d'origine et spécialité visée.</li>
                  <li><strong>Téléchargement de brochures :</strong> Nom, e-mail, téléphone et formation d'intérêt.</li>
                  <li><strong>Formulaire de contact :</strong> Nom, adresse e-mail, sujet et contenu de votre message.</li>
                </ul>
              </div>
            </div>

            {/* 2. Utilisation des données */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', flexShrink: 0 }}>
                <Database size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', fontWeight: '700', marginBottom: '0.75rem' }}>2. Utilisation et traitement des informations</h3>
                <p style={{ fontSize: '1.05rem', color: 'var(--text)', lineHeight: '1.6' }}>
                  Toutes les données recueillies servent uniquement à la gestion de nos relations pédagogiques et administratives :
                </p>
                <ul style={{ paddingLeft: '1.5rem', fontSize: '1.02rem', color: 'var(--text)', display: 'flex', flexDirection: 'column', gap: '0.5rem', margin: '0.5rem 0' }}>
                  <li>Le traitement de votre demande de préinscription et la constitution de votre dossier d'orientation.</li>
                  <li>L'envoi des brochures descriptives des programmes d'études de l'institut.</li>
                  <li>La réponse à vos questions et messages via notre boîte de réception.</li>
                  <li>L'analyse de l'audience globale du site internet pour en améliorer la fluidité et les performances.</li>
                </ul>
              </div>
            </div>

            {/* 3. Cookies et traceurs */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', flexShrink: 0 }}>
                <Shield size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', fontWeight: '700', marginBottom: '0.75rem' }}>3. Cookies, Pixel Meta & Google Analytics</h3>
                <p style={{ fontSize: '1.05rem', color: 'var(--text)', lineHeight: '1.6', marginBottom: '0.75rem' }}>
                  Notre plateforme utilise des cookies pour améliorer votre navigation et mesurer l'audience. Ces cookies collectent des informations standard sur les visites de pages.
                </p>
                <p style={{ fontSize: '1.05rem', color: 'var(--text)', lineHeight: '1.6', marginBottom: '0.75rem' }}>
                  Nous utilisons également des outils tiers comme le <strong>Pixel Meta (Facebook)</strong> et <strong>Google Analytics</strong> pour mesurer les performances de nos campagnes publicitaires et cibler les besoins d'orientation.
                </p>
                <p style={{ fontSize: '1.05rem', color: 'var(--text)', lineHeight: '1.6' }}>
                  Vous pouvez à tout moment configurer votre choix de cookies via le bandeau en bas de page ou en vidant le cache de votre navigateur.
                </p>
              </div>
            </div>

            {/* 4. Durée de conservation */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', flexShrink: 0 }}>
                <FileText size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', fontWeight: '700', marginBottom: '0.75rem' }}>4. Conservation des données</h3>
                <p style={{ fontSize: '1.05rem', color: 'var(--text)', lineHeight: '1.6' }}>
                  Nous conservons vos données uniquement durant la période nécessaire aux démarches d'inscription administrative et d'orientation pédagogique, ou selon les obligations légales d'archivage académique des dossiers d'élèves. Vos données ne sont jamais vendues, louées ni cédées à des tiers à des fins commerciales.
                </p>
              </div>
            </div>

            {/* 5. Sécurité */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', flexShrink: 0 }}>
                <Lock size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', fontWeight: '700', marginBottom: '0.75rem' }}>5. Sécurité des transmissions</h3>
                <p style={{ fontSize: '1.05rem', color: 'var(--text)', lineHeight: '1.6' }}>
                  Toutes les pages du site web et les formulaires de préinscriptions utilisent le protocole sécurisé <strong>HTTPS</strong> avec un chiffrement SSL de haut niveau. Vos données sont transmises et stockées de manière sécurisée et ne sont accessibles qu'au personnel autorisé de l'INSIM Bejaia.
                </p>
              </div>
            </div>

            {/* 6. Droits de l'utilisateur */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '42px', height: '42px', borderRadius: '8px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', flexShrink: 0 }}>
                <CheckCircle size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--primary)', fontWeight: '700', marginBottom: '0.75rem' }}>6. Vos Droits</h3>
                <p style={{ fontSize: '1.05rem', color: 'var(--text)', lineHeight: '1.6' }}>
                  Conformément aux réglementations sur la protection des données personnelles, vous bénéficiez d'un droit d'accès, de rectification, de mise à jour et de suppression des données qui vous concernent. Pour exercer ce droit, veuillez contacter notre secrétariat par e-mail ou courrier.
                </p>
              </div>
            </div>

            {/* Contact details */}
            <div 
              style={{ 
                marginTop: '1.5rem', 
                backgroundColor: 'var(--bg)', 
                border: '1px solid var(--border)', 
                borderRadius: 'var(--radius-lg)', 
                padding: '20px',
                textAlign: 'left'
              }}
            >
              <h4 style={{ color: 'var(--primary)', fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.5rem' }}>Contact de l'Établissement</h4>
              <p style={{ fontSize: '0.98rem', margin: '0.25rem 0', color: 'var(--text)' }}>
                <strong>Adresse :</strong> {settings.address}
              </p>
              <p style={{ fontSize: '0.98rem', margin: '0.25rem 0', color: 'var(--text)' }}>
                <strong>Téléphone :</strong> {settings.phone}
              </p>
              <p style={{ fontSize: '0.98rem', margin: '0.25rem 0', color: 'var(--text)' }}>
                <strong>E-mail :</strong> <a href={`mailto:${settings.email.split(',')[0].trim()}`} style={{ color: 'var(--cyan)', textDecoration: 'underline' }}>{settings.email.split(',')[0].trim()}</a>
              </p>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}

export default PrivacyPolicy;
