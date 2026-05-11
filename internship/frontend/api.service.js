// frontend/api.service.js - Add to your Vue app
const API_URL = 'http://localhost:5000/api';

const apiService = {
    async request(endpoint, method = 'GET', data = null) {
        const token = localStorage.getItem('session') ? JSON.parse(localStorage.getItem('session')).token : null;
        const headers = {
            'Content-Type': 'application/json',
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const config = {
            method,
            headers,
        };
        
        if (data && (method === 'POST' || method === 'PUT')) {
            config.body = JSON.stringify(data);
        }
        
        const response = await fetch(`${API_URL}${endpoint}`, config);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'API request failed');
        }
        
        return result;
    },
    
    // Auth endpoints
    registerStudent(data) { return this.request('/auth/register/student', 'POST', data); },
    registerCompany(data) { return this.request('/auth/register/company', 'POST', data); },
    login(data) { return this.request('/auth/login', 'POST', data); },
    
    // Student endpoints
    getStudentProfile() { return this.request('/students/profile'); },
    updateStudentProfile(data) { return this.request('/students/profile', 'PUT', data); },
    uploadCV(formData) { 
        return fetch(`${API_URL}/students/upload-cv`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem('session')).token}` },
            body: formData
        }).then(res => res.json());
    },
    getAvailableInternships() { return this.request('/students/internships'); },
    applyForInternship(internship_id) { return this.request('/students/apply', 'POST', { internship_id }); },
    getMyApplications() { return this.request('/students/applications'); },
    
    // Company endpoints
    getCompanyProfile() { return this.request('/companies/profile'); },
    updateCompanyProfile(data) { return this.request('/companies/profile', 'PUT', data); },
    postInternship(data) { return this.request('/companies/internships', 'POST', data); },
    getMyInternships() { return this.request('/companies/internships'); },
    getApplicationsForInternship(internshipId) { return this.request(`/companies/internships/${internshipId}/applications`); },
    updateApplicationStatus(applicationId, status) { return this.request(`/companies/applications/${applicationId}`, 'PUT', { status }); },
    deleteInternship(internshipId) { return this.request(`/companies/internships/${internshipId}`, 'DELETE'); },
    
    // Admin endpoints
    getDashboardStats() { return this.request('/admin/dashboard'); },
    getAllStudents() { return this.request('/admin/students'); },
    deleteStudent(studentId) { return this.request(`/admin/students/${studentId}`, 'DELETE'); },
    getAllCompanies() { return this.request('/admin/companies'); },
    deleteCompany(companyId) { return this.request(`/admin/companies/${companyId}`, 'DELETE'); },
    getPendingInternships() { return this.request('/admin/internships/pending'); },
    approveInternship(internshipId) { return this.request(`/admin/internships/${internshipId}/approve`, 'PUT'); },
    rejectInternship(internshipId) { return this.request(`/admin/internships/${internshipId}/reject`, 'PUT'); }
};