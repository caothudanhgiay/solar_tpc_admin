export const DEFAULT_BASE_URL = "";
export const API_URL = import.meta.env.VITE_API_URL || DEFAULT_BASE_URL;

export const API_BASE = '/api';

// Các hằng số về API
export const API_MENUS = `${API_BASE}/menus`;
export const API_AUTH_LOGIN = `${API_BASE}/auth/login`;

// Các hằng số HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  DELETE: 'DELETE',
};

// Các hằng số chung của ứng dụng
export const APP_CONSTANTS = {
  DEFAULT_CREATOR: 'admin',
  DEFAULT_PAGE_SIZE: 10,
};
