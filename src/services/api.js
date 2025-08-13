import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: (process.env.REACT_APP_API_URL || 'http://localhost:5001') + '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/me'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  updatePreferences: (preferences) => api.put('/auth/preferences', preferences),
  refreshToken: () => api.post('/auth/refresh'),
  
  // Helper methods for token management
  setAuthToken: (token) => {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  },
  removeAuthToken: () => {
    delete api.defaults.headers.common['Authorization'];
  },
};

// Problems API
export const problemsAPI = {
  getAll: (params) => api.get('/problems', { params }),
  getById: (id) => api.get(`/problems/${id}`),
  getSolution: (id) => api.get(`/problems/${id}/solution`),
  submitSolution: (id, data) => api.post(`/problems/${id}/submit`, data),
  getByTopic: (topic, params) => api.get(`/problems/topic/${topic}`, { params }),
  getByDifficulty: (difficulty, params) => api.get(`/problems/difficulty/${difficulty}`, { params }),
  getRandom: (params) => api.get('/problems/random', { params }),
  getPopular: (params) => api.get('/problems/popular', { params }),
  getRecent: (params) => api.get('/problems/recent', { params }),
  getTopics: () => api.get('/problems/topics/list'),
};

// AI API
export const aiAPI = {
  generateProblem: (data) => api.post('/ai/generate-problem', data),
  analyzeSolution: (data) => api.post('/ai/analyze-solution', data),
  getHint: (data) => api.post('/ai/get-hint', data),
  getRecommendations: () => api.post('/ai/recommend-problems'),
  recommendQuestions: (data) => api.post('/ai/recommend-questions', data),
  assessInterviewReadiness: (data) => api.post('/ai/interview-readiness', data),
  expandQuestionDatabase: (data) => api.post('/ai/expand-question-database', data),
  getLearningInsights: () => api.post('/ai/learning-insights'),
};

// Users API
export const usersAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
  getProgress: () => api.get('/users/progress'),
  getSubmissions: (params) => api.get('/users/submissions', { params }),
  getAchievements: () => api.get('/users/achievements'),
  getStats: () => api.get('/users/stats'),
  updatePreferences: (preferences) => api.put('/users/preferences', preferences),
  getLeaderboard: (params) => api.get('/users/leaderboard', { params }),
};

// Utility functions
export const formatError = (error) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

export const isNetworkError = (error) => {
  return !error.response && error.request;
};

export const isServerError = (error) => {
  return error.response?.status >= 500;
};

export const isClientError = (error) => {
  return error.response?.status >= 400 && error.response?.status < 500;
};

export default api;
