import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Job Services
export const jobService = {
  getJobs: async (params?: any) => {
    const response = await api.get('/jobs', { params });
    return response.data;
  },
  getJob: async (id: string) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },
  createJob: async (data: any) => {
    const response = await api.post('/jobs', data);
    return response.data;
  },
  updateJob: async (id: string, data: any) => {
    const response = await api.put(`/jobs/${id}`, data);
    return response.data;
  },
  deleteJob: async (id: string) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },
};

// Candidate Services
export const candidateService = {
  getCandidates: async (params?: any) => {
    const response = await api.get('/candidates', { params });
    return response.data;
  },
  getCandidate: async (id: string) => {
    const response = await api.get(`/candidates/${id}`);
    return response.data;
  },
  updateCandidate: async (id: string, data: any) => {
    const response = await api.put(`/candidates/${id}`, data);
    return response.data;
  },
};

// Auth Services
export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { username: email, password });
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
    }
    return response.data;
  },
  register: async (data: any) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('access_token');
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Company Services
export const companyService = {
  getCompanies: async () => {
    const response = await api.get('/companies');
    return response.data;
  },
  getCompany: async (id: string) => {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  },
  createCompany: async (data: any) => {
    const response = await api.post('/companies', data);
    return response.data;
  },
  updateCompany: async (id: string, data: any) => {
    const response = await api.put(`/companies/${id}`, data);
    return response.data;
  },
};

// Search Service
export const searchService = {
  search: async (query: string, type?: string) => {
    const response = await api.get('/search', { params: { q: query, type } });
    return response.data;
  },
};

// Analytics Service
export const analyticsService = {
  getAnalytics: async () => {
    const response = await api.get('/analytics');
    return response.data;
  },
};
