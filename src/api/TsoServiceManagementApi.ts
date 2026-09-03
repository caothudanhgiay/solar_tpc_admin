import axios from 'axios';
import { LocalStorageUtils } from '../utils/LocalStorageUtils';

const API_BASE = '/api/v1/services';

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

export const TsoServiceManagementApi = {
  getServicesPage(page: number, size: number, keyword?: string) {
    return apiClient.get('/page', { params: { page, size, keyword } });
  },
  getServiceById(id: number) {
    return apiClient.get(`/${id}`);
  },
  createService(data: any, file?: File) {
    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (file) formData.append('file', file);
    return apiClient.post('', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateService(id: number, data: any, file?: File) {
    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (file) formData.append('file', file);
    return apiClient.put(`/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteService(id: number) {
    return apiClient.delete(`/${id}`);
  },
};
