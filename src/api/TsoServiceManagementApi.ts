import { apiGet, apiPost, apiPut, apiDelete } from './apiClient';
import { API_SERVICES } from '../utils/constants';

// Content-Type: undefined -> để axios tự set 'multipart/form-data' kèm boundary cho FormData.
const FORM_DATA_CONFIG = { headers: { 'Content-Type': undefined } };

export const TsoServiceManagementApi = {
  getServicesPage(page: number, size: number, keyword?: string) {
    return apiGet(`${API_SERVICES}/page`, { page, size, keyword });
  },
  getServiceById(id: number) {
    return apiGet(`${API_SERVICES}/${id}`);
  },
  createService(data: any, file?: File) {
    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (file) formData.append('file', file);
    return apiPost(API_SERVICES, formData, FORM_DATA_CONFIG);
  },
  updateService(id: number, data: any, file?: File) {
    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (file) formData.append('file', file);
    return apiPut(`${API_SERVICES}/${id}`, formData, FORM_DATA_CONFIG);
  },
  deleteService(id: number) {
    return apiDelete(`${API_SERVICES}/${id}`);
  },
};
