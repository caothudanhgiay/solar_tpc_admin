import axios from 'axios';
import { LocalStorageUtils } from '../utils/LocalStorageUtils';

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

export const TsoAssetManagementApi = {
  getAssetsPage(page: number, size: number, keyword?: string) {
    return apiClient.get('/page', { params: { page, size, keyword } });
  },
  getAssetById(id: number) {
    return apiClient.get(`/${id}`);
  },
  createAsset(data: any) {
    return apiClient.post('', data);
  },
  updateAsset(id: number, data: any) {
    return apiClient.put(`/${id}`, data);
  },
  deleteAsset(id: number) {
    return apiClient.delete(`/${id}`);
  },
};
