import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, GraduationCap, Settings, LogOut, Plus, 
  FileSpreadsheet, Lock, Mail, Edit, Trash2, Save, Globe, Eye, MapPin, BookOpen, Link as LinkIcon,
  Menu, X, TrendingUp, CheckCircle
} from 'lucide-react';
const formationsData: any[] = [];

// Helper to extract coordinates from Google Maps URL
const extractCoordsFromGmaps = (url) => {
  if (!url) return null;
  // Match @lat,lng
  let match = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (match) {
    return { lat: match[1], lng: match[2] };
  }
  // Match place/lat,lng
  match = url.match(/place\/(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (match) {
    return { lat: match[1], lng: match[2] };
  }
  // Match !3dlat!4dlng
  let latMatch = url.match(/!3d(-?\d+\.\d+)/);
  let lngMatch = url.match(/!4d(-?\d+\.\d+)/);
  if (latMatch && lngMatch) {
    return { lat: latMatch[1], lng: lngMatch[2] };
  }
  // Match q=lat,lng
  match = url.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (match) {
    return { lat: match[1], lng: match[2] };
  }
  match = url.match(/query=(-?\d+\.\d+),(-?\d+\.\d+)/);
  if (match) {
    return { lat: match[1], lng: match[2] };
  }
  // Generic match decimal,decimal
  match = url.match(/(-?\d+\.\d+),\s*(-?\d+\.\d+)/);
  if (match) {
    return { lat: match[1], lng: match[2] };
  }
  return null;
};

function SemesterEditorRow({ semester, onAddModule, onRemoveModule, onRemoveSemester }) {
  const [newModuleName, setNewModuleName] = useState('');

  const handleAddClick = (e) => {
    e.preventDefault();
    if (newModuleName.trim()) {
      onAddModule(newModuleName.trim());
      setNewModuleName('');
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.5rem', marginBottom: '1rem', textAlign: 'left' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
        <h4 style={{ color: 'var(--primary)', margin: 0, fontWeight: '700', fontSize: '1.1rem' }}>
          Semestre {semester.number}
        </h4>
        <button 
          type="button" 
          onClick={onRemoveSemester}
          className="btn btn-secondary" 
          style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem', color: '#dc2626', borderColor: '#fee2e2' }}
        >
          Supprimer Semestre
        </button>
      </div>

      {/* Modules List */}
      <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.25rem 0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {(semester.modules || []).map((mod, idx) => (
          <li key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem' }}>
            <span>{mod}</span>
            <button 
              type="button" 
              onClick={() => onRemoveModule(idx)}
              style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
            >
              <Trash2 size={14} />
            </button>
          </li>
        ))}
        {(semester.modules || []).length === 0 && (
          <li style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
            Aucun module configuré pour ce semestre.
          </li>
        )}
      </ul>

      {/* Add Module Form */}
      <form onSubmit={handleAddClick} style={{ display: 'flex', gap: '0.75rem' }}>
        <input 
          type="text" 
          className="form-control" 
          placeholder="Nom du nouveau module (ex: Algorithmique, Marketing...)" 
          value={newModuleName}
          onChange={(e) => setNewModuleName(e.target.value)}
          style={{ flex: 1, padding: '0.4rem 0.75rem', fontSize: '0.85rem' }}
        />
        <button 
          type="submit" 
          className="btn btn-secondary" 
          style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
        >
          <Plus size={14} /> Ajouter Module
        </button>
      </form>
    </div>
  );
}

function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  
  const [activeTab, setActiveTab] = useState('stats');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  
  // Data States
  const [leads, setLeads] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [formations, setFormations] = useState([]);
  const [inboxMessages, setInboxMessages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [pageVisits, setPageVisits] = useState({});
  const [formationViews, setFormationViews] = useState([]); // [{ formationId, views }]
  const [contactSettings, setContactSettings] = useState({
    address: 'Cité Ihaddaden (près de la trémie), 06000 Bejaia, Algérie',
    phone: '+213 (0) 34 12 34 56',
    mobile: '+213 (0) 550 123 456',
    email: 'contact@insimbejaia.com',
    lat: '36.7511',
    lng: '5.0567',
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    linkedin: 'https://linkedin.com',
    twitter: 'https://twitter.com',
    metaPixelId: '',
    metaAccessToken: ''
  });

  // Campuses state
  const [campuses, setCampuses] = useState([]);
  const [expandedInstituteId, setExpandedInstituteId] = useState(null);

  // Accordion levels for nested CMS
  const [expandedCmsCategoryId, setExpandedCmsCategoryId] = useState(null);
  const [expandedCmsFiliereId, setExpandedCmsFiliereId] = useState(null);

  // Category and Filiere Modal States
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryModalMode, setCategoryModalMode] = useState('add');
  const [currentCategory, setCurrentCategory] = useState({ id: '', name: '' });

  const [showFiliereModal, setShowFiliereModal] = useState(false);
  const [filiereModalMode, setFiliereModalMode] = useState('add');
  const [currentFiliere, setCurrentFiliere] = useState({ id: '', name: '', categoryId: '' });

  const [showFormModal, setShowFormModal] = useState(false);
  const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
  const [currentFormation, setCurrentFormation] = useState({
    id: '',
    title: '',
    categoryId: '',
    filiereId: '',
    description: '',
    duration: '',
    objectivesText: '',
    brochure: ''
  });

  const [selectedFormationForCurriculum, setSelectedFormationForCurriculum] = useState(null);
  const [brochureFile, setBrochureFile] = useState(null); // Selected PDF file for upload

  // Nested Institute & branch (Siège) modals
  const [showInstituteModal, setShowInstituteModal] = useState(false);
  const [instituteModalMode, setInstituteModalMode] = useState('add');
  const [currentInstitute, setCurrentInstitute] = useState({ id: '', name: '', website: '', facebook: '' });

  const [showSiegeModal, setShowSiegeModal] = useState(false);
  const [siegeModalMode, setSiegeModalMode] = useState('add');
  const [currentSiege, setCurrentSiege] = useState({
    id: '',
    name: '',
    city: '',
    address: '',
    phone: '',
    email: '',
    googleMapsLink: '',
    lat: '36.7511',
    lng: '5.0567',
    parentInstituteId: ''
  });

  const [toast, setToast] = useState(null); // { message, type: 'success' | 'error' }
  const [confirmModal, setConfirmModal] = useState(null); // { message, onConfirm, onCancel }

  // Multi-input States for settings
  const [phonesList, setPhonesList] = useState(['']);
  const [mobilesList, setMobilesList] = useState(['']);
  const [emailsList, setEmailsList] = useState(['']);
  const [addressesList, setAddressesList] = useState(['']);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const requestConfirm = (message, onConfirm) => {
    setConfirmModal({
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmModal(null);
      },
      onCancel: () => setConfirmModal(null)
    });
  };

  const handleListChange = (list, setList, index, val) => {
    const newList = [...list];
    newList[index] = val;
    setList(newList);
  };

  const handleAddListItem = (list, setList) => {
    setList([...list, '']);
  };

  const handleRemoveListItem = (list, setList, index) => {
    if (list.length > 1) {
      setList(list.filter((_, idx) => idx !== index));
    } else {
      setList(['']);
    }
  };

  // Sync settings when loaded
  useEffect(() => {
    if (contactSettings) {
      if (contactSettings.phone) {
        setPhonesList(contactSettings.phone.split(',').map(s => s.trim()).filter(Boolean));
      } else {
        setPhonesList(['']);
      }
      if (contactSettings.mobile) {
        setMobilesList(contactSettings.mobile.split(',').map(s => s.trim()).filter(Boolean));
      } else {
        setMobilesList(['']);
      }
      if (contactSettings.email) {
        setEmailsList(contactSettings.email.split(',').map(s => s.trim()).filter(Boolean));
      } else {
        setEmailsList(['']);
      }
      if (contactSettings.address) {
        const delimiter = contactSettings.address.includes('|') ? '|' : ',';
        setAddressesList(contactSettings.address.split(delimiter).map(s => s.trim()).filter(Boolean));
      } else {
        setAddressesList(['']);
      }
    }
  }, [contactSettings]);

  // CSV Exporter
  const exportToCSV = (data, filenamePrefix) => {
    if (!data || data.length === 0) {
      showToast("Aucune donnée à exporter", "error");
      return;
    }

    let csvRows = [];
    let headers = [];
    let rowsToExport = [];

    if (filenamePrefix === 'prospects_brochures') {
      headers = ['Date de téléchargement', 'Nom Complet', 'E-mail', 'Téléphone', 'Formation'];
      rowsToExport = data.map(item => [
        item.createdAt ? new Date(item.createdAt).toLocaleString('fr-FR') : (item.downloadedAt ? new Date(item.downloadedAt).toLocaleString('fr-FR') : ''),
        item.name || '',
        item.email || '',
        item.phone || '',
        item.formationTitle || ''
      ]);
    } else if (filenamePrefix === 'candidatures_insim') {
      headers = ["Date d'inscription", "Nom Complet", "Téléphone", "E-mail", "Diplôme obtenu", "Spécialité", "Formation souhaitée"];
      rowsToExport = data.map(item => {
        const name = item.nom ? `${item.nom} ${item.prenom || ''}`.trim() : (item.name || '');
        return [
          item.createdAt ? new Date(item.createdAt).toLocaleString('fr-FR') : (item.registeredAt ? new Date(item.registeredAt).toLocaleString('fr-FR') : ''),
          name,
          item.phone || '',
          item.email || '',
          item.lastDegree || item.lastDiploma || '',
          item.diplomaSpecialization || '',
          item.selectedFormation || item.formationTitle || ''
        ];
      });
    } else {
      headers = Object.keys(data[0]);
      rowsToExport = data.map(row => headers.map(h => row[h]));
    }

    // Use semicolon for European/French Excel compatibility, and escape fields properly
    csvRows.push(headers.map(h => `"${h.replace(/"/g, '""')}"`).join(';'));

    for (const row of rowsToExport) {
      const escapedValues = row.map(val => {
        const strVal = '' + (val !== null && val !== undefined ? val : '');
        const cleaned = strVal.replace(/"/g, '""').replace(/\r?\n/g, ' ');
        return `"${cleaned}"`;
      });
      csvRows.push(escapedValues.join(';'));
    }

    const csvContent = "\uFEFF" + csvRows.join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${filenamePrefix}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Fichier CSV exporté avec succès !");
  };

  useEffect(() => {
    const loggedIn = sessionStorage.getItem('insim_admin_logged');
    if (loggedIn) {
      setIsAuthenticated(true);
    }

    // Parse query parameters to activate specific tab (like after Google OAuth success redirection)
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get('tab');
    if (tabParam) {
      setActiveTab(tabParam);
    }

    const oauthParam = params.get('oauth');
    if (oauthParam === 'success') {
      setTimeout(() => {
        showToast("Compte Google Analytics associé avec succès !");
      }, 300);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      // 1. Categories
      try {
        const res = await fetch('/categories');
        if (res.ok) setCategories(await res.json());
      } catch (e) {
        console.warn("Failed fetching categories", e);
        const saved = localStorage.getItem('insim_categories');
        if (saved) setCategories(JSON.parse(saved));
      }

      // 2. Filieres
      try {
        const res = await fetch('/filieres');
        if (res.ok) setFilieres(await res.json());
      } catch (e) {
        console.warn("Failed fetching filieres", e);
        const saved = localStorage.getItem('insim_filieres');
        if (saved) setFilieres(JSON.parse(saved));
      }

      // 3. Formations
      try {
        const res = await fetch('/formations-data');
        if (res.ok) setFormations(await res.json());
      } catch (e) {
        console.warn("Failed fetching formations", e);
        const saved = localStorage.getItem('insim_formations');
        if (saved) setFormations(JSON.parse(saved));
      }

      // 4. Settings
      try {
        const res = await fetch('/settings');
        if (res.ok) setContactSettings(await res.json());
      } catch (e) {
        console.warn("Failed fetching settings", e);
        const saved = localStorage.getItem('insim_settings');
        if (saved) setContactSettings(JSON.parse(saved));
      }

      // 5. Campuses
      try {
        const res = await fetch('/campuses');
        if (res.ok) setCampuses(await res.json());
      } catch (e) {
        console.warn("Failed fetching campuses", e);
        const saved = localStorage.getItem('insim_campuses');
        if (saved) setCampuses(JSON.parse(saved));
      }

      // 6. Leads
      try {
        const res = await fetch('/leads');
        if (res.ok) setLeads(await res.json());
      } catch (e) {
        console.warn("Failed fetching leads", e);
        const saved = localStorage.getItem('insim_leads');
        if (saved) setLeads(JSON.parse(saved));
      }

      // 7. Registrations
      try {
        const res = await fetch('/registrations');
        if (res.ok) setRegistrations(await res.json());
      } catch (e) {
        console.warn("Failed fetching registrations", e);
        const saved = localStorage.getItem('insim_registrations');
        if (saved) setRegistrations(JSON.parse(saved));
      }

      // 8. Inbox/Messages
      try {
        const res = await fetch('/messages');
        if (res.ok) setInboxMessages(await res.json());
      } catch (e) {
        console.warn("Failed fetching messages", e);
      }

      // 9. Page visits stats
      try {
        const res = await fetch('/stats/pages');
        if (res.ok) setPageVisits(await res.json());
      } catch (e) {
        console.warn("Failed fetching page stats", e);
      }

      // 10. Formation view stats
      try {
        const res = await fetch('/stats/formations');
        if (res.ok) setFormationViews(await res.json());
      } catch (e) {
        console.warn("Failed fetching formation stats", e);
      }
    };

    if (isAuthenticated) {
      fetchAllData();
    }
  }, [isAuthenticated]);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginData.username === 'admin' && loginData.password === 'admin') {
      sessionStorage.setItem('insim_admin_logged', 'true');
      setIsAuthenticated(true);
      setLoginError('');
    } else {
      setLoginError('Identifiants incorrects (admin/admin)');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('insim_admin_logged');
    setIsAuthenticated(false);
  };

  // Category CRUD
  const handleOpenAddCategoryModal = () => {
    setCategoryModalMode('add');
    setCurrentCategory({ id: '', name: '' });
    setShowCategoryModal(true);
  };

  const handleOpenEditCategoryModal = (cat) => {
    setCategoryModalMode('edit');
    setCurrentCategory({ ...cat });
    setShowCategoryModal(true);
  };

  const handleCategoryInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCategory(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    let updatedCats = [...categories];

    if (categoryModalMode === 'add') {
      const slug = currentCategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const newCat = { id: slug, name: currentCategory.name };
      try {
        const res = await fetch('/categories', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newCat)
        });
        if (res.ok) {
          const savedCat = await res.json();
          setCategories([...categories, savedCat]);
        }
      } catch (err) {
        console.error("Failed API save category, fallback to local", err);
        updatedCats = [...updatedCats, newCat];
        setCategories(updatedCats);
        localStorage.setItem('insim_categories', JSON.stringify(updatedCats));
      }
    } else {
      const updatedCat = { ...currentCategory };
      try {
        const res = await fetch(`/categories/${currentCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedCat)
        });
        if (res.ok) {
          const savedCat = await res.json();
          setCategories(categories.map(c => c.id === currentCategory.id ? savedCat : c));
        }
      } catch (err) {
        console.error("Failed API edit category, fallback to local", err);
        updatedCats = updatedCats.map(c => c.id === currentCategory.id ? { ...c, name: currentCategory.name } : c);
        setCategories(updatedCats);
        localStorage.setItem('insim_categories', JSON.stringify(updatedCats));
      }
    }
    setShowCategoryModal(false);
  };

  const handleDeleteCategory = (id) => {
    requestConfirm(
      'Voulez-vous vraiment supprimer cette catégorie ? Toutes ses filières et spécialités (formations) associées seront également supprimées.',
      async () => {
        try {
          const res = await fetch(`/categories/${id}`, {
            method: 'DELETE'
          });
          if (res.status === 204 || res.ok) {
            const associatedFiliereIds = filieres.filter(f => f.categoryId === id).map(f => f.id);
            setCategories(prev => prev.filter(c => c.id !== id));
            setFilieres(prev => prev.filter(f => f.categoryId !== id));
            setFormations(prev => prev.filter(f => f.categoryId !== id && !associatedFiliereIds.includes(f.filiereId)));
            showToast('Catégorie supprimée avec succès !');
          }
        } catch (err) {
          console.error(err);
          const associatedFiliereIds = filieres.filter(f => f.categoryId === id).map(f => f.id);
          setCategories(prev => prev.filter(c => c.id !== id));
          setFilieres(prev => prev.filter(f => f.categoryId !== id));
          setFormations(prev => prev.filter(f => f.categoryId !== id && !associatedFiliereIds.includes(f.filiereId)));
          localStorage.setItem('insim_categories', JSON.stringify(categories.filter(c => c.id !== id)));
          localStorage.setItem('insim_filieres', JSON.stringify(filieres.filter(f => f.categoryId !== id)));
          localStorage.setItem('insim_formations', JSON.stringify(formations.filter(f => f.categoryId !== id && !associatedFiliereIds.includes(f.filiereId))));
          showToast('Catégorie supprimée localement !');
        }
      }
    );
  };

  // Filière CRUD
  const handleOpenAddFiliereModal = () => {
    setFiliereModalMode('add');
    setCurrentFiliere({ id: '', name: '', categoryId: categories[0]?.id || '' });
    setShowFiliereModal(true);
  };

  const handleOpenAddFiliereForCategory = (catId) => {
    setFiliereModalMode('add');
    setCurrentFiliere({ id: '', name: '', categoryId: catId });
    setShowFiliereModal(true);
  };

  const handleOpenEditFiliereModal = (fil) => {
    setFiliereModalMode('edit');
    setCurrentFiliere({ ...fil });
    setShowFiliereModal(true);
  };

  const handleFiliereInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentFiliere(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveFiliere = async (e) => {
    e.preventDefault();
    let updatedFils = [...filieres];

    if (filiereModalMode === 'add') {
      const slug = currentFiliere.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const newFil = { id: slug, name: currentFiliere.name, categoryId: currentFiliere.categoryId };
      try {
        const res = await fetch('/filieres', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newFil)
        });
        if (res.ok) {
          const savedFil = await res.json();
          setFilieres([...filieres, savedFil]);
        }
      } catch (err) {
        console.error(err);
        updatedFils = [...updatedFils, newFil];
        setFilieres(updatedFils);
        localStorage.setItem('insim_filieres', JSON.stringify(updatedFils));
      }
    } else {
      const updatedFil = { ...currentFiliere };
      try {
        const res = await fetch(`/filieres/${currentFiliere.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedFil)
        });
        if (res.ok) {
          const savedFil = await res.json();
          setFilieres(filieres.map(f => f.id === currentFiliere.id ? savedFil : f));
        }
      } catch (err) {
        console.error(err);
        updatedFils = updatedFils.map(f => f.id === currentFiliere.id ? { ...f, name: currentFiliere.name, categoryId: currentFiliere.categoryId } : f);
        setFilieres(updatedFils);
        localStorage.setItem('insim_filieres', JSON.stringify(updatedFils));
      }
    }
    setShowFiliereModal(false);
  };

  const handleDeleteFiliere = (id) => {
    requestConfirm(
      'Voulez-vous vraiment supprimer cette filière ? Toutes ses spécialités (formations) associées seront également supprimées.',
      async () => {
        try {
          const res = await fetch(`/filieres/${id}`, {
            method: 'DELETE'
          });
          if (res.status === 204 || res.ok) {
            setFilieres(prev => prev.filter(f => f.id !== id));
            setFormations(prev => prev.filter(f => f.filiereId !== id));
            showToast('Filière supprimée avec succès !');
          }
        } catch (err) {
          console.error(err);
          setFilieres(prev => prev.filter(f => f.id !== id));
          setFormations(prev => prev.filter(f => f.filiereId !== id));
          localStorage.setItem('insim_filieres', JSON.stringify(filieres.filter(f => f.id !== id)));
          localStorage.setItem('insim_formations', JSON.stringify(formations.filter(f => f.filiereId !== id)));
          showToast('Filière supprimée localement !');
        }
      }
    );
  };

  // Formations CRUD
  const handleOpenAddModal = () => {
    setModalMode('add');
    const defaultCat = categories[0]?.id || '';
    const filteredFils = filieres.filter(f => f.categoryId === defaultCat);
    setCurrentFormation({
      id: '',
      title: '',
      categoryId: defaultCat,
      filiereId: filteredFils[0]?.id || '',
      description: '',
      duration: '30 mois (Plein temps)',
      objectivesText: '',
      brochure: ''
    });
    setBrochureFile(null);
    setShowFormModal(true);
  };

  const handleOpenAddFormationForFiliere = (catId, filId) => {
    setModalMode('add');
    setCurrentFormation({
      id: '',
      title: '',
      categoryId: catId,
      filiereId: filId,
      description: '',
      duration: '30 mois (Plein temps)',
      objectivesText: '',
      brochure: ''
    });
    setBrochureFile(null);
    setShowFormModal(true);
  };

  const handleOpenEditModal = (formation) => {
    setModalMode('edit');
    const matchedFiliere = filieres.find(f => f.id === formation.filiereId);
    setCurrentFormation({
      id: formation.id,
      title: formation.title,
      categoryId: formation.categoryId || matchedFiliere?.categoryId || 'diplomes-etat',
      filiereId: formation.filiereId,
      description: formation.description || '',
      duration: formation.duration || '30 mois (Plein temps)',
      objectivesText: formation.objectives ? formation.objectives.join('\n') : '',
      brochure: formation.brochure || ''
    });
    setBrochureFile(null);
    setShowFormModal(true);
  };

  const handleModalInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentFormation((prev) => {
      const updated = { ...prev, [name]: value };
      if (name === 'categoryId') {
        const matchingFils = filieres.filter(f => f.categoryId === value);
        updated.filiereId = matchingFils[0]?.id || '';
      }
      return updated;
    });
  };

  const handleSaveFormation = async (e) => {
    e.preventDefault();
    const objectivesArray = currentFormation.objectivesText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);

    const matchedFiliere = filieres.find(f => f.id === currentFormation.filiereId);
    const filName = matchedFiliere ? matchedFiliere.name : 'Autre';

    if (modalMode === 'add') {
      const slug = currentFormation.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      const formData = new FormData();
      formData.append('id', slug);
      formData.append('title', currentFormation.title);
      formData.append('categoryId', currentFormation.categoryId);
      formData.append('filiereId', currentFormation.filiereId);
      formData.append('filiereName', filName);
      formData.append('description', currentFormation.description);
      formData.append('duration', currentFormation.duration || '30 mois (Plein temps)');
      formData.append('objectives', JSON.stringify(objectivesArray));
      if (brochureFile) {
        formData.append('brochureFile', brochureFile);
      }

      try {
        const res = await fetch('/formations-data', {
          method: 'POST',
          body: formData // No Content-Type header – browser sets multipart boundary
        });
        if (res.ok) {
          const savedForm = await res.json();
          setFormations([...formations, savedForm]);
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      const existingFormation = formations.find(f => f.id === currentFormation.id);

      const formData = new FormData();
      formData.append('title', currentFormation.title);
      formData.append('categoryId', currentFormation.categoryId);
      formData.append('filiereId', currentFormation.filiereId);
      formData.append('filiereName', filName);
      formData.append('description', currentFormation.description);
      formData.append('duration', currentFormation.duration || '30 mois (Plein temps)');
      formData.append('objectives', JSON.stringify(objectivesArray));
      // Keep existing semesters
      formData.append('semesters', JSON.stringify(existingFormation?.semesters || []));
      // Keep old brochure path if no new file is chosen
      if (brochureFile) {
        formData.append('brochureFile', brochureFile);
      } else {
        formData.append('brochure', currentFormation.brochure || '');
      }

      try {
        const res = await fetch(`/formations-data/${currentFormation.id}`, {
          method: 'PUT',
          body: formData
        });
        if (res.ok) {
          const savedForm = await res.json();
          setFormations(formations.map(f => f.id === currentFormation.id ? savedForm : f));
        }
      } catch (err) {
        console.error(err);
      }
    }
    setBrochureFile(null);
    setShowFormModal(false);
  };

  const handleDeleteFormation = (id) => {
    requestConfirm(
      'Voulez-vous vraiment supprimer cette spécialité ?',
      async () => {
        try {
          const res = await fetch(`/formations-data/${id}`, {
            method: 'DELETE'
          });
          if (res.status === 204 || res.ok) {
            setFormations(formations.filter(f => f.id !== id));
            showToast('Spécialité supprimée avec succès !');
          }
        } catch (err) {
          console.error(err);
          const updated = formations.filter(f => f.id !== id);
          setFormations(updated);
          localStorage.setItem('insim_formations', JSON.stringify(updated));
          showToast('Spécialité supprimée localement !');
        }
      }
    );
  };

  // Curriculum Editor Handlers
  const handleOpenCurriculumEditor = (formation) => {
    setSelectedFormationForCurriculum(JSON.parse(JSON.stringify(formation)));
  };

  const handleCloseCurriculumEditor = () => {
    setSelectedFormationForCurriculum(null);
  };

  const handleUpdateCurriculumField = (fieldName, value) => {
    setSelectedFormationForCurriculum(prev => ({
      ...prev,
      [fieldName]: value
    }));
  };

  const handleAddSemester = () => {
    setSelectedFormationForCurriculum(prev => {
      const nextSemesters = [...(prev.semesters || [])];
      nextSemesters.push({ number: nextSemesters.length + 1, modules: [] });
      return { ...prev, semesters: nextSemesters };
    });
  };

  const handleRemoveSemester = (number) => {
    setSelectedFormationForCurriculum(prev => {
      const nextSemesters = (prev.semesters || [])
        .filter(s => s.number !== number)
        .map((s, idx) => ({ ...s, number: idx + 1 }));
      return { ...prev, semesters: nextSemesters };
    });
  };

  const handleAddModuleToSemester = (semNumber, moduleName) => {
    if (!moduleName.trim()) return;
    setSelectedFormationForCurriculum(prev => {
      const nextSemesters = (prev.semesters || []).map(s => {
        if (s.number === semNumber) {
          return { ...s, modules: [...(s.modules || []), moduleName.trim()] };
        }
        return s;
      });
      return { ...prev, semesters: nextSemesters };
    });
  };

  const handleRemoveModuleFromSemester = (semNumber, moduleIdx) => {
    setSelectedFormationForCurriculum(prev => {
      const nextSemesters = (prev.semesters || []).map(s => {
        if (s.number === semNumber) {
          const nextModules = s.modules.filter((_, idx) => idx !== moduleIdx);
          return { ...s, modules: nextModules };
        }
        return s;
      });
      return { ...prev, semesters: nextSemesters };
    });
  };

  const handleSaveCurriculum = async () => {
    try {
      const res = await fetch(`/formations-data/${selectedFormationForCurriculum.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedFormationForCurriculum)
      });
      if (res.ok) {
        const savedForm = await res.json();
        setFormations(formations.map(f => f.id === selectedFormationForCurriculum.id ? savedForm : f));
      }
    } catch (err) {
      console.error(err);
      const updatedFormations = formations.map(f => {
        if (f.id === selectedFormationForCurriculum.id) {
          return selectedFormationForCurriculum;
        }
        return f;
      });
      setFormations(updatedFormations);
      localStorage.setItem('insim_formations', JSON.stringify(updatedFormations));
    }
    setSelectedFormationForCurriculum(null);
    showToast('Curriculum enregistré avec succès !');
  };

  // Group Institute CRUD
  const handleOpenAddInstituteModal = () => {
    setInstituteModalMode('add');
    setCurrentInstitute({ id: '', name: '', website: '', facebook: '' });
    setShowInstituteModal(true);
  };

  const handleOpenEditInstituteModal = (inst) => {
    setInstituteModalMode('edit');
    setCurrentInstitute({ ...inst });
    setShowInstituteModal(true);
  };

  const handleSaveInstitute = async (e) => {
    e.preventDefault();
    let updatedCampuses = [...campuses];
    if (instituteModalMode === 'add') {
      const newInst = {
        id: Date.now(),
        name: currentInstitute.name,
        website: currentInstitute.website,
        facebook: currentInstitute.facebook,
        sieges: []
      };
      try {
        const res = await fetch('/campuses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newInst)
        });
        if (res.ok) {
          const savedInst = await res.json();
          setCampuses([...campuses, savedInst]);
        }
      } catch (err) {
        console.error(err);
        updatedCampuses = [...updatedCampuses, newInst];
        setCampuses(updatedCampuses);
        localStorage.setItem('insim_campuses', JSON.stringify(updatedCampuses));
      }
    } else {
      const updatedInst = {
        ...campuses.find(c => c.id === currentInstitute.id),
        name: currentInstitute.name,
        website: currentInstitute.website,
        facebook: currentInstitute.facebook
      };
      try {
        const res = await fetch(`/campuses/${currentInstitute.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedInst)
        });
        if (res.ok) {
          const savedInst = await res.json();
          setCampuses(campuses.map(c => c.id === currentInstitute.id ? savedInst : c));
        }
      } catch (err) {
        console.error(err);
        updatedCampuses = updatedCampuses.map(c => 
          c.id === currentInstitute.id ? updatedInst : c
        );
        setCampuses(updatedCampuses);
        localStorage.setItem('insim_campuses', JSON.stringify(updatedCampuses));
      }
    }
    setShowInstituteModal(false);
  };

  const handleDeleteInstitute = (id) => {
    requestConfirm(
      'Voulez-vous vraiment supprimer cet institut et tous ses sièges ?',
      async () => {
        try {
          const res = await fetch(`/campuses/${id}`, {
            method: 'DELETE'
          });
          if (res.status === 204 || res.ok) {
            setCampuses(campuses.filter(c => c.id !== id));
            showToast('Institut supprimé avec succès !');
          }
        } catch (err) {
          console.error(err);
          const updated = campuses.filter(c => c.id !== id);
          setCampuses(updated);
          localStorage.setItem('insim_campuses', JSON.stringify(updated));
          showToast('Institut supprimé localement !');
        }
      }
    );
  };

  // Branch CRUD
  const handleOpenAddSiegeModal = (instituteId) => {
    setSiegeModalMode('add');
    setCurrentSiege({
      id: '',
      name: '',
      city: '',
      address: '',
      phone: '',
      email: '',
      googleMapsLink: '',
      lat: '36.7511',
      lng: '5.0567',
      parentInstituteId: instituteId
    });
    setShowSiegeModal(true);
  };

  const handleOpenEditSiegeModal = (siege, instituteId) => {
    setSiegeModalMode('edit');
    setCurrentSiege({
      ...siege,
      parentInstituteId: instituteId
    });
    setShowSiegeModal(true);
  };

  const handleSiegeInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentSiege(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'googleMapsLink') {
        const parsed = extractCoordsFromGmaps(value);
        if (parsed) {
          updated.lat = parsed.lat;
          updated.lng = parsed.lng;
        }
      }
      return updated;
    });
  };

  const handleSaveSiege = async (e) => {
    e.preventDefault();
    const instId = currentSiege.parentInstituteId;
    const parentCampus = campuses.find(c => c.id === instId);
    if (!parentCampus) return;

    let updatedSieges = [...(parentCampus.sieges || [])];
    if (siegeModalMode === 'add') {
      const newSiege = {
        id: Date.now(),
        name: currentSiege.name,
        city: currentSiege.city,
        address: currentSiege.address,
        phone: currentSiege.phone,
        email: currentSiege.email,
        googleMapsLink: currentSiege.googleMapsLink,
        lat: currentSiege.lat,
        lng: currentSiege.lng
      };
      updatedSieges = [...updatedSieges, newSiege];
    } else {
      updatedSieges = updatedSieges.map(s => s.id === currentSiege.id ? {
        ...s,
        name: currentSiege.name,
        city: currentSiege.city,
        address: currentSiege.address,
        phone: currentSiege.phone,
        email: currentSiege.email,
        googleMapsLink: currentSiege.googleMapsLink,
        lat: currentSiege.lat,
        lng: currentSiege.lng
      } : s);
    }

    const updatedCampus = { ...parentCampus, sieges: updatedSieges };
    try {
      const res = await fetch(`/campuses/${instId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedCampus)
      });
      if (res.ok) {
        const savedCampus = await res.json();
        setCampuses(campuses.map(c => c.id === instId ? savedCampus : c));
      }
    } catch (err) {
      console.error(err);
      const updatedCampuses = campuses.map(inst => inst.id === instId ? updatedCampus : inst);
      setCampuses(updatedCampuses);
      localStorage.setItem('insim_campuses', JSON.stringify(updatedCampuses));
    }
    setShowSiegeModal(false);
  };

  const handleDeleteSiege = (siegeId, instituteId) => {
    requestConfirm(
      'Voulez-vous vraiment supprimer ce siège ?',
      async () => {
        const parentCampus = campuses.find(c => c.id === instituteId);
        if (!parentCampus) return;

        const updatedCampus = {
          ...parentCampus,
          sieges: (parentCampus.sieges || []).filter(s => s.id !== siegeId)
        };

        try {
          const res = await fetch(`/campuses/${instituteId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedCampus)
          });
          if (res.ok) {
            const savedCampus = await res.json();
            setCampuses(campuses.map(c => c.id === instituteId ? savedCampus : c));
            showToast('Siège supprimé avec succès !');
          }
        } catch (err) {
          console.error(err);
          const updatedCampuses = campuses.map(inst => inst.id === instituteId ? updatedCampus : inst);
          setCampuses(updatedCampuses);
          localStorage.setItem('insim_campuses', JSON.stringify(updatedCampuses));
          showToast('Siège supprimé localement !');
        }
      }
    );
  };

  // Settings Save
  const handleSettingsInputChange = (e) => {
    const { name, value } = e.target;
    setContactSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    const cleanPhones = phonesList.map(s => s.trim()).filter(Boolean).join(', ');
    const cleanMobiles = mobilesList.map(s => s.trim()).filter(Boolean).join(', ');
    const cleanEmails = emailsList.map(s => s.trim()).filter(Boolean).join(', ');
    const cleanAddresses = addressesList.map(s => s.trim()).filter(Boolean).join(' | ');

    const payload = {
      ...contactSettings,
      phone: cleanPhones,
      mobile: cleanMobiles,
      email: cleanEmails,
      address: cleanAddresses,
      twitter: ''
    };

    try {
      const res = await fetch('/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const savedSettings = await res.json();
        setContactSettings(savedSettings);
        showToast('Configuration du site web sauvegardée !');
      }
    } catch (err) {
      console.error(err);
      localStorage.setItem('insim_settings', JSON.stringify(payload));
      setContactSettings(payload);
      showToast('Configuration sauvegardée localement (LocalStorage) !');
    }
  };

  // Inbox delete
  const handleDeleteMessage = (id) => {
    requestConfirm(
      'Supprimer ce message ?',
      async () => {
        try {
          const res = await fetch(`/messages/${id}`, {
            method: 'DELETE'
          });
          if (res.status === 204 || res.ok) {
            setInboxMessages(inboxMessages.filter(m => m.id !== id));
            showToast('Message supprimé !');
          }
        } catch (err) {
          console.error(err);
          const updated = inboxMessages.filter(m => m.id !== id);
          setInboxMessages(updated);
          localStorage.setItem('insim_messages', JSON.stringify(updated));
          showToast('Message supprimé localement !');
        }
      }
    );
  };

  // Stats calculation
  const getFiliereStats = () => {
    const stats = { 'hotellerie-tourisme': 0, 'sciences-gestion': 0, 'informatique-numerique': 0 };
    leads.forEach(lead => {
      const form = formations.find(f => f.id === lead.formationId);
      if (form) {
        stats[form.filiereId] = (stats[form.filiereId] || 0) + 1;
      }
    });
    return stats;
  };

  const filiereStats = getFiliereStats();

  const getMostPopularFormation = () => {
    // Combine: brochure downloads (leads) + page views (formationViews)
    const counts = {};
    leads.forEach(l => {
      if (l.formationTitle) counts[l.formationTitle] = (counts[l.formationTitle] || 0) + 2; // leads count double
    });
    formationViews.forEach(fv => {
      const form = formations.find(f => f.id === fv.formationId);
      const title = form ? form.title : fv.formationId;
      counts[title] = (counts[title] || 0) + fv.views;
    });
    let maxTitle = 'Aucune';
    let maxVal = 0;
    Object.keys(counts).forEach(title => {
      if (counts[title] > maxVal) { maxVal = counts[title]; maxTitle = title; }
    });
    // For display: find real lead count
    const leadCount = leads.filter(l => l.formationTitle === maxTitle).length;
    return { title: maxTitle, count: leadCount };
  };

  const topFormation = getMostPopularFormation();

  const getPageName = (path) => {
    if (path === '/') return 'Accueil (Facade)';
    if (path === '/formations') return 'Catalogue des formations';
    if (path === '/a-propos') return 'À propos de l\'institut';
    if (path === '/contact') return 'Contact & Localisation';
    if (path === '/preinscription') return 'Formulaire de préinscription';
    if (path === '/admin') return 'Administration (Console)';
    if (path.startsWith('/formations/')) {
      const slug = path.split('/')[2];
      const form = formations.find(f => f.id === slug);
      return `Détails formation : ${form ? form.title : slug}`;
    }
    return path;
  };

  const sortedVisits = Object.entries(pageVisits).sort((a, b) => b[1] - a[1]);

  const getDailyActivityStats = () => {
    const labels = [];
    const dateObjects = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      labels.push(d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' }));
      dateObjects.push(d);
    }

    const leadCounts = Array(7).fill(0);
    const regCounts = Array(7).fill(0);

    leads.forEach(lead => {
      const leadDate = new Date(lead.createdAt); // use createdAt from SQLite
      dateObjects.forEach((dateObj, idx) => {
        if (leadDate.toDateString() === dateObj.toDateString()) {
          leadCounts[idx]++;
        }
      });
    });

    registrations.forEach(reg => {
      const regDate = new Date(reg.createdAt); // use createdAt from SQLite
      dateObjects.forEach((dateObj, idx) => {
        if (regDate.toDateString() === dateObj.toDateString()) {
          regCounts[idx]++;
        }
      });
    });

    return { labels, leadCounts, regCounts };
  };

  const dailyStats = getDailyActivityStats();

  const renderWeeklyActivityChart = () => {
    const { labels, leadCounts, regCounts } = dailyStats;
    const maxVal = Math.max(...leadCounts, ...regCounts, 5);
    const height = 180;
    const width = 450;
    const paddingLeft = 30;
    const paddingBottom = 25;
    const chartHeight = height - paddingBottom;
    const chartWidth = width - paddingLeft;
    const gridLines = 5;
    
    return (
      <svg viewBox={`0 0 ${width} ${height}`} style={{ width: '100%', height: 'auto', maxHeight: '180px' }}>
        <defs>
          <linearGradient id="leadGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00407d" />
            <stop offset="100%" stopColor="#002a56" />
          </linearGradient>
          <linearGradient id="regGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff7a2d" />
            <stop offset="100%" stopColor="#a04100" />
          </linearGradient>
        </defs>

        {Array.from({ length: gridLines }).map((_, i) => {
          const y = chartHeight - (i * chartHeight) / (gridLines - 1);
          const val = Math.round((i * maxVal) / (gridLines - 1));
          return (
            <g key={i}>
              <line x1={paddingLeft} y1={y} x2={width} y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />
              <text x={paddingLeft - 5} y={y + 4} fontSize="9" textAnchor="end" fill="#94a3b8">{val}</text>
            </g>
          );
        })}

        {labels.map((label, idx) => {
          const colWidth = chartWidth / 7;
          const xCenter = paddingLeft + idx * colWidth + colWidth / 2;
          const leadBarHeight = (leadCounts[idx] / maxVal) * (chartHeight - 10);
          const regBarHeight = (regCounts[idx] / maxVal) * (chartHeight - 10);
          const barWidth = Math.max(10, colWidth / 4.5);
          
          return (
            <g key={idx}>
              <rect x={xCenter - barWidth - 2} y={chartHeight - leadBarHeight} width={barWidth} height={leadBarHeight} fill="url(#leadGrad)" rx="2" />
              <rect x={xCenter + 2} y={chartHeight - regBarHeight} width={barWidth} height={regBarHeight} fill="url(#regGrad)" rx="2" />
              <text x={xCenter} y={height - 5} fontSize="9" textAnchor="middle" fill="#94a3b8">{label}</text>
            </g>
          );
        })}
        <line x1={paddingLeft} y1={chartHeight} x2={width} y2={chartHeight} stroke="#cbd5e1" strokeWidth="1" />
      </svg>
    );
  };

  const renderDonutChart = () => {
    const data = sortedVisits.slice(0, 4);
    const total = data.reduce((sum, item) => sum + item[1], 0);
    let cumulativePercent = 0;
    const colors = ['#002a56', '#a04100', '#10b981', '#6366f1'];
    
    const getCoordinatesForPercent = (percent) => {
      const x = Math.cos(2 * Math.PI * percent);
      const y = Math.sin(2 * Math.PI * percent);
      return [x, y];
    };

    return (
      <div className="admin-donut-container">
        <svg viewBox="-1.2 -1.2 2.4 2.4" style={{ width: '110px', height: '110px', transform: 'rotate(-90deg)', flexShrink: 0 }}>
          {total === 0 ? (
            <circle cx="0" cy="0" r="1" fill="#f1f5f9" />
          ) : (
            data.map((item, idx) => {
              const percent = item[1] / total;
              const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
              cumulativePercent += percent;
              const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
              const largeArcFlag = percent > 0.5 ? 1 : 0;
              const pathData = [
                `M ${startX} ${startY}`,
                `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
                `L 0 0`
              ].join(' ');
              
              return (
                <path key={idx} d={pathData} fill={colors[idx % colors.length]} />
              );
            })
          )}
          <circle cx="0" cy="0" r="0.6" fill="#ffffff" />
        </svg>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', textAlign: 'left' }}>
          {data.map((item, idx) => {
            const percent = total > 0 ? ((item[1] / total) * 100).toFixed(0) : 0;
            return (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                <span style={{ width: '8px', height: '8px', backgroundColor: colors[idx % colors.length], borderRadius: '50%' }}></span>
                <span style={{ fontWeight: '600', whiteSpace: 'nowrap' }}>{getPageName(item[0]).substring(0, 18)}...</span>
                <span style={{ color: 'var(--text-muted)' }}>{percent}%</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderCurriculumEditor = () => {
    if (!selectedFormationForCurriculum) return null;
    
    return (
      <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', textAlign: 'left' }}>
        <div className="admin-curriculum-header">
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--accent)', textTransform: 'uppercase' }}>Configuration du Programme</span>
            <h2 style={{ margin: 0, fontSize: '1.75rem', color: 'var(--primary)' }}>{selectedFormationForCurriculum.title}</h2>
          </div>
          <button onClick={handleCloseCurriculumEditor} className="btn btn-secondary">
            Retour
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* List of semesters */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(selectedFormationForCurriculum.semesters || []).map((sem) => (
              <SemesterEditorRow 
                key={sem.number}
                semester={sem}
                onAddModule={(moduleName) => handleAddModuleToSemester(sem.number, moduleName)}
                onRemoveModule={(moduleIdx) => handleRemoveModuleFromSemester(sem.number, moduleIdx)}
                onRemoveSemester={() => handleRemoveSemester(sem.number)}
              />
            ))}
          </div>

          {/* Add Semester Button */}
          <button 
            type="button" 
            onClick={handleAddSemester}
            className="btn btn-secondary" 
            style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={16} /> Ajouter un Semestre
          </button>

          {/* Action Buttons */}
          <div className="admin-curriculum-actions">
            <button type="button" onClick={handleCloseCurriculumEditor} className="btn btn-secondary">
              Annuler
            </button>
            <button type="button" onClick={handleSaveCurriculum} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Save size={16} /> Enregistrer le Programme
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (!isAuthenticated) {
    return (
      <div className="section" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--bg)' }}>
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '2.5rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', marginBottom: '1.5rem' }}>
            <Lock size={32} />
          </div>
          <h3 style={{ marginBottom: '0.5rem', fontFamily: 'var(--font-heading)' }}>Administration INSIM</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '2rem' }}>
            Identifiants requis pour accéder à la console de gestion.
          </p>

          {loginError && (
            <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fca5a5', color: '#991b1b', padding: '0.75rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', marginBottom: '1.5rem', textAlign: 'left' }}>
              {loginError}
            </div>
          )}

          <form onSubmit={handleLoginSubmit}>
            <div className="form-group" style={{ textAlign: 'left' }}>
              <label htmlFor="username">Identifiant *</label>
              <input 
                type="text" id="username" name="username" required className="form-control" 
                placeholder="Ex: admin" value={loginData.username} onChange={handleLoginChange} 
              />
            </div>
            <div className="form-group" style={{ marginBottom: '2rem', textAlign: 'left' }}>
              <label htmlFor="password">Mot de passe *</label>
              <input 
                type="password" id="password" name="password" required className="form-control" 
                placeholder="Ex: admin" value={loginData.password} onChange={handleLoginChange} 
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Se connecter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-layout-wrapper">
      {/* Admin Mobile Header */}
      <header className="admin-mobile-header">
        <button 
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)} 
          className="admin-sidebar-toggle"
        >
          {mobileSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <div className="admin-mobile-title">
          <img src="/logo.png" alt="Logo" style={{ height: '1.5rem', width: 'auto' }} />
          <span>Console Admin</span>
        </div>
      </header>

      {/* Sidebar Backdrop Overlay on Mobile */}
      {mobileSidebarOpen && (
        <div 
          onClick={() => setMobileSidebarOpen(false)} 
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            backdropFilter: 'blur(2px)',
            zIndex: 130
          }}
        />
      )}

      <div className="admin-container" style={{ minHeight: '100vh' }}>
        {/* Admin Sidebar */}
        <div className={`admin-sidebar ${mobileSidebarOpen ? 'open' : ''}`}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <img src="/logo.png" alt="Logo" style={{ height: '2rem', width: 'auto' }} />
              <span style={{ fontWeight: '800', color: 'var(--primary)', fontSize: '1.2rem', letterSpacing: '-0.02em' }}>Console Admin</span>
            </div>
            <button 
              onClick={() => setMobileSidebarOpen(false)}
              className="admin-sidebar-close-btn"
              style={{ display: 'none', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.25rem' }}
            >
              <X size={20} />
            </button>
          </div>
          
          <button 
            onClick={() => { setActiveTab('stats'); setMobileSidebarOpen(false); }}
            className={`admin-nav-link btn ${activeTab === 'stats' ? 'active' : 'btn-secondary'}`}
            style={{ border: 'none', justifyContent: 'flex-start', width: '100%' }}
          >
            <LayoutDashboard size={18} /> Statistiques
          </button>

          <button 
            onClick={() => { setActiveTab('formations'); setMobileSidebarOpen(false); }}
            className={`admin-nav-link btn ${activeTab === 'formations' ? 'active' : 'btn-secondary'}`}
            style={{ border: 'none', justifyContent: 'flex-start', width: '100%' }}
          >
            <GraduationCap size={18} /> Formations (CMS)
          </button>

          <button 
            onClick={() => { setActiveTab('leads'); setMobileSidebarOpen(false); }}
            className={`admin-nav-link btn ${activeTab === 'leads' ? 'active' : 'btn-secondary'}`}
            style={{ border: 'none', justifyContent: 'flex-start', width: '100%' }}
          >
            <Users size={18} /> Prospects (Leads)
          </button>

          <button 
            onClick={() => { setActiveTab('registrations'); setMobileSidebarOpen(false); }}
            className={`admin-nav-link btn ${activeTab === 'registrations' ? 'active' : 'btn-secondary'}`}
            style={{ border: 'none', justifyContent: 'flex-start', width: '100%' }}
          >
            <Plus size={18} /> Préinscriptions
          </button>

          <button 
            onClick={() => { setActiveTab('inbox'); setMobileSidebarOpen(false); }}
            className={`admin-nav-link btn ${activeTab === 'inbox' ? 'active' : 'btn-secondary'}`}
            style={{ border: 'none', justifyContent: 'flex-start', width: '100%' }}
          >
            <Mail size={18} /> Boîte de réception
          </button>

          <button 
            onClick={() => { setActiveTab('settings'); setMobileSidebarOpen(false); }}
            className={`admin-nav-link btn ${activeTab === 'settings' ? 'active' : 'btn-secondary'}`}
            style={{ border: 'none', justifyContent: 'flex-start', width: '100%' }}
          >
            <Settings size={18} /> Configuration du Site
          </button>

          <button 
            onClick={() => { setActiveTab('institutes'); setMobileSidebarOpen(false); }}
            className={`admin-nav-link btn ${activeTab === 'institutes' ? 'active' : 'btn-secondary'}`}
            style={{ border: 'none', justifyContent: 'flex-start', width: '100%' }}
          >
            <Globe size={18} /> Contact des Instituts
          </button>

          <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
            <button 
              onClick={handleLogout}
              className="btn btn-secondary"
              style={{ width: '100%', gap: '0.5rem', color: '#dc2626', borderColor: '#fee2e2' }}
            >
              <LogOut size={16} /> Déconnexion
            </button>
          </div>
        </div>

      {/* Admin Content */}
      <div className="admin-content">
        {/* TAB 1: STATS */}
        {activeTab === 'stats' && (
          <div>
            <h2>Console d'Administration</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Mesure d'activité globale du site et prospects en temps réel.
            </p>

            {/* BENTO GRID */}
            <div className="bento-grid">
              <div className="bento-card bento-col-1 bento-row-1" style={{ justifyContent: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Brochures</span>
                <h3 style={{ fontSize: '2.5rem', color: 'var(--primary)', fontWeight: '800', margin: '0.25rem 0' }}>{leads.length}</h3>
                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 'bold' }}>+ Téléchargements</span>
              </div>

              <div className="bento-card bento-col-1 bento-row-1" style={{ justifyContent: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Préinscriptions</span>
                <h3 style={{ fontSize: '2.5rem', color: 'var(--accent)', fontWeight: '800', margin: '0.25rem 0' }}>{registrations.length}</h3>
                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 'bold' }}>+ Dossiers en ligne</span>
              </div>

              <div className="bento-card bento-col-2 bento-row-1" style={{ justifyContent: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Spécialité la plus demandée</span>
                <h4 style={{ fontSize: '1.15rem', color: 'var(--text-heading)', fontWeight: '700', marginTop: '0.5rem', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={topFormation.title}>
                  {topFormation.title}
                </h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                  ({topFormation.count} prospects capturés)
                </span>
              </div>

              <div className="bento-card bento-col-2 bento-row-2">
                <h3 style={{ fontSize: '1.05rem', marginBottom: '1.25rem', fontWeight: '700' }}>Activité Hebdomadaire</h3>
                {renderWeeklyActivityChart()}
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem' }}>
                    <span style={{ width: '10px', height: '10px', backgroundColor: '#00407d', borderRadius: '3px' }}></span>
                    <span>Brochures</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem' }}>
                    <span style={{ width: '10px', height: '10px', backgroundColor: '#ff7a2d', borderRadius: '3px' }}></span>
                    <span>Préinscriptions</span>
                  </div>
                </div>
              </div>

              <div className="bento-card bento-col-2 bento-row-2">
                <h3 style={{ fontSize: '1.05rem', marginBottom: '1.25rem', fontWeight: '700' }}>Visites de pages (Top 4)</h3>
                {renderDonutChart()}
              </div>

              <div className="bento-card bento-col-2 bento-row-2">
                <h3 style={{ fontSize: '1.05rem', marginBottom: '1rem', fontWeight: '700' }}>Pages populaires</h3>
                <div style={{ overflowY: 'auto', flex: 1, maxHeight: '180px' }}>
                  <table className="admin-table" style={{ width: '100%', fontSize: '0.8rem' }}>
                    <thead>
                      <tr>
                        <th style={{ padding: '0.5rem' }}>Page</th>
                        <th style={{ padding: '0.5rem', textAlign: 'right' }}>Visites</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedVisits.map(([path, count]) => (
                        <tr key={path}>
                          <td style={{ padding: '0.5rem', fontWeight: '600' }}>{getPageName(path).substring(0, 25)}</td>
                          <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 'bold' }}>{count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bento-card bento-col-2 bento-row-2">
                <h3 style={{ fontSize: '1.05rem', marginBottom: '1rem', fontWeight: '700' }}>Formations les plus consultées</h3>
                {formationViews.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', margin: 'auto 0' }}>
                    Aucune vue enregistrée. Les consultations s'accumuleront en temps réel.
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, overflowY: 'auto' }}>
                    {formationViews.slice(0, 5).map((fv, idx) => {
                      const form = formations.find(f => f.id === fv.formationId);
                      const title = form ? form.title : fv.formationId;
                      const maxViews = formationViews[0]?.views || 1;
                      const pct = Math.round((fv.views / maxViews) * 100);
                      return (
                        <div key={fv.formationId}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '0.2rem' }}>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '75%' }}>
                              {idx + 1}. {title}
                            </span>
                            <strong>{fv.views} vue{fv.views > 1 ? 's' : ''}</strong>
                          </div>
                          <div style={{ height: '5px', backgroundColor: 'var(--bg)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${pct}%`, height: '100%', backgroundColor: idx === 0 ? 'var(--primary)' : idx === 1 ? 'var(--accent)' : '#10b981', transition: 'width 0.5s ease' }}></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FORMATIONS (CMS) - NESTED BOX IN BOX HIERARCHY */}
        {activeTab === 'formations' && (
          selectedFormationForCurriculum ? (
            renderCurriculumEditor()
          ) : (
            <div>
              <div className="admin-tab-header">
                <div>
                  <h2>Gestion du Catalogue (CMS)</h2>
                  <p style={{ color: 'var(--text-muted)' }}>Configurez la hiérarchie du catalogue d'études : les catégories, puis les filières et enfin les spécialités.</p>
                </div>
                <button onClick={handleOpenAddCategoryModal} className="btn btn-primary" style={{ gap: '0.25rem' }}>
                  <Plus size={16} /> Créer une Catégorie
                </button>
              </div>

              {/* Recursive Accordion Hierarchy */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                {categories.length > 0 ? (
                  categories.map(cat => {
                    const isCatExpanded = expandedCmsCategoryId === cat.id;
                    const catFilieres = filieres.filter(f => f.categoryId === cat.id);
                    
                    return (
                      <div key={cat.id} style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                        
                        {/* Category Box Level 1 Header */}
                        <div 
                          onClick={() => setExpandedCmsCategoryId(isCatExpanded ? null : cat.id)}
                          className="admin-cms-header-row"
                          style={{ padding: '1.25rem 1.5rem', cursor: 'pointer', backgroundColor: isCatExpanded ? 'var(--primary-light)' : 'transparent', transition: 'background-color var(--transition-fast)' }}
                        >
                          <div>
                            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Catégorie (Niveau 1)</span>
                            <h3 style={{ margin: 0, fontSize: '1.25rem', color: 'var(--primary)', fontWeight: '700' }}>{cat.name}</h3>
                          </div>
                          <div className="admin-cms-actions-row" onClick={(e) => e.stopPropagation()}>
                            <button onClick={() => handleOpenAddFiliereForCategory(cat.id)} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', gap: '0.25rem' }}>
                              <Plus size={12} /> Ajouter une Filière
                            </button>
                            <button onClick={() => handleOpenEditCategoryModal(cat)} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>
                              Modifier
                            </button>
                            <button onClick={() => handleDeleteCategory(cat.id)} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', color: '#dc2626', borderColor: '#fee2e2' }}>
                              Supprimer
                            </button>
                            <span style={{ fontSize: '1.1rem', transform: isCatExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform var(--transition-normal)', color: 'var(--text-muted)' }}>▼</span>
                          </div>
                        </div>

                        {/* Category Box Level 1 Body: Contains Filières */}
                        {isCatExpanded && (
                          <div style={{ padding: '1.5rem', backgroundColor: '#fafbfe', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            
                            {catFilieres.length > 0 ? (
                              catFilieres.map(fil => {
                                const isFilExpanded = expandedCmsFiliereId === fil.id;
                                const filFormations = formations.filter(form => form.filiereId === fil.id);
                                
                                return (
                                  <div key={fil.id} style={{ backgroundColor: '#ffffff', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                                    
                                    {/* Filière Box Level 2 Header */}
                                    <div 
                                      onClick={() => setExpandedCmsFiliereId(isFilExpanded ? null : fil.id)}
                                      className="admin-cms-header-row"
                                      style={{ padding: '1rem 1.25rem', cursor: 'pointer', backgroundColor: isFilExpanded ? '#f0f4f9' : 'transparent', transition: 'background-color var(--transition-fast)' }}
                                    >
                                      <div>
                                        <span style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Filière (Niveau 2)</span>
                                        <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--accent)', fontWeight: '700' }}>{fil.name}</h4>
                                      </div>
                                      <div className="admin-cms-actions-row" onClick={(e) => e.stopPropagation()}>
                                        <button onClick={() => handleOpenAddFormationForFiliere(cat.id, fil.id)} className="btn btn-primary" style={{ padding: '0.35rem 0.7rem', fontSize: '0.7rem', gap: '0.2rem', backgroundColor: 'var(--accent)', borderColor: 'var(--accent)' }}>
                                          <Plus size={10} /> Ajouter une Spécialité
                                        </button>
                                        <button onClick={() => handleOpenEditFiliereModal(fil)} className="btn btn-secondary" style={{ padding: '0.35rem 0.7rem', fontSize: '0.7rem' }}>
                                          Modifier
                                        </button>
                                        <button onClick={() => handleDeleteFiliere(fil.id)} className="btn btn-secondary" style={{ padding: '0.35rem 0.7rem', fontSize: '0.7rem', color: '#dc2626', borderColor: '#fee2e2' }}>
                                          Supprimer
                                        </button>
                                        <span style={{ fontSize: '1rem', transform: isFilExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform var(--transition-normal)', color: 'var(--text-muted)' }}>▼</span>
                                      </div>
                                    </div>

                                    {/* Filière Box Level 2 Body: Contains Spécialités */}
                                    {isFilExpanded && (
                                      <div style={{ padding: '1.25rem', backgroundColor: '#fcfdfe', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                        
                                        {filFormations.length > 0 ? (
                                          filFormations.map(form => (
                                            <div key={form.id} className="admin-cms-header-row" style={{ padding: '1rem 1.25rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', backgroundColor: '#ffffff' }}>
                                              <div>
                                                <span style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Spécialité (Niveau 3)</span>
                                                <h5 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-heading)', fontWeight: '600' }}>BTS - {form.title}</h5>
                                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Brochure : {form.brochure || 'Aucune brochure'}</span>
                                              </div>
                                              <div className="admin-cms-actions-row">
                                                <button onClick={() => handleOpenCurriculumEditor(form)} className="btn btn-primary" style={{ padding: '0.35rem 0.7rem', fontSize: '0.7rem', gap: '0.25rem', backgroundColor: '#10b981', borderColor: '#10b981' }}>
                                                  <BookOpen size={12} /> Programme & Semestres
                                                </button>
                                                <button onClick={() => handleOpenEditModal(form)} className="btn btn-secondary" style={{ padding: '0.35rem 0.7rem', fontSize: '0.7rem' }}>
                                                  Modifier
                                                </button>
                                                <button onClick={() => handleDeleteFormation(form.id)} className="btn btn-secondary" style={{ padding: '0.35rem 0.7rem', fontSize: '0.7rem', color: '#dc2626', borderColor: '#fee2e2' }}>
                                                  Supprimer
                                                </button>
                                              </div>
                                            </div>
                                          ))
                                        ) : (
                                          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', margin: '0.5rem 0' }}>
                                            Aucune spécialité créée dans cette filière. Cliquez sur "Ajouter une Spécialité" ci-dessus pour commencer.
                                          </p>
                                        )}

                                      </div>
                                    )}

                                  </div>
                                );
                              })
                            ) : (
                              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic', margin: '0.5rem 0' }}>
                                Aucune filière créée dans cette catégorie. Cliquez sur "Ajouter une Filière" ci-dessus.
                              </p>
                            )}

                          </div>
                        )}

                      </div>
                    );
                  })
                ) : (
                  <div style={{ backgroundColor: 'var(--bg-card)', padding: '3rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Aucune catégorie configurée. Cliquez sur "Créer une Catégorie" pour démarrer le catalogue.
                  </div>
                )}
              </div>
            </div>
          )
        )}

        {/* TAB 3: LEADS */}
        {activeTab === 'leads' && (
          <div>
            <div className="admin-tab-header">
              <div>
                <h2>Prospects (Téléchargement de Brochures)</h2>
              </div>
              <button onClick={() => exportToCSV(leads, 'prospects_brochures')} className="btn btn-secondary" disabled={leads.length === 0}>
                <FileSpreadsheet size={16} /> Exporter CSV
              </button>
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Nom Complet</th>
                    <th>E-mail</th>
                    <th>Téléphone</th>
                    <th>Formation</th>
                  </tr>
                </thead>
                <tbody>
                  {leads.map(lead => (
                    <tr key={lead.id}>
                      <td>{new Date(lead.downloadedAt).toLocaleDateString()}</td>
                      <td style={{ fontWeight: '600' }}>{lead.name}</td>
                      <td>{lead.email}</td>
                      <td>{lead.phone}</td>
                      <td>{lead.formationTitle}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: PREINSCRIPTIONS */}
        {activeTab === 'registrations' && (
          <div>
            <div className="admin-tab-header">
              <div>
                <h2>Préinscriptions en ligne</h2>
              </div>
              <button onClick={() => exportToCSV(registrations, 'candidatures_insim')} className="btn btn-secondary" disabled={registrations.length === 0}>
                <FileSpreadsheet size={16} /> Exporter CSV
              </button>
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Nom Complet</th>
                    <th>Téléphone</th>
                    <th>E-mail</th>
                    <th>Diplôme obtenu</th>
                    <th>Formation souhaitée</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map(reg => (
                    <tr key={reg.id}>
                      <td>{new Date(reg.registeredAt).toLocaleDateString()}</td>
                      <td style={{ fontWeight: '600' }}>{reg.name}</td>
                      <td>{reg.phone}</td>
                      <td>{reg.email}</td>
                      <td>{reg.lastDiploma} ({reg.diplomaSpecialization})</td>
                      <td style={{ color: 'var(--primary)', fontWeight: '500' }}>{reg.formationTitle}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: INBOX */}
        {activeTab === 'inbox' && (
          <div>
            <h2>Boîte de réception E-mails</h2>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Expéditeur</th>
                    <th>E-mail</th>
                    <th>Sujet</th>
                    <th>Message</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {inboxMessages.map(msg => (
                    <tr key={msg.id}>
                      <td>{new Date(msg.id).toLocaleDateString()}</td>
                      <td style={{ fontWeight: '600' }}>{msg.name}</td>
                      <td>{msg.email}</td>
                      <td style={{ fontWeight: '500' }}>{msg.subject}</td>
                      <td style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={msg.message}>
                        {msg.message}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button onClick={() => handleDeleteMessage(msg.id)} className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem', color: '#dc2626', borderColor: '#fee2e2' }}>
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: CONFIGURATION DU SITE */}
        {activeTab === 'settings' && (
          <div className="admin-card-panel">
            <h2>Configuration de l'Institut & Contact (Ce Site Web)</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Configurez les coordonnées de base, liens sociaux et emplacement de l'institut INSIM Bejaia (hôte du site).
            </p>

            <form onSubmit={handleSaveSettings}>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', color: 'var(--primary)', fontFamily: 'var(--font-heading)' }}>
                1. Coordonnées de base (Téléphones & Mobiles)
              </h3>
              
              <div className="form-grid-2">
                {/* Standard Phones List */}
                <div className="form-group">
                  <label>Numéros de Téléphone Standard</label>
                  <div className="settings-dynamic-list">
                    {phonesList.map((ph, idx) => (
                      <div key={idx} className="settings-dynamic-item">
                        <input 
                          type="text" 
                          className="form-control" 
                          value={ph} 
                          placeholder="Ex: +213 (0) 34 12 34 56" 
                          onChange={(e) => handleListChange(phonesList, setPhonesList, idx, e.target.value)} 
                        />
                        {phonesList.length > 1 && (
                          <button 
                            type="button" 
                            className="btn-icon-danger" 
                            onClick={() => handleRemoveListItem(phonesList, setPhonesList, idx)}
                            title="Supprimer ce numéro"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button 
                    type="button" 
                    className="btn-add-item" 
                    onClick={() => handleAddListItem(phonesList, setPhonesList)}
                  >
                    <Plus size={14} /> Ajouter un numéro de téléphone
                  </button>
                </div>

                {/* Mobile Phones List */}
                <div className="form-group">
                  <label>Numéros de Mobile Secrétariat</label>
                  <div className="settings-dynamic-list">
                    {mobilesList.map((mob, idx) => (
                      <div key={idx} className="settings-dynamic-item">
                        <input 
                          type="text" 
                          className="form-control" 
                          value={mob} 
                          placeholder="Ex: +213 (0) 550 123 456" 
                          onChange={(e) => handleListChange(mobilesList, setMobilesList, idx, e.target.value)} 
                        />
                        {mobilesList.length > 1 && (
                          <button 
                            type="button" 
                            className="btn-icon-danger" 
                            onClick={() => handleRemoveListItem(mobilesList, setMobilesList, idx)}
                            title="Supprimer ce mobile"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button 
                    type="button" 
                    className="btn-add-item" 
                    onClick={() => handleAddListItem(mobilesList, setMobilesList)}
                  >
                    <Plus size={14} /> Ajouter un numéro mobile
                  </button>
                </div>
              </div>

              <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', color: 'var(--primary)', marginTop: '2rem', fontFamily: 'var(--font-heading)' }}>
                2. Adresses E-mail & Localisation GPS
              </h3>

              <div className="form-grid-2">
                {/* Emails List */}
                <div className="form-group">
                  <label>Adresses E-mail de Contact</label>
                  <div className="settings-dynamic-list">
                    {emailsList.map((em, idx) => (
                      <div key={idx} className="settings-dynamic-item">
                        <input 
                          type="email" 
                          className="form-control" 
                          value={em} 
                          placeholder="Ex: contact@insimbejaia.com" 
                          onChange={(e) => handleListChange(emailsList, setEmailsList, idx, e.target.value)} 
                        />
                        {emailsList.length > 1 && (
                          <button 
                            type="button" 
                            className="btn-icon-danger" 
                            onClick={() => handleRemoveListItem(emailsList, setEmailsList, idx)}
                            title="Supprimer cette adresse e-mail"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button 
                    type="button" 
                    className="btn-add-item" 
                    onClick={() => handleAddListItem(emailsList, setEmailsList)}
                  >
                    <Plus size={14} /> Ajouter une adresse e-mail
                  </button>
                </div>

                {/* GPS Coordinates */}
                <div className="form-group">
                  <label>Coordonnées GPS du Siège principal</label>
                  <div className="form-grid-2" style={{ gap: '0.5rem', margin: 0, padding: 0 }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Latitude (GPS)</label>
                      <input type="text" name="lat" className="form-control" value={contactSettings.lat} onChange={handleSettingsInputChange} />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Longitude (GPS)</label>
                      <input type="text" name="lng" className="form-control" value={contactSettings.lng} onChange={handleSettingsInputChange} />
                    </div>
                  </div>
                </div>
              </div>

              <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', color: 'var(--primary)', marginTop: '2rem', fontFamily: 'var(--font-heading)' }}>
                3. Adresses Physiques des Campus
              </h3>

              {/* Physical Addresses List */}
              <div className="form-group">
                <label>Adresses Physiques de l'Institut (ex: Campus principal, Annexes...)</label>
                <div className="settings-dynamic-list">
                  {addressesList.map((addr, idx) => (
                    <div key={idx} className="settings-dynamic-item">
                      <input 
                        type="text" 
                        className="form-control" 
                        value={addr} 
                        placeholder="Ex: Cité Ihaddaden (près de la trémie), 06000 Bejaia, Algérie" 
                        onChange={(e) => handleListChange(addressesList, setAddressesList, idx, e.target.value)} 
                      />
                      {addressesList.length > 1 && (
                        <button 
                          type="button" 
                          className="btn-icon-danger" 
                          onClick={() => handleRemoveListItem(addressesList, setAddressesList, idx)}
                          title="Supprimer cette adresse"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button 
                  type="button" 
                  className="btn-add-item" 
                  onClick={() => handleAddListItem(addressesList, setAddressesList)}
                >
                  <Plus size={14} /> Ajouter une adresse physique
                </button>
              </div>

              <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', color: 'var(--primary)', marginTop: '2rem', fontFamily: 'var(--font-heading)' }}>
                4. Réseaux Sociaux
              </h3>
              <div className="form-grid-3">
                <div className="form-group">
                  <label>Page Facebook</label>
                  <input type="text" name="facebook" className="form-control" value={contactSettings.facebook || ''} onChange={handleSettingsInputChange} />
                </div>
                <div className="form-group">
                  <label>Lien Instagram</label>
                  <input type="text" name="instagram" className="form-control" value={contactSettings.instagram || ''} onChange={handleSettingsInputChange} />
                </div>
                <div className="form-group">
                  <label>Lien LinkedIn</label>
                  <input type="text" name="linkedin" className="form-control" value={contactSettings.linkedin || ''} onChange={handleSettingsInputChange} />
                </div>
              </div>

              <h3 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', color: 'var(--primary)', marginTop: '2rem', fontFamily: 'var(--font-heading)' }}>
                5. Intégration Pixel Meta
              </h3>
              
              <div style={{ backgroundColor: 'var(--bg)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                <h4 style={{ margin: '0 0 1rem 0', color: 'var(--primary)', fontSize: '1rem', fontWeight: '700' }}>Pixel Meta (Facebook) & API de Conversions</h4>
                <div className="form-grid-2">
                  <div className="form-group">
                    <label>ID du Pixel Meta (Facebook)</label>
                    <input type="text" name="metaPixelId" className="form-control" value={contactSettings.metaPixelId || ''} onChange={handleSettingsInputChange} placeholder="Ex: 123456789012345" />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label>Token d'accès API Conversions Meta (CAPI)</label>
                    <input type="text" name="metaAccessToken" className="form-control" value={contactSettings.metaAccessToken || ''} onChange={handleSettingsInputChange} placeholder="EAAG..." />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-accent" style={{ marginTop: '2.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Save size={18} /> Sauvegarder la configuration
              </button>
            </form>
          </div>
        )}

        {activeTab === 'institutes' && (
          <div>
            <div className="admin-tab-header">
              <div>
                <h2>Contact des Instituts du Groupe</h2>
                <p style={{ color: 'var(--text-muted)' }}>Gérez les instituts du groupe INSIM. Cliquez sur un institut pour afficher et gérer ses sièges.</p>
              </div>
              <button onClick={handleOpenAddInstituteModal} className="btn btn-primary" style={{ gap: '0.25rem' }}>
                <Plus size={16} /> Ajouter un Institut
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {campuses.length > 0 ? (
                campuses.map(inst => {
                  const isExpanded = expandedInstituteId === inst.id;
                  return (
                    <div key={inst.id} style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                      
                      {/* Accordion Header */}
                      <div 
                        onClick={() => setExpandedInstituteId(isExpanded ? null : inst.id)}
                        className="admin-cms-header-row"
                        style={{ padding: '1.5rem', cursor: 'pointer', backgroundColor: isExpanded ? 'var(--primary-light)' : 'transparent', transition: 'background-color var(--transition-fast)' }}
                      >
                        <div>
                          <h3 style={{ fontSize: '1.2rem', color: 'var(--primary)', margin: 0, fontFamily: 'var(--font-heading)' }}>{inst.name}</h3>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{inst.sieges ? inst.sieges.length : 0} sièges configurés</span>
                        </div>
                        <div className="admin-cms-actions-row" onClick={(e) => e.stopPropagation()}>
                          <button onClick={() => handleOpenAddSiegeModal(inst.id)} className="btn btn-primary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', gap: '0.25rem' }}>
                            <Plus size={12} /> Ajouter un Siège
                          </button>
                          <button onClick={() => handleOpenEditInstituteModal(inst)} className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                            Modifier
                          </button>
                          <button onClick={() => handleDeleteInstitute(inst.id)} className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', color: '#dc2626', borderColor: '#fee2e2' }}>
                            Supprimer
                          </button>
                          <span style={{ fontSize: '1.2rem', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform var(--transition-normal)', color: 'var(--text-muted)' }}>▼</span>
                        </div>
                      </div>

                      {/* Accordion Body */}
                      {isExpanded && (
                        <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', backgroundColor: '#fafbfe' }}>
                          <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            <span><b>Site Web:</b> <a href={inst.website} target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>{inst.website}</a></span>
                            {inst.facebook && <span><b>Facebook:</b> <a href={inst.facebook} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>{inst.facebook}</a></span>}
                          </div>

                          <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.75rem', letterSpacing: '0.05em', fontWeight: 'bold' }}>Liste des sièges et campus</h4>
                          <div className="table-responsive" style={{ margin: 0, border: '1px solid var(--border)' }}>
                            <table className="admin-table" style={{ fontSize: '0.85rem' }}>
                              <thead>
                                <tr>
                                  <th>Nom du Siège</th>
                                  <th>Ville & Adresse</th>
                                  <th>Contact / Email</th>
                                  <th>Lien Google Maps</th>
                                  <th>GPS (Leaflet)</th>
                                  <th style={{ textAlign: 'right' }}>Actions</th>
                                </tr>
                              </thead>
                              <tbody>
                                {inst.sieges && inst.sieges.length > 0 ? (
                                  inst.sieges.map(siege => (
                                    <tr key={siege.id}>
                                      <td style={{ fontWeight: '600' }}>{siege.name}</td>
                                      <td>
                                        <span style={{ display: 'block', fontWeight: '600', color: 'var(--accent)', fontSize: '0.75rem', textTransform: 'uppercase' }}>{siege.city}</span>
                                        <span>{siege.address}</span>
                                      </td>
                                      <td>
                                        <span style={{ display: 'block', fontWeight: '500' }}>{siege.phone}</span>
                                        <span style={{ color: 'var(--text-muted)' }}>{siege.email || '-'}</span>
                                      </td>
                                      <td style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {siege.googleMapsLink ? (
                                          <a href={siege.googleMapsLink} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'underline' }}>
                                            Voir le lien
                                          </a>
                                        ) : 'Non assigné'}
                                      </td>
                                      <td style={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                                        {siege.lat && siege.lng ? `${parseFloat(siege.lat).toFixed(4)}, ${parseFloat(siege.lng).toFixed(4)}` : 'Non résolu'}
                                      </td>
                                      <td style={{ textAlign: 'right' }}>
                                        <div style={{ display: 'inline-flex', gap: '0.4rem' }}>
                                          <button onClick={() => handleOpenEditSiegeModal(siege, inst.id)} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}>
                                            Modifier
                                          </button>
                                          <button onClick={() => handleDeleteSiege(siege.id, inst.id)} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem', fontSize: '0.7rem', color: '#dc2626', borderColor: '#fee2e2' }}>
                                            Supprimer
                                          </button>
                                        </div>
                                      </td>
                                    </tr>
                                  ))
                                ) : (
                                  <tr>
                                    <td colSpan="6" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '1.5rem', fontStyle: 'italic' }}>
                                      Aucun siège configuré.
                                    </td>
                                  </tr>
                                )}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div style={{ backgroundColor: 'var(--bg-card)', padding: '3rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', textAlign: 'center', color: 'var(--text-muted)' }}>
                  Aucun institut du groupe créé.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* FORMATIONS ADD / EDIT MODAL */}
      {showFormModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <h3 style={{ fontSize: '1.35rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', color: 'var(--primary)' }}>
              {modalMode === 'add' ? 'Ajouter une Spécialité' : 'Modifier la Spécialité'}
            </h3>
            <form onSubmit={handleSaveFormation}>
              <div className="form-group">
                <label>Intitulé de la formation / spécialité *</label>
                <input type="text" name="title" required className="form-control" value={currentFormation.title} onChange={handleModalInputChange} />
              </div>
              <div className="form-grid-2" style={{ marginTop: '1rem' }}>
                <div className="form-group">
                  <label>Catégorie *</label>
                  <select name="categoryId" required className="form-control" value={currentFormation.categoryId} onChange={handleModalInputChange}>
                    <option value="">Sélectionnez une catégorie</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Filière (Domaine) *</label>
                  <select name="filiereId" required className="form-control" value={currentFormation.filiereId} onChange={handleModalInputChange}>
                    <option value="">Sélectionnez une filière</option>
                    {filieres.filter(f => f.categoryId === currentFormation.categoryId).map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-grid-2" style={{ marginTop: '1rem' }}>
                <div className="form-group">
                  <label>Durée de la formation *</label>
                  <input type="text" name="duration" required className="form-control" value={currentFormation.duration} onChange={handleModalInputChange} placeholder="Ex: 30 mois, 2 ans, 6 mois..." />
                </div>
                <div className="form-group">
                  <label>Fichier PDF Brochure</label>
                  {/* Show current brochure as downloadable link */}
                  {currentFormation.brochure && !brochureFile && (
                    <div style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 0.75rem', backgroundColor: 'var(--primary-light)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', fontSize: '0.82rem' }}>
                      <span style={{ color: '#10b981', fontWeight: '700' }}>✓</span>
                      <span style={{ color: 'var(--text-muted)', flex: 1 }}>Brochure actuelle :</span>
                      <a
                        href={`${(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/$/, '')}${currentFormation.brochure}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: 'var(--primary)', textDecoration: 'underline', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '180px' }}
                      >
                        {currentFormation.brochure.split('/').pop()}
                      </a>
                    </div>
                  )}
                  {/* File upload input */}
                  <label
                    htmlFor="brochure-upload"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: '0.65rem 1rem',
                      border: '2px dashed var(--border)',
                      borderRadius: 'var(--radius-sm)',
                      cursor: 'pointer',
                      backgroundColor: brochureFile ? 'rgba(16,185,129,0.07)' : 'var(--bg)',
                      borderColor: brochureFile ? '#10b981' : 'var(--border)',
                      transition: 'all 0.2s',
                      fontSize: '0.85rem',
                      color: brochureFile ? '#10b981' : 'var(--text-muted)'
                    }}
                  >
                    <span style={{ fontSize: '1.2rem' }}>📄</span>
                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {brochureFile ? brochureFile.name : 'Cliquez pour choisir un fichier PDF...'}
                    </span>
                    {brochureFile && (
                      <button
                        type="button"
                        onClick={(e) => { e.preventDefault(); setBrochureFile(null); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '1rem', lineHeight: 1 }}
                        title="Retirer le fichier"
                      >✕</button>
                    )}
                  </label>
                  <input
                    id="brochure-upload"
                    type="file"
                    accept=".pdf,application/pdf"
                    style={{ display: 'none' }}
                    onChange={(e) => setBrochureFile(e.target.files[0] || null)}
                  />
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' }}>
                    Format PDF uniquement · 20 Mo max
                  </span>
                </div>
              </div>
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label>Description globale *</label>
                <textarea name="description" required className="form-control" rows="3" value={currentFormation.description} onChange={handleModalInputChange}></textarea>
              </div>
              <div className="form-group" style={{ marginTop: '1rem' }}>
                <label>Objectifs de la formation (Un par ligne) *</label>
                <textarea name="objectivesText" required className="form-control" rows="5" value={currentFormation.objectivesText} onChange={handleModalInputChange}></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowFormModal(false)} className="btn btn-secondary">Annuler</button>
                <button type="submit" className="btn btn-primary">{modalMode === 'add' ? 'Créer la formation' : 'Enregistrer'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY ADD / EDIT MODAL */}
      {showCategoryModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', color: 'var(--primary)' }}>
              {categoryModalMode === 'add' ? 'Créer une Catégorie' : 'Modifier la Catégorie'}
            </h3>
            <form onSubmit={handleSaveCategory}>
              <div className="form-group">
                <label>Nom de la catégorie *</label>
                <input type="text" name="name" required className="form-control" value={currentCategory.name} onChange={handleCategoryInputChange} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowCategoryModal(false)} className="btn btn-secondary">Annuler</button>
                <button type="submit" className="btn btn-primary">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FILIERE ADD / EDIT MODAL */}
      {showFiliereModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '450px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', color: 'var(--primary)' }}>
              {filiereModalMode === 'add' ? 'Créer une Filière' : 'Modifier la Filière'}
            </h3>
            <form onSubmit={handleSaveFiliere}>
              <div className="form-group">
                <label>Nom de la filière *</label>
                <input type="text" name="name" required className="form-control" value={currentFiliere.name} onChange={handleFiliereInputChange} />
              </div>
              <div className="form-group" style={{ marginTop: '0.75rem' }}>
                <label>Catégorie *</label>
                <select name="categoryId" required className="form-control" value={currentFiliere.categoryId} onChange={handleFiliereInputChange}>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowFiliereModal(false)} className="btn btn-secondary">Annuler</button>
                <button type="submit" className="btn btn-primary">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INSTITUTE ADD / EDIT MODAL */}
      {showInstituteModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '450px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', color: 'var(--primary)' }}>
              {instituteModalMode === 'add' ? 'Créer un Institut du groupe' : 'Modifier l\'Institut'}
            </h3>
            <form onSubmit={handleSaveInstitute}>
              <div className="form-group">
                <label>Nom de l'institut *</label>
                <input type="text" required className="form-control" value={currentInstitute.name} onChange={(e) => setCurrentInstitute(prev => ({ ...prev, name: e.target.value }))} />
              </div>
              <div className="form-group" style={{ marginTop: '0.75rem' }}>
                <label>Site Web officiel *</label>
                <input type="url" required className="form-control" value={currentInstitute.website} onChange={(e) => setCurrentInstitute(prev => ({ ...prev, website: e.target.value }))} />
              </div>
              <div className="form-group" style={{ marginTop: '0.75rem' }}>
                <label>Lien Facebook</label>
                <input type="url" className="form-control" value={currentInstitute.facebook} onChange={(e) => setCurrentInstitute(prev => ({ ...prev, facebook: e.target.value }))} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="button" onClick={() => setShowInstituteModal(false)} className="btn btn-secondary">Annuler</button>
                <button type="submit" className="btn btn-primary">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SIEGE ADD / EDIT MODAL */}
      {showSiegeModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '550px' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', color: 'var(--primary)' }}>
              {siegeModalMode === 'add' ? 'Ajouter un Siège' : 'Modifier le Siège'}
            </h3>
            <form onSubmit={handleSaveSiege}>
              <div className="form-grid-2">
                <div className="form-group">
                  <label>Nom du siège *</label>
                  <input type="text" required className="form-control" name="name" value={currentSiege.name} onChange={handleSiegeInputChange} />
                </div>
                <div className="form-group">
                  <label>Ville *</label>
                  <input type="text" required className="form-control" name="city" value={currentSiege.city} onChange={handleSiegeInputChange} />
                </div>
              </div>

              <div className="form-group" style={{ marginTop: '0.75rem' }}>
                <label>Adresse complète *</label>
                <input type="text" required className="form-control" name="address" value={currentSiege.address} onChange={handleSiegeInputChange} />
              </div>

              <div className="form-grid-2" style={{ marginTop: '0.75rem' }}>
                <div className="form-group">
                  <label>Téléphone *</label>
                  <input type="text" required className="form-control" name="phone" value={currentSiege.phone} onChange={handleSiegeInputChange} />
                </div>
                <div className="form-group">
                  <label>Email de contact</label>
                  <input type="email" className="form-control" name="email" value={currentSiege.email} onChange={handleSiegeInputChange} />
                </div>
              </div>

              {/* Google Maps Link Coordinate Assigner */}
              <div className="form-group" style={{ marginTop: '0.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <LinkIcon size={14} /> Lien Google Maps *
                </label>
                <input 
                  type="url" 
                  required 
                  className="form-control" 
                  name="googleMapsLink" 
                  value={currentSiege.googleMapsLink} 
                  onChange={handleSiegeInputChange}
                  placeholder="Collez le lien Google Maps du siège pour extraire ses coordonnées..."
                />
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Ex: https://www.google.com/maps/place/36.7431,3.0298
                </span>
              </div>

              <div className="form-grid-2" style={{ marginTop: '0.75rem', backgroundColor: 'var(--primary-light)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)' }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Latitude extraite (Lecture seule)</label>
                  <input type="text" readOnly className="form-control" name="lat" value={currentSiege.lat} style={{ backgroundColor: '#ffffff', cursor: 'not-allowed' }} />
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label>Longitude extraite (Lecture seule)</label>
                  <input type="text" readOnly className="form-control" name="lng" value={currentSiege.lng} style={{ backgroundColor: '#ffffff', cursor: 'not-allowed' }} />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.25rem' }}>
                <button type="button" onClick={() => setShowSiegeModal(false)} className="btn btn-secondary">Annuler</button>
                <button type="submit" className="btn btn-primary">Enregistrer</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Toast Overlay */}
      {toast && (
        <div className="toast-container">
          <div className={`custom-toast toast-${toast.type}`}>
            <span style={{ flexGrow: 1 }}>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal Overlay */}
      {confirmModal && (
        <div className="confirm-modal-overlay">
          <div className="confirm-modal-content">
            <div className="confirm-modal-title">Confirmation requise</div>
            <div className="confirm-modal-message">{confirmModal.message}</div>
            <div className="confirm-modal-actions">
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={confirmModal.onCancel}
              >
                Annuler
              </button>
              <button 
                type="button" 
                className="btn btn-primary" 
                onClick={confirmModal.onConfirm}
                style={{ backgroundColor: '#dc2626', borderColor: '#dc2626', color: '#ffffff' }}
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
  );
}

export default AdminDashboard;
