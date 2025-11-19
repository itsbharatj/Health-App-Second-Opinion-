import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const healthApi = {
  initData: (userId: string) => api.get(`/health/init/${userId}`),
  getMetrics: (userId: string, days?: number) => 
    api.get(`/health/metrics/${userId}`, { params: { days } }),
  getProfile: (userId: string) => api.get(`/health/profile/${userId}`),
  getSummary: (userId: string) => api.get(`/health/summary/${userId}`),
  addMetric: (userId: string, metric: any) => 
    api.post(`/health/metrics/${userId}`, metric),
};

export const chatApi = {
  sendMessage: (userId: string, message: string) => 
    api.post(`/chat/send`, null, { params: { user_id: userId, message } }),
  getInsights: (userId: string) => 
    api.get(`/chat/health-insights/${userId}`),
};

export const documentsApi = {
  upload: (userId: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post(`/documents/upload/${userId}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  list: (userId: string) => api.get(`/documents/list/${userId}`),
  get: (userId: string, documentId: string) => 
    api.get(`/documents/${userId}/${documentId}`),
};

export const guardiansApi = {
  add: (userId: string, name: string, relationship: string, accessLevel?: string) =>
    api.post(`/guardians/add/${userId}`, null, { 
      params: { guardian_name: name, relationship, access_level: accessLevel } 
    }),
  list: (userId: string) => api.get(`/guardians/list/${userId}`),
  view: (userId: string, guardianId: string, viewType?: string) =>
    api.get(`/guardians/view/${userId}/${guardianId}`, { params: { view_type: viewType } }),
  enableAlerts: (userId: string, guardianId: string) =>
    api.post(`/guardians/alerts/${userId}`, null, { params: { guardian_id: guardianId } }),
};
