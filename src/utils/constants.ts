export const DEFAULT_BASE_URL = "";
export const API_URL = import.meta.env.VITE_API_URL || DEFAULT_BASE_URL;

export const API_BASE = '/api';

// Các hằng số về API
export const API_MENUS = `${API_BASE}/menus`;
export const API_AUTH_LOGIN = `${API_BASE}/auth/login`;
export const API_PROJECTS = `${API_BASE}/projects`;
export const API_ASSETS = `${API_BASE}/v1/assets`;
export const API_SERVICES = `${API_BASE}/v1/services`;
export const API_ITEMS = `${API_BASE}/v1/items`;

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

// Timeout (ms) cho request upload multipart (lưu dự án/dịch vụ/tài sản kèm ảnh).
// Mặc định apiClient chỉ 10s — không đủ khi gửi nhiều ảnh vài MB + backend nén ảnh.
// 100s = giới hạn chờ tối đa của Cloudflare (quá mức này Cloudflare trả 524).
export const UPLOAD_TIMEOUT_MS = 100000;
