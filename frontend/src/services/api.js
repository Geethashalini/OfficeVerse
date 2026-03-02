import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const employeesAPI = {
  getAll: (params) => api.get('/employees', { params }),
  getById: (id) => api.get(`/employees/${id}`),
  getDepartments: () => api.get('/employees/departments'),
  update: (id, data) => api.put(`/employees/${id}`, data),
};

export const achievementsAPI = {
  getAll: (params) => api.get('/achievements', { params }),
  getCategories: () => api.get('/achievements/categories'),
  like: (id) => api.post(`/achievements/${id}/like`),
};

export const celebrationsAPI = {
  getAll: () => api.get('/celebrations'),
  getUpcoming: (days = 30) => api.get('/celebrations/upcoming', { params: { days } }),
};

export const policiesAPI = {
  getAll: (params) => api.get('/policies', { params }),
  getById: (id) => api.get(`/policies/${id}`),
  getCategories: () => api.get('/policies/categories'),
};

export const announcementsAPI = {
  getAll: (params) => api.get('/announcements', { params }),
  getCategories: () => api.get('/announcements/categories'),
  like: (id) => api.post(`/announcements/${id}/like`),
  create: (data) => api.post('/announcements', data),
};

export const kudosAPI = {
  getAll: (params) => api.get('/kudos', { params }),
  create: (data) => api.post('/kudos', data),
  like: (id) => api.post(`/kudos/${id}/like`),
  getLeaderboard: () => api.get('/kudos/leaderboard'),
};

export const feedbackAPI = {
  getAll: () => api.get('/feedback'),
  submit: (data) => api.post('/feedback', data),
};

export const leavesAPI = {
  getAll: (params) => api.get('/leaves', { params }),
  apply: (data) => api.post('/leaves', data),
  updateStatus: (id, status, approvedBy) => api.put(`/leaves/${id}/status`, { status, approvedBy }),
};

export const analyticsAPI = {
  get: () => api.get('/analytics'),
};

export default api;
