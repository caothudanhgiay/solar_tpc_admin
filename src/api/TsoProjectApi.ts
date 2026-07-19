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
  createProject(formData: FormData) {
    return apiClient.post('', formData, {
      headers: { 'Content-Type': undefined },
    });
  },
  updateProject(id: number, formData: FormData) {
    return apiClient.put(`/${id}`, formData, {
      headers: { 'Content-Type': undefined },
    });
  },
  deleteProject(id: number) {
    return apiClient.delete(`/${id}`);
  },
  uploadImage(file: File, projectCode: string, isDetail: boolean = false) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectCode', projectCode);
    formData.append('isDetail', isDetail.toString());
    return apiClient.post('/upload', formData, {
      headers: {
        'Content-Type': undefined,
      },
    });
  },
};
