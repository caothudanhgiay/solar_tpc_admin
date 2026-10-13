import { apiGet, apiPost, apiPut, apiDelete } from './apiClient';
import { API_PROJECTS, UPLOAD_TIMEOUT_MS } from '../utils/constants';

// Content-Type: undefined -> để axios tự set 'multipart/form-data' kèm boundary cho FormData.
const FORM_DATA_CONFIG = { headers: { 'Content-Type': undefined }, timeout: UPLOAD_TIMEOUT_MS };

export const TsoProjectApi = {
  getProjectsPage(page: number, size: number, keyword?: string) {
    return apiGet(`${API_PROJECTS}/page`, { page, size, keyword });
  },
  getProjectById(id: number) {
    return apiGet(`${API_PROJECTS}/${id}`);
  },
  createProject(formData: FormData) {
    return apiPost(API_PROJECTS, formData, FORM_DATA_CONFIG);
  },
  updateProject(id: number, formData: FormData) {
    return apiPut(`${API_PROJECTS}/${id}`, formData, FORM_DATA_CONFIG);
  },
  deleteProject(id: number) {
    return apiDelete(`${API_PROJECTS}/${id}`);
  },
  uploadImage(file: File, projectCode: string, isDetail: boolean = false) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('projectCode', projectCode);
    formData.append('isDetail', isDetail.toString());
    return apiPost(`${API_PROJECTS}/upload`, formData, FORM_DATA_CONFIG);
  },
};
