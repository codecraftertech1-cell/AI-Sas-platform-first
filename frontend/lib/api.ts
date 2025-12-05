import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// Auth
export const authApi = {
  register: (data: { email: string; password: string; name?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Chat
export const chatApi = {
  getAll: () => api.get('/chat'),
  getOne: (id: string) => api.get(`/chat/${id}`),
  create: (data: { title?: string; initialMessage?: string }) =>
    api.post('/chat', data),
  sendMessage: (id: string, message: string, fileData?: any, fileUrl?: string) =>
    api.post(`/chat/${id}/message`, { message, fileData, fileUrl }),
  updateTitle: (id: string, title: string) =>
    api.patch(`/chat/${id}/title`, { title }),
  share: (id: string) => api.post(`/chat/${id}/share`),
  delete: (id: string) => api.delete(`/chat/${id}`),
};

// Documents
export const documentApi = {
  getAll: () => api.get('/documents'),
  getOne: (id: string) => api.get(`/documents/${id}`),
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  chat: (id: string, message: string) =>
    api.post(`/documents/${id}/chat`, { message }),
  export: (id: string, format: string) =>
    api.post(`/documents/${id}/export`, { format }),
  delete: (id: string) => api.delete(`/documents/${id}`),
};

// Presentations
export const presentationApi = {
  getAll: () => api.get('/presentations'),
  getOne: (id: string) => api.get(`/presentations/${id}`),
  create: (data: { title: string; prompt: string; slideCount?: number }) =>
    api.post('/presentations', data),
  update: (id: string, data: { title?: string; slides?: any }) =>
    api.patch(`/presentations/${id}`, data),
  export: (id: string, format: string) =>
    api.post(`/presentations/${id}/export`, { format }),
  delete: (id: string) => api.delete(`/presentations/${id}`),
};

// Websites
export const websiteApi = {
  getAll: () => api.get('/websites'),
  getOne: (id: string) => api.get(`/websites/${id}`),
  generate: (data: { title: string; prompt: string }) =>
    api.post('/websites/generate', data),
  generateCode: (data: { title: string; prompt: string }) =>
    api.post('/websites/generate-code', data),
  preview: (id: string) => api.get(`/websites/preview/${id}`),
  export: (id: string) => api.get(`/websites/export/${id}`),
  update: (id: string, data: { title?: string; code?: string }) =>
    api.patch(`/websites/${id}`, data),
  download: (id: string) => api.get(`/websites/${id}/download`),
  delete: (id: string) => api.delete(`/websites/${id}`),
};

// Mobile Apps
export const mobileAppApi = {
  getAll: () => api.get('/mobile-apps'),
  getOne: (id: string) => api.get(`/mobile-apps/${id}`),
  generate: (data: { title: string; prompt: string; framework?: string }) =>
    api.post('/mobile-apps/generate', data),
  update: (id: string, data: { title?: string; code?: string }) =>
    api.patch(`/mobile-apps/${id}`, data),
  download: (id: string) => api.get(`/mobile-apps/${id}/download`),
  share: (id: string) => api.post(`/mobile-apps/${id}/share`),
  delete: (id: string) => api.delete(`/mobile-apps/${id}`),
};

// Subscriptions
export const subscriptionApi = {
  getCurrent: () => api.get('/subscriptions'),
  checkout: (plan: string) => api.post('/subscriptions/checkout', { plan }),
  getInvoices: () => api.get('/subscriptions/invoices'),
};

// User
export const userApi = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data: { name?: string; avatar?: string }) =>
    api.patch('/user/profile', data),
  getUsage: (params?: { startDate?: string; endDate?: string }) =>
    api.get('/user/usage', { params }),
  getDashboard: () => api.get('/user/dashboard'),
};

// Media (Video/Audio)
export const mediaApi = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/media/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  chat: (id: string, message: string) =>
    api.post(`/media/${id}/chat`, { message }),
};

// LinkedIn
export const linkedinApi = {
  login: () => api.post('/linkedin/login'),
  oauthCallback: (code: string) => api.get(`/linkedin/oauth/callback?code=${code}`),
  generatePost: (data: { topic: string; tone?: string; length?: string }) =>
    api.post('/linkedin/generate-post', data),
  schedule: (data: { content: string; scheduledTime: string; platforms: string[] }) =>
    api.post('/linkedin/schedule', data),
  autoMessage: (data: { recipientId: string; message?: string; template?: string }) =>
    api.post('/linkedin/auto-message', data),
  autoComment: (data: { postId: string; comment?: string }) =>
    api.post('/linkedin/auto-comment', data),
};

// Social Media
export const socialMediaApi = {
  generate: (data: { topic: string; platform: string; tone?: string; includeHashtags?: boolean }) =>
    api.post('/social-media/generate', data),
  schedule: (data: { content: string; platforms: string[]; scheduledTime: string; mediaUrl?: string }) =>
    api.post('/social-media/schedule', data),
  getScheduled: () => api.get('/social-media/scheduled'),
};

// Email Assistant
export const emailApi = {
  connect: (data: { provider: string; accessToken: string; refreshToken: string }) =>
    api.post('/email/connect', data),
  generateReply: (data: { originalEmail: string; tone?: string; length?: string }) =>
    api.post('/email/generate-reply', data),
  getSuggestions: (data: { emailContent: string; context?: string }) =>
    api.post('/email/suggestions', data),
  getInbox: () => api.get('/email/inbox'),
};

// Admin
export const adminApi = {
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  getUser: (id: string) => api.get(`/admin/users/${id}`),
  updateUser: (id: string, data: any) =>
    api.patch(`/admin/users/${id}`, data),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  getAnalytics: (params?: any) => api.get('/admin/analytics', { params }),
  getUsageLogs: (params?: any) => api.get('/admin/usage-logs', { params }),
};

