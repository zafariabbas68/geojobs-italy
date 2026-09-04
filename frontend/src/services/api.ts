import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
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
    try {
      console.log('Fetching jobs from:', API_URL);
      const response = await api.get('/jobs', { params });
      console.log('API Response:', response.data);
      
      if (Array.isArray(response.data)) {
        return response.data;
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        return response.data.data;
      } else if (response.data && response.data.items && Array.isArray(response.data.items)) {
        return response.data.items;
      } else {
        return [];
      }
    } catch (error: any) {
      console.error('Error fetching jobs:', error);
      return [];
    }
  },
  getJob: async (id: string) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },
  createJob: async (data: any) => {
    const response = await api.post('/jobs', data);
    return response.data;
  },
};

// Auth Services
export const authService = {
  login: async (email: string, password: string) => {
    try {
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);
      
      const response = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (response.data.access_token) {
        localStorage.setItem('access_token', response.data.access_token);
        localStorage.setItem('user', JSON.stringify(response.data.user || {}));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  register: async (data: any) => {
    try {
      // Make sure all required fields are present
      const payload = {
        email: data.email,
        password: data.password,
        first_name: data.first_name || data.firstName || '',
        last_name: data.last_name || data.lastName || '',
        role: data.role || 'candidate'
      };
      
      console.log('Register payload:', payload);
      const response = await api.post('/auth/register', payload);
      console.log('Register response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Register error:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      throw error;
    }
  },
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    window.location.href = '/';
  },
  getCurrentUser: async () => {
    const token = localStorage.getItem('access_token');
    if (!token) return null;
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch {
      return null;
    }
  },
};

// Candidate Services
export const candidateService = {
  getCandidates: async (params?: any) => {
    const response = await api.get('/candidates', { params });
    return response.data;
  },
};

// Company Services
export const companyService = {
  getCompanies: async () => {
    const response = await api.get('/companies');
    return response.data;
  },
};
