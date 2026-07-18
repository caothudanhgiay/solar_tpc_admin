import axios from 'axios';
import { LocalStorageUtils } from '../utils/LocalStorageUtils';

const API_BASE = '/api/projects';

const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = LocalStorageUtils.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const TsoProjectApi = {
  getProjectsPage(page: number, size: number) {
    return apiClient.get('/page', { params: { page, size } });
  },
  getProjectById(id: number) {
    return apiClient.get(`/${id}`);
  },
  createProject(data: any) {
    return apiClient.post('', data);
  },
  updateProject(id: number, data: any) {
    return apiClient.put(`/${id}`, data);
  },
  deleteProject(id: number) {
    return apiClient.delete(`/${id}`);
  },
  uploadImage(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};
