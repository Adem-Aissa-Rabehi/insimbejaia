import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Global fetch interceptor to rewrite relative API requests to VITE_API_BASE_URL
const originalFetch = window.fetch;
window.fetch = function (input, init) {
  if (typeof input === 'string' && input.startsWith('/')) {
    const apiEndpoints = [
      '/categories', '/filieres', '/formations-data', '/settings', 
      '/campuses', '/leads', '/registrations', '/messages', 
      '/track', '/stats', '/uploads'
    ];
    const isApi = apiEndpoints.some(endpoint => input.startsWith(endpoint));
    if (isApi) {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
      const targetUrl = `${baseUrl.replace(/\/$/, '')}${input}`;
      return originalFetch(targetUrl, init);
    }
  }
  return originalFetch(input, init);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
