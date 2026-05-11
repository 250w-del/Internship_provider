import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  registerStudent: (data) => api.post('/auth/register/student', data),
  registerCompany: (data) => api.post('/auth/register/company', data),
  login: (data) => api.post('/auth/login', data),
};

// Public internships
export const publicAPI = {
  getInternships: (params) => api.get('/internships/public', { params }),
};

// Student
export const studentAPI = {
  getProfile: () => api.get('/students/profile'),
  updateProfile: (data) => api.put('/students/profile', data),
  uploadCV: (formData) => api.post('/students/upload-cv', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getInternships: (params) => api.get('/students/internships', { params }),
  apply: (data) => api.post('/students/apply', data),
  getApplications: (params) => api.get('/students/applications', { params }),
};

// Company
export const companyAPI = {
  getProfile: () => api.get('/companies/profile'),
  updateProfile: (data) => api.put('/companies/profile', data),
  postInternship: (data) => api.post('/companies/internships', data),
  getInternships: (params) => api.get('/companies/internships', { params }),
  getApplications: (internshipId, params) =>
    api.get(`/companies/internships/${internshipId}/applications`, { params }),
  updateApplicationStatus: (applicationId, status) =>
    api.put(`/companies/applications/${applicationId}/status`, { status }),
  deleteInternship: (internshipId) =>
    api.delete(`/companies/internships/${internshipId}`),
};

// Admin
export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getStudents: (params) => api.get('/admin/students', { params }),
  deleteStudent: (id) => api.delete(`/admin/students/${id}`),
  getCompanies: (params) => api.get('/admin/companies', { params }),
  deleteCompany: (id) => api.delete(`/admin/companies/${id}`),
  getPendingInternships: (params) => api.get('/admin/internships/pending', { params }),
  approveInternship: (id) => api.put(`/admin/internships/${id}/approve`),
  rejectInternship: (id) => api.put(`/admin/internships/${id}/reject`),
};

export default api;
