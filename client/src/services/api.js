import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
});

// Interceptor to attach admin JWT token if present
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('club_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth services
export const loginAdmin = (credentials) => API.post('/auth/login', credentials);
export const registerAdmin = (data) => API.post('/auth/register', data);
export const getMe = () => API.get('/auth/me');

// Event services
export const fetchEvents = () => API.get('/events');
export const fetchEventById = (id) => API.get(`/events/${id}`);
export const createEvent = (data) => API.post('/events', data);
export const updateEvent = (id, data) => API.put(`/events/${id}`, data);
export const deleteEvent = (id) => API.delete(`/events/${id}`);

// Registration services
export const submitRegistration = (formData) =>
  API.post('/registrations', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const fetchRegistrations = (params) => API.get('/registrations', { params });
export const updateRegistrationStatus = (id, status) =>
  API.patch(`/registrations/${id}/status`, { paymentStatus: status });

export const getExportUrl = (eventId) => {
  const base = import.meta.env.VITE_API_URL || '/api';
  return `${base}/registrations/export/${eventId}`;
};

export const getAssetUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const base = import.meta.env.VITE_SERVER_URL || '';
  return `${base}${path}`;
};

export default API;
