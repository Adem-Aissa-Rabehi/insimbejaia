import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  User,
  GraduationCap,
  Sparkles,
  BookmarkCheck,
  Send,
  BookOpen
} from 'lucide-react';

function PreInscription() {
  const [formationsList, setFormationsList] = useState([]);
  const [filieresList, setFilieresList] = useState([]);
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    gender: '',
    address: '',
    city: '',
    country: 'Algérie',
    lastDiploma: '',
    diplomaSpecialization: '',
    filiere: '',
    formation: ''
  });
  
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      let activeFormations = [];
      let activeFilieres = [];

      try {
        const resForm = await fetch('/formations-data');
        const resFil = await fetch('/filieres');
        if (resForm.ok && resFil.ok) {
          activeFormations = await resForm.json();
          activeFilieres = await resFil.json();
          setFormationsList(activeFormations);
          setFilieresList(activeFilieres);
        } else {
          throw new Error('API returned invalid status');
        }
      } catch (e) {
        console.warn("PreInscription: API offline, falling back to LocalStorage/mock", e);
        const savedFormations = localStorage.getItem('insim_formations');
        if (savedFormations) {
          try {
            activeFormations = JSON.parse(savedFormations);
          } catch (err) {}
        }
        setFormationsList(activeFormations);

        const savedFilieres = localStorage.getItem('insim_filieres');
        if (savedFilieres) {
          try {
            activeFilieres = JSON.parse(savedFilieres);
          } catch (err) {}
        }
        setFilieresList(activeFilieres);
      }

      // Initialize form defaults if list loaded
      if (activeFilieres.length > 0) {
        const defaultFil = activeFilieres[0].id;
        const matchingForms = activeFormations.filter(f => f.filiereId === defaultFil);
        setFormData(prev => ({
          ...prev,
          filiere: defaultFil,
          formation: matchingForms[0]?.id || ''
        }));
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'filiere') {
        const matchingFormations = formationsList.filter((f) => f.filiereId === value);
        if (matchingFormations.length > 0) {
          updated.formation = matchingFormations[0].id;
        } else {
          updated.formation = '';
        }
      }
      return updated;
    });
  };

  const handleNext = (e) => {
    e.preventDefault();
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const chosenFormation = formationsList.find((f) => f.id === formData.formation);
    const postBody = {
      ...formData,
      formationTitle: chosenFormation ? chosenFormation.title : formData.formation,
      registeredAt: new Date().toISOString()
    };

    try {
      const response = await fetch('/registrations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postBody)
      });

      if (!response.ok) {
        throw new Error('Failed submitting to API');
      }
      
      setIsSubmitted(true);
    } catch (err) {
      console.warn("Failed API submission, running LocalStorage fallback", err);
      try {
        const existingRegistrations = JSON.parse(localStorage.getItem('insim_registrations') || '[]');
        localStorage.setItem('insim_registrations', JSON.stringify([{ id: Date.now(), ...postBody }, ...existingRegistrations]));
        setIsSubmitted(true);
      } catch (e) {
        console.error(e);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section" style={{ backgroundColor: 'var(--bg)', padding: '3.5rem 0' }}>
      <div className="container" style={{ maxWidth: '800px' }}>
        
        {/* Header Title */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '0.1em' }}>
            Rentrée Académique 2026/2027
          </span>
          <h2 style={{ fontSize: '2.5rem', color: 'var(--primary)', fontFamily: 'var(--font-heading)', marginTop: '0.25rem', marginBottom: '0.5rem' }}>
            Formulaire de Préinscription
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '600px', margin: '0 auto' }}>
            Prenez votre avenir en main. Remplissez ce dossier de préinscription en ligne en 3 étapes rapides pour réserver votre place.
          </p>
        </div>

        {/* Chevron Step Indicators */}
        {!isSubmitted && (
          <div className="chevron-steps">
            <div className={`chevron-step ${step === 1 ? 'active' : ''} ${step > 1 ? 'completed' : ''}`}>
              1. Identité & Contact
            </div>
            <div className={`chevron-step ${step === 2 ? 'active' : ''} ${step > 2 ? 'completed' : ''}`}>
              2. Profil Académique
            </div>
            <div className={`chevron-step ${step === 3 ? 'active' : ''} ${step > 3 ? 'completed' : ''}`}>
              3. Choix d'Études
            </div>
          </div>
        )}

        {/* Form Body Card */}
        <div className="form-card-panel">
          {isSubmitted ? (
            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
              <div style={{ width: '4.5rem', height: '4.5rem', borderRadius: '50%', backgroundColor: '#ecfdf5', color: '#10b981', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <CheckCircle2 size={42} />
              </div>
              <h3 style={{ fontSize: '1.6rem', color: 'var(--primary)', fontWeight: '700', marginBottom: '0.5rem' }}>Candidature enregistrée !</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem', lineHeight: '1.5', maxWidth: '600px', margin: '0 auto 2rem' }}>
                Félicitations, votre dossier de préinscription a été transmis avec succès. Nos conseillers d'orientation étudieront votre profil et prendront contact avec vous sous 48 heures.
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', backgroundColor: 'var(--bg)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border)', textAlign: 'left', maxWidth: '500px', margin: '0 auto 2rem auto', fontSize: '0.92rem' }}>
                <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '0.25rem', fontWeight: '800', color: 'var(--primary)', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Récapitulatif du dossier</div>
                <p style={{ margin: 0 }}><strong>Candidat :</strong> {formData.name}</p>
                <p style={{ margin: 0 }}><strong>Formation demandée :</strong> {formationsList.find((f) => f.id === formData.formation)?.title || 'Non spécifiée'}</p>
                <p style={{ margin: 0 }}><strong>Téléphone :</strong> {formData.phone}</p>
                <p style={{ margin: 0 }}><strong>E-mail :</strong> {formData.email}</p>
              </div>
              
              <button 
                onClick={() => { setStep(1); setIsSubmitted(false); }} 
                className="btn btn-primary"
                style={{ padding: '0.75rem 2rem', fontWeight: '700' }}
              >
                Déposer une autre candidature
              </button>
            </div>
          ) : (
            <form onSubmit={step === 3 ? handleSubmit : handleNext} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              
              {/* STEP 1: Personal Details */}
              {step === 1 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', margin: 0 }}>
                    <User size={18} style={{ color: 'var(--accent)' }} /> Informations Personnelles
                  </h3>
                  
                  {/* Grid Row 1 */}
                  <div className="form-grid-2">
                    <div className="form-group">
                      <label htmlFor="name">Nom et Prénom *</label>
                      <input 
                        type="text" id="name" name="name" required className="form-control" 
                        placeholder="Ex: Amine Kaci" value={formData.name} onChange={handleInputChange} 
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="email">Adresse E-mail *</label>
                      <input 
                        type="email" id="email" name="email" required className="form-control" 
                        placeholder="Ex: amine.kaci@gmail.com" value={formData.email} onChange={handleInputChange} 
                      />
                    </div>
                  </div>

                  {/* Grid Row 2 */}
                  <div className="form-grid-3">
                    <div className="form-group">
                      <label htmlFor="phone">Numéro de Téléphone *</label>
                      <input 
                        type="tel" id="phone" name="phone" required className="form-control" 
                        placeholder="Ex: 0550 12 34 56" value={formData.phone} onChange={handleInputChange} 
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="birthDate">Date de naissance *</label>
                      <input 
                        type="date" id="birthDate" name="birthDate" required className="form-control" 
                        value={formData.birthDate} onChange={handleInputChange} 
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="gender">Genre *</label>
                      <select 
                        id="gender" name="gender" required className="form-control"
                        value={formData.gender} onChange={handleInputChange}
                      >
                        <option value="">-- Choisir --</option>
                        <option value="Homme">Homme</option>
                        <option value="Femme">Femme</option>
                      </select>
                    </div>
                  </div>

                  {/* Grid Row 3 */}
                  <div className="form-grid-3">
                    <div className="form-group">
                      <label htmlFor="address">Adresse de résidence *</label>
                      <input 
                        type="text" id="address" name="address" required className="form-control" 
                        placeholder="Ex: Cité Ihaddaden, Rue 5" value={formData.address} onChange={handleInputChange} 
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="city">Ville *</label>
                      <input 
                        type="text" id="city" name="city" required className="form-control" 
                        placeholder="Ex: Bejaia" value={formData.city} onChange={handleInputChange} 
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="country">Pays *</label>
                      <input 
                        type="text" id="country" name="country" required className="form-control" 
                        placeholder="Pays" value={formData.country} onChange={handleInputChange} 
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Academic Background */}
              {step === 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', margin: 0 }}>
                    <GraduationCap size={18} style={{ color: 'var(--accent)' }} /> Profil Académique
                  </h3>
                  
                  <div className="form-group">
                    <label htmlFor="lastDiploma">Dernier diplôme ou niveau d'études atteint *</label>
                    <select 
                      id="lastDiploma" name="lastDiploma" required className="form-control"
                      value={formData.lastDiploma} onChange={handleInputChange}
                    >
                      <option value="">-- Sélectionner un niveau --</option>
                      <option value="Terminale (Sans BAC)">Niveau Terminale (3AS accompli)</option>
                      <option value="Baccalauréat">Titulaire du Baccalauréat</option>
                      <option value="Technicien (BT)">Brevet de Technicien (BT)</option>
                      <option value="Technicien Supérieur (TS)">Brevet de Technicien Supérieur (BTS)</option>
                      <option value="Licence / Bac +3">Licence universitaire (LMD)</option>
                      <option value="Master / Bac +5">Master ou Ingéniorat</option>
                      <option value="Autre / Niveau Moyen">Autre niveau d'études</option>
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="diplomaSpecialization">Spécialité / Option du diplôme *</label>
                    <input 
                      type="text" id="diplomaSpecialization" name="diplomaSpecialization" required className="form-control" 
                      placeholder="Ex: Gestion de l'information, Sciences Expérimentales, Comptabilité..." value={formData.diplomaSpecialization} onChange={handleInputChange} 
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Program Selection */}
              {step === 3 && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--primary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', margin: 0 }}>
                    <BookmarkCheck size={18} style={{ color: 'var(--accent)' }} /> Choix de la Spécialité
                  </h3>
                  
                  <div className="form-group">
                    <label htmlFor="filiere">Filière d'études souhaitée *</label>
                    <select 
                      id="filiere" name="filiere" required className="form-control"
                      value={formData.filiere} onChange={handleInputChange}
                    >
                      {filieresList.map((fil) => (
                        <option key={fil.id} value={fil.id}>{fil.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="formation">Spécialité demandée *</label>
                    <select 
                      id="formation" name="formation" required className="form-control"
                      value={formData.formation} onChange={handleInputChange}
                    >
                      {formationsList.filter(f => f.filiereId === formData.filiere).map((form) => (
                        <option key={form.id} value={form.id}>{form.categoryName} - {form.title}</option>
                      ))}
                      {formationsList.filter(f => f.filiereId === formData.filiere).length === 0 && (
                        <option value="">Aucune spécialité disponible pour cette filière</option>
                      )}
                    </select>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                {step > 1 ? (
                  <button type="button" onClick={handleBack} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ChevronLeft size={16} /> Étape précédente
                  </button>
                ) : (
                  <div></div>
                )}
                
                {step < 3 ? (
                  <button type="submit" className="btn btn-primary" style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700' }}>
                    Étape suivante <ChevronRight size={16} />
                  </button>
                ) : (
                  <button type="submit" className="btn btn-accent" style={{ marginLeft: 'auto', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: '800' }} disabled={loading}>
                    <Send size={16} /> {loading ? 'Envoi du dossier...' : 'Confirmer ma préinscription'}
                  </button>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default PreInscription;
