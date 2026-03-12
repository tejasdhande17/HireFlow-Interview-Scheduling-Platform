import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    logout: () => api.post('/auth/logout')
};

export const jobsAPI = {
    getAll: (params) => api.get('/jobs', { params }),
    getHrJobs: () => api.get('/jobs/hr'),
    create: (jobData) => api.post('/jobs', jobData),
    delete: (id) => api.delete(`/jobs/${id}`)
};

export const applicationsAPI = {
    apply: (jobId) => api.post('/applications', { jobId }),
    getHrApplications: (params) => api.get('/applications/hr', { params })
};

export const interviewsAPI = {
    getHrInterviews: (params) => api.get('/interviews', { params }),
    getStudentInterviews: () => api.get('/interviews/student'),
    schedule: (data) => api.post('/interviews', data),
    updateResult: (id, result) => api.put(`/interviews/${id}/result`, { result })
};

export default api;
