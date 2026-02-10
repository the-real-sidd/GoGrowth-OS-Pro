import axios from 'axios';
import CONFIG from '../config';

const API_BASE_URL = CONFIG.API_BASE_URL;

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data?.message || error.message);
    return Promise.reject(error);
  }
);

export const taskAPI = {
  getAllTasks: (filters) => apiClient.get('/tasks', { params: filters }),
  getTaskById: (id) => apiClient.get(`/tasks/${id}`),
  createTask: (data) => apiClient.post('/tasks', data),
  updateTask: (id, data) => apiClient.put(`/tasks/${id}`, data),
  deleteTask: (id) => apiClient.delete(`/tasks/${id}`),
  getStatistics: () => apiClient.get('/tasks/stats')
};

export const resourceAPI = {
  getAllResources: (filters) => apiClient.get('/resources', { params: filters }),
  getResourceById: (id) => apiClient.get(`/resources/${id}`),
  createResource: (data) => apiClient.post('/resources', data),
  updateResource: (id, data) => apiClient.put(`/resources/${id}`, data),
  deleteResource: (id) => apiClient.delete(`/resources/${id}`)
};

export const userAPI = {
  register: (data) => apiClient.post('/users/register', data),
  login: (data) => apiClient.post('/users/login', data),
  getCurrentUser: () => apiClient.get('/users/profile'),
  getAllUsers: () => apiClient.get('/users'),
  updateUser: (id, data) => apiClient.put(`/users/${id}`, data)
};

export default apiClient;

