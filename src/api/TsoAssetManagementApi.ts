import axios from 'axios';
import { LocalStorageUtils } from '../utils/LocalStorageUtils';
import router from '../router';

const API_BASE = '/api/v1/assets';

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

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      LocalStorageUtils.clearAuth();
      router.push({ name: 'TsoLogin' });
    }
    return Promise.reject(error);
  }
);

export const TsoAssetManagementApi = {
  getAssetsPage(page: number, size: number, keyword?: string) {
    return apiClient.get('/page', { params: { page, size, keyword } });
  },
  getAssetById(id: number) {
    return apiClient.get(`/${id}`);
  },
  createAsset(data: any, file?: File) {
    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (file) formData.append('file', file);
    return apiClient.post('', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  updateAsset(id: number, data: any, file?: File) {
    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (file) formData.append('file', file);
    return apiClient.put(`/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  deleteAsset(id: number) {
    return apiClient.delete(`/${id}`);
  },
};
