// api/axios.js
// -----------------------------------------------------------------------
// One shared Axios instance for the whole app.
// A "request interceptor" automatically attaches the saved JWT token
// (if any) to every outgoing request, so we never have to repeat that
// logic in every component that calls the API.
// -----------------------------------------------------------------------

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
