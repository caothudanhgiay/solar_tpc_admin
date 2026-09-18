import { apiGet, apiPost, apiPut, apiDelete } from './apiClient';
import { API_ASSETS } from '../utils/constants';

// Content-Type: undefined -> để axios tự set 'multipart/form-data' kèm boundary cho FormData.
const FORM_DATA_CONFIG = { headers: { 'Content-Type': undefined } };

export const TsoAssetManagementApi = {
  getAssetsPage(page: number, size: number, keyword?: string) {
    return apiGet(`${API_ASSETS}/page`, { page, size, keyword });
  },
  getAssetById(id: number) {
    return apiGet(`${API_ASSETS}/${id}`);
  },
  createAsset(data: any, file?: File) {
    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (file) formData.append('file', file);
    return apiPost(API_ASSETS, formData, FORM_DATA_CONFIG);
  },
  updateAsset(id: number, data: any, file?: File) {
    const formData = new FormData();
    formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
    if (file) formData.append('file', file);
    return apiPut(`${API_ASSETS}/${id}`, formData, FORM_DATA_CONFIG);
  },
  deleteAsset(id: number) {
    return apiDelete(`${API_ASSETS}/${id}`);
  },
};
