import axios from 'axios';
import { LocalStorageUtils } from '../utils/LocalStorageUtils';
import router from '../router';

const API_BASE = '/api/v1/items';

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

export const TsoItemApi = {
  getItemsPage(page: number, size: number, keyword?: string) {
    return apiClient.get('/page', { params: { page, size, keyword } });
  },
  getItemById(id: number) {
    return apiClient.get(`/${id}`);
  },
  createItem(data: any) {
    return apiClient.post('', data);
  },
  updateItem(id: number, data: any) {
    return apiClient.put(`/${id}`, data);
  },
  deleteItem(id: number) {
    return apiClient.delete(`/${id}`);
  },
  getGroupsByItemCode(itemCode: string) {
    return apiClient.get('/groups', { params: { itemCode } });
  },
  getSubItemsByGroupCode(groupItemCode: string) {
    return apiClient.get('/sub-items', { params: { groupItemCode } });
  }
};
