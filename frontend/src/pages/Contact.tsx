import React, { useState, useEffect, useRef } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle, 
  Globe, 
  ChevronDown, 
  ExternalLink, 
  MessageSquare,
  Sparkles,
  Info
} from 'lucide-react';

function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSent, setIsSent] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [settings, setSettings] = useState({
    address: 'Cité Ihaddaden (près de la trémie), 06000 Bejaia, Algérie',
    phone: '+213 (0) 34 12 34 56, +213 (0) 34 12 34 57',
    mobile: '+213 (0) 550 123 456',
    email: 'contact@insimbejaia.com, inscriptions@insimbejaia.com',
    lat: '36.7511',
    lng: '5.0567',
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com'
  });
  
  const [campuses, setCampuses] = useState([]);
  const [selectedInst, setSelectedInst] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});

  const splitItems = (str) => {
    if (!str) return [];
    return str.split(',').map(item => item.trim()).filter(item => item.length > 0);
  };

  useEffect(() => {
    const fetchData = async () => {
      let activeSettings = { ...settings };

      // 1. Fetch settings from API
      try {
        const resSettings = await fetch('/settings');
        if (resSettings.ok) {
          const dataSettings = await resSettings.json();
          setSettings(dataSettings);
          activeSettings = dataSettings;
        }
      } catch (e) {
        console.warn("Failed fetching settings from API, using default/localStorage", e);
        const saved = localStorage.getItem('insim_settings');
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setSettings(parsed);
            activeSettings = parsed;
          } catch (err) {}
        }
      }

      // Initialize selectedInst with Bejaia default
      setSelectedInst({
        id: 'bejaia',
        name: 'INSIM Bejaia (Siège Principal)',
        address: activeSettings.address,
        phone: activeSettings.phone,
        mobile: activeSettings.mobile,
        email: activeSettings.email,
        lat: activeSettings.lat,
        lng: activeSettings.lng,
        facebook: activeSettings.facebook,
        instagram: activeSettings.instagram,
        linkedin: activeSettings.linkedin,
        twitter: activeSettings.twitter,
        website: 'https://insimbejaia.com',
        isMain: true
      });

      // 2. Fetch campuses from API
      try {
        const resCampuses = await fetch('/campuses');
        if (resCampuses.ok) {
          const dataCampuses = await resCampuses.json();
          setCampuses(dataCampuses);
        }
      } catch (e) {
        console.warn("Failed fetching campuses from API, using default/localStorage", e);
        const savedCampuses = localStorage.getItem('insim_campuses');
        if (savedCampuses) {
          try {
            setCampuses(JSON.parse(savedCampuses));
          } catch (err) {}
        }
      }
    };
    
    fetchData();
  }, []);

  // Poll for Leaflet
  useEffect(() => {
    if (window.L) {
      setMapLoaded(true);
    } else {
      const timer = setInterval(() => {
        if (window.L) {
          setMapLoaded(true);
          clearInterval(timer);
        }
      }, 100);
      return () => clearInterval(timer);
    }
  }, []);

  // Map initialization and markers placement
  useEffect(() => {
    if (!mapLoaded || !window.L || !settings) return;

    const mapElement = document.getElementById('interactive-leaflet-map');
    if (!mapElement) return;

    const mainLat = parseFloat(settings.lat || '36.7511');
    const mainLng = parseFloat(settings.lng || '5.0567');
    const map = window.L.map('interactive-leaflet-map').setView([mainLat, mainLng], 8);
    mapInstanceRef.current = map;

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    markersRef.current = {};

    // Bejaia Main Pin (Orange)
    const bejaiaIcon = window.L.divIcon({
      className: 'custom-map-pin main-pin',
      html: `<div style="background-color: #ea4f1f; color: white; border: 2.5px solid white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(234, 79, 31, 0.4)"><span style="font-family: 'Inter', system-ui, sans-serif; font-weight: 800; font-size: 14px;">B</span></div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });

    const bejaiaPhones = splitItems(settings.phone || settings.mobile).join('<br/>');
    const bejaiaMarker = window.L.marker([mainLat, mainLng], { icon: bejaiaIcon })
      .addTo(map)
      .bindPopup(`
        <div style="font-family: 'Inter', system-ui, sans-serif; padding: 4px; min-width: 160px;">
          <h4 style="margin: 0 0 4px 0; color: #134b7e; font-size: 14px; font-weight: 700;">INSIM Bejaia</h4>
          <p style="margin: 0 0 6px 0; font-size: 11px; color: #475569; line-height: 1.4;">${settings.address ? settings.address.replace(/\|/g, '<br/>') : ''}</p>
          <div style="font-size: 11px; font-weight: 700; color: #134b7e;">${bejaiaPhones}</div>
        </div>
      `);
    markersRef.current['bejaia'] = bejaiaMarker;

    // Other branch markers
    campuses.forEach(inst => {
      if (inst.sieges && Array.isArray(inst.sieges)) {
        inst.sieges.forEach(s => {
          if (s.lat && s.lng) {
            const branchIcon = window.L.divIcon({
              className: 'custom-map-pin branch-pin',
              html: `<div style="background-color: #134b7e; color: white; border: 2px solid white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 8px rgba(19, 75, 126, 0.3)"><span style="font-family: 'Inter', system-ui, sans-serif; font-weight: 700; font-size: 11px;">${inst.name ? inst.name.split(' ').pop().charAt(0).toUpperCase() : 'I'}</span></div>`,
              iconSize: [28, 28],
              iconAnchor: [14, 14]
            });

            const sPhones = splitItems(s.phone).join('<br/>');
            const markerId = `branch-${s.id}`;
            const marker = window.L.marker([parseFloat(s.lat), parseFloat(s.lng)], { icon: branchIcon })
              .addTo(map)
              .bindPopup(`
                <div style="font-family: 'Inter', system-ui, sans-serif; padding: 4px; min-width: 180px;">
                  <h4 style="margin: 0 0 2px 0; color: #134b7e; font-size: 13px; font-weight: 700;">${inst.name}</h4>
                  <h5 style="margin: 0 0 5px 0; color: #ea4f1f; font-size: 12px; font-weight: 600;">${s.name}</h5>
                  <p style="margin: 0 0 6px 0; font-size: 11px; color: #475569; line-height: 1.4;">${s.address}</p>
                  <p style="margin: 0 0 4px 0; font-size: 11px;"><b>Tél:</b><br/>${sPhones}</p>
                  <a href="${inst.website}" target="_blank" rel="noreferrer" style="color: #134b7e; font-weight: 700; text-decoration: underline; font-size: 11px;">Visiter le site</a>
                </div>
              `);
            markersRef.current[markerId] = marker;
          }
        });
      }
    });

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [mapLoaded, settings, campuses]);

  const handleFocusOnMap = (lat, lng, markerId) => {
    if (mapInstanceRef.current && lat && lng) {
      mapInstanceRef.current.setView([parseFloat(lat), parseFloat(lng)], 14, { animate: true });
      const marker = markersRef.current[markerId];
      if (marker) {
        marker.openPopup();
      }
      const mapEl = document.getElementById('interactive-leaflet-map');
      if (mapEl) {
        mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  const handleSelectInstitute = (inst, branch = null) => {
    if (branch) {
      setSelectedInst({
        id: `branch-${branch.id}`,
        name: `${inst.name} - ${branch.name}`,
        address: branch.address,
        phone: branch.phone,
        mobile: branch.mobile || '',
        email: branch.email,
        lat: branch.lat,
        lng: branch.lng,
        facebook: inst.facebook || '',
        instagram: inst.instagram || '',
        linkedin: inst.linkedin || '',
        twitter: inst.twitter || '',
        website: inst.website || '',
        googleMapsLink: branch.googleMapsLink || '',
        isMain: false
      });
      handleFocusOnMap(branch.lat, branch.lng, `branch-${branch.id}`);
    } else {
      setSelectedInst({
        id: 'bejaia',
        name: 'INSIM Bejaia (Siège Principal)',
        address: settings.address,
        phone: settings.phone,
        mobile: settings.mobile,
        email: settings.email,
        lat: settings.lat,
        lng: settings.lng,
        facebook: settings.facebook,
        instagram: settings.instagram,
        linkedin: settings.linkedin,
        twitter: settings.twitter,
        website: 'https://insimbejaia.com',
        isMain: true
      });
      handleFocusOnMap(settings.lat, settings.lng, 'bejaia');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          receivedAt: new Date().toISOString()
        })
      });

      if (!response.ok) {
        throw new Error('Failed to send message to backend api');
      }

      setIsSent(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      console.warn("Backend API offline, saving to LocalStorage fallback", err);
      try {
        const existingMessages = JSON.parse(localStorage.getItem('insim_messages') || '[]');
        const newMessage = {
          id: Date.now(),
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          receivedAt: new Date().toISOString()
        };
        localStorage.setItem('insim_messages', JSON.stringify([newMessage, ...existingMessages]));
        setIsSent(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } catch (e) {
        console.error(e);
      }
    } finally {
      setLoading(false);
    }
  };

  const phones = selectedInst ? [...splitItems(selectedInst.phone), ...splitItems(selectedInst.mobile)] : [];
  const emails = selectedInst ? splitItems(selectedInst.email) : [];

  return (
    <div className="section" style={{ backgroundColor: 'var(--bg)', padding: '3.5rem 0' }}>
      <div className="container">
        
        {/* Title */}
        <div style={{ marginBottom: '3rem', borderBottom: '1px solid var(--border)', paddingBottom: '2rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.1em' }}>
            LOCALISATION & CONTACT
          </span>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)', fontFamily: 'var(--font-heading)', marginTop: '0.25rem', marginBottom: '0.5rem', textAlign: 'left' }}>
            Contactez l'INSIM Bejaia
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '800px', margin: 0, fontSize: '1.05rem', lineHeight: '1.5' }}>
            Consultez nos adresses, coordonnées téléphoniques, ou utilisez notre carte interactive pour localiser notre siège principal ou nos campus partenaires.
          </p>
        </div>

        {/* Top Section: List on Left (1.2fr), Map on Right (1.8fr) */}
        <div className="contact-map-grid" style={{ marginBottom: '3.5rem' }}>
          
          {/* Left Column: Selection List of Institutes with Inline Details Accordion */}
          <div className="contact-list-container">
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', fontFamily: 'var(--font-sans)', color: 'var(--primary)', fontWeight: '700', borderBottom: '2px solid var(--primary-light)', paddingBottom: '0.75rem', flexShrink: 0 }}>
              Campus & Sièges
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflowY: 'auto', flexGrow: 1, paddingRight: '0.25rem' }}>
              
              {/* 1. Main Bejaia Site from settings */}
              {settings && (
                <div 
                  onClick={() => handleSelectInstitute(null)}
                  style={{ 
                    padding: '1.15rem', 
                    borderRadius: '8px', 
                    border: '1.5px solid',
                    borderColor: selectedInst?.id === 'bejaia' ? 'var(--accent)' : 'var(--border)',
                    backgroundColor: selectedInst?.id === 'bejaia' ? 'var(--accent-light)' : '#ffffff',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                  className="institute-select-card"
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--primary)', fontWeight: '750' }}>INSIM Bejaia</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem', marginTop: '0.25rem' }}>
                        {settings.address ? settings.address.split(settings.address.includes('|') ? '|' : ',').map((addr, idx) => (
                          <span key={idx} style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', lineHeight: '1.3' }}>{addr.trim()}</span>
                        )) : null}
                      </div>
                    </div>
                    <span style={{ fontSize: '0.65rem', fontWeight: '800', backgroundColor: 'var(--accent)', color: '#ffffff', padding: '0.25rem 0.5rem', borderRadius: '4px', flexShrink: 0, textTransform: 'uppercase' }}>Principal</span>
                  </div>

                  {/* Inline details for Bejaia */}
                  {selectedInst?.id === 'bejaia' && (
                    <div style={{ marginTop: '1.15rem', borderTop: '1px solid rgba(234, 79, 31, 0.15)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.85rem' }} onClick={(e) => e.stopPropagation()}>
                      
                      {/* Phones */}
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                        <Phone size={14} style={{ color: 'var(--primary)', marginTop: '0.2rem', flexShrink: 0 }} />
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                          {splitItems(settings.phone).map((phone, i) => (
                            <a key={`p-${i}`} href={`tel:${phone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', borderRadius: '4px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontWeight: '700', fontSize: '0.75rem', border: '1px solid rgba(19, 75, 126, 0.15)' }}>
                              {phone}
                            </a>
                          ))}
                          {splitItems(settings.mobile).map((mobile, i) => (
                            <a key={`m-${i}`} href={`tel:${mobile}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', borderRadius: '4px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', fontWeight: '700', fontSize: '0.75rem', border: '1px solid rgba(19, 75, 126, 0.15)' }}>
                              {mobile}
                            </a>
                          ))}
                        </div>
                      </div>

                      {/* Emails */}
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                        <Mail size={14} style={{ color: 'var(--primary)', marginTop: '0.2rem', flexShrink: 0 }} />
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', flexDirection: 'column' }}>
                          {splitItems(settings.email).map((email, i) => (
                            <a key={`e-${i}`} href={`mailto:${email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', borderRadius: '4px', backgroundColor: '#ffffff', color: 'var(--primary)', fontWeight: '700', fontSize: '0.75rem', border: '1px solid var(--border)' }}>
                              {email}
                            </a>
                          ))}
                        </div>
                      </div>

                      {/* Social links */}
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem', borderTop: '1px solid rgba(234, 79, 31, 0.15)', paddingTop: '0.75rem' }}>
                        {settings.facebook && (
                          <a href={settings.facebook} target="_blank" rel="noreferrer" className="social-icon-btn" style={{ backgroundColor: 'var(--primary)', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                          </a>
                        )}
                        {settings.instagram && (
                          <a href={settings.instagram} target="_blank" rel="noreferrer" className="social-icon-btn" style={{ backgroundColor: 'var(--primary)', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path></svg>
                          </a>
                        )}
                        {settings.linkedin && (
                          <a href={settings.linkedin} target="_blank" rel="noreferrer" className="social-icon-btn" style={{ backgroundColor: 'var(--primary)', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <svg viewBox="0 0 24 24" width="12" height="12" stroke="currentColor" strokeWidth="2" fill="none"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path></svg>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 2. Campus branches from campuses list */}
              {campuses.map(inst => (
                <div key={inst.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', borderLeft: '3px solid var(--primary-light)', paddingLeft: '0.75rem', marginTop: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.15rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{inst.name}</span>
                  </div>
                  
                  {inst.sieges && inst.sieges.map(s => {
                    const isSelected = selectedInst?.id === `branch-${s.id}`;
                    return (
                      <div
                        key={s.id}
                        onClick={() => handleSelectInstitute(inst, s)}
                        style={{
                          padding: '1rem',
                          borderRadius: '8px',
                          border: '1.5px solid',
                          borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                          backgroundColor: isSelected ? 'var(--primary-light)' : '#ffffff',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                        className="institute-select-card"
                      >
                        <strong style={{ fontSize: '0.92rem', color: 'var(--text-heading)', display: 'block' }}>{s.name}</strong>
                        <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--cyan)', fontWeight: '800' }}>{s.city}</span>
                        <p style={{ margin: '0.25rem 0 0', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.3' }}>{s.address}</p>

                        {/* Inline details for this branch */}
                        {isSelected && (
                          <div style={{ marginTop: '1.15rem', borderTop: '1px solid rgba(19, 75, 126, 0.15)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', fontSize: '0.85rem' }} onClick={(e) => e.stopPropagation()}>
                            
                            {/* Phones */}
                            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                              <Phone size={14} style={{ color: 'var(--primary)', marginTop: '0.2rem', flexShrink: 0 }} />
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                                {splitItems(s.phone).map((phone, i) => (
                                  <a key={`sp-${i}`} href={`tel:${phone}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', borderRadius: '4px', backgroundColor: '#ffffff', color: 'var(--primary)', fontWeight: '700', fontSize: '0.75rem', border: '1px solid var(--border)' }}>
                                    {phone}
                                  </a>
                                ))}
                              </div>
                            </div>

                            {/* Emails */}
                            {s.email && (
                              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                                <Mail size={14} style={{ color: 'var(--primary)', marginTop: '0.2rem', flexShrink: 0 }} />
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', flexDirection: 'column' }}>
                                  {splitItems(s.email).map((email, i) => (
                                    <a key={`se-${i}`} href={`mailto:${email}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.25rem 0.5rem', borderRadius: '4px', backgroundColor: '#ffffff', color: 'var(--primary)', fontWeight: '700', fontSize: '0.75rem', border: '1px solid var(--border)' }}>
                                      {email}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Google Maps link */}
                            {s.googleMapsLink && (
                              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', borderTop: '1px solid rgba(19, 75, 126, 0.15)', paddingTop: '0.75rem' }}>
                                <MapPin size={14} style={{ color: 'var(--accent)' }} />
                                <a href={s.googleMapsLink} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline', fontWeight: '700', fontSize: '0.8rem' }}>
                                  Ouvrir dans Google Maps
                                </a>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive Leaflet Map */}
          <div className="contact-map-container-el">
            <div id="interactive-leaflet-map" style={{ height: '100%', width: '100%', zIndex: 1 }}>
              {!mapLoaded && (
                <div style={{ display: 'flex', width: '100%', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontFamily: 'var(--font-sans)', fontSize: '0.92rem' }}>
                  <Info size={16} style={{ marginRight: '0.25rem' }} /> Chargement de la carte interactive...
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Section: Contact Form spanning full width */}
        <div style={{ backgroundColor: '#ffffff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2.5rem' }}>
          <h3 style={{ fontSize: '1.45rem', marginBottom: '1.5rem', fontFamily: 'var(--font-sans)', color: 'var(--primary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <MessageSquare size={20} style={{ color: 'var(--accent)' }} /> Écrivez-nous un message
          </h3>
          
          {isSent ? (
            <div style={{ border: '1px solid #d1fae5', backgroundColor: '#ecfdf5', borderRadius: 'var(--radius-lg)', padding: '2.5rem', textAlign: 'center' }}>
              <CheckCircle size={48} style={{ color: '#10b981', marginBottom: '1rem', display: 'inline-block' }} />
              <h4 style={{ fontSize: '1.3rem', color: '#065f46', fontWeight: '700' }}>Votre message a été envoyé !</h4>
              <p style={{ color: '#047857', fontSize: '0.95rem', marginTop: '0.5rem', lineHeight: '1.5', maxWidth: '600px', margin: '0.5rem auto 0' }}>
                Merci de nous avoir contactés. Le secrétariat administratif d'INSIM Bejaia étudiera votre demande et vous répondra sous 24 à 48 heures ouvrées.
              </p>
              <button onClick={() => setIsSent(false)} className="btn btn-secondary" style={{ marginTop: '1.5rem', padding: '0.65rem 2rem' }}>
                Envoyer un nouveau message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label htmlFor="name" style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--secondary)' }}>Nom complet *</label>
                  <input 
                    type="text" id="name" name="name" required className="form-control" 
                    placeholder="Ex: Mourad Kaci" value={formData.name} onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email" style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--secondary)' }}>Adresse e-mail *</label>
                  <input 
                    type="email" id="email" name="email" required className="form-control" 
                    placeholder="Ex: mourad@gmail.com" value={formData.email} onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="subject" style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--secondary)' }}>Sujet du message *</label>
                <input 
                  type="text" id="subject" name="subject" required className="form-control" 
                  placeholder="Ex: Renseignements d'inscription, Tarifs, Dates..." value={formData.subject} onChange={handleInputChange}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message" style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--secondary)' }}>Contenu du message *</label>
                <textarea 
                  id="message" name="message" required className="form-control" rows="5"
                  placeholder="Saisissez votre question ou demande ici en détail..." value={formData.message} onChange={handleInputChange}
                  style={{ resize: 'vertical' }}
                ></textarea>
              </div>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 2rem', fontWeight: '700' }} disabled={loading}>
                  <Send size={16} /> {loading ? 'Envoi en cours...' : 'Envoyer le message'}
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}

export default Contact;
