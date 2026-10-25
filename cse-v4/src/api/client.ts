import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api',
  // headers: { 'Content-Type': 'application/json' },
});

// Attach JWT from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cse_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;

  // Let the browser/Axios set the correct
  // multipart/form-data boundary for file uploads
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  } else {
    config.headers['Content-Type'] = 'application/json';
  }
  
  return config;
});

// Global error handling — DO NOT redirect or wipe token here.
// The 401 response is handled gracefully per-component.
// A global hard redirect causes a page reload that wipes Zustand state
// and breaks the auth flow (infinite login loop on /profile).
api.interceptors.response.use(
  (res) => res,
  (err) => {
    // Only silently clear token if the server explicitly rejects it as invalid
    // (i.e. the token itself is expired/malformed, not just a missing-auth route)
    if (err.response?.status === 401 && err.config?.headers?.Authorization) {
      localStorage.removeItem('cse_token');
      localStorage.removeItem('cse_user');
      // Let the component/ProtectedRoute handle the redirect via React Router
      // No window.location.href — that causes hard reload and wipes Zustand
    }
    return Promise.reject(err);
  }
);

export default api;
