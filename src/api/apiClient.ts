import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import router from '../router';
import { ApiException } from '../exception/exception';
import { AppError } from '../exception/error';
import { API_URL } from '../utils/constants';
import { LocalStorageUtils } from '../utils/LocalStorageUtils';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Tự động đính kèm Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = LocalStorageUtils.getToken();
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Xử lý lỗi chung
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const data: any = error.response.data;
      const serverMessage = data?.message || '';

      // Nếu 401 Unauthorized -> Đẩy về trang đăng nhập (trừ endpoint login)
      const requestUrl = error.config?.url || '';
      const isLoginRequest = requestUrl.includes('/auth/login');
      if (status === 401 && !isLoginRequest) {
        LocalStorageUtils.clearAuth();
        router.push({ name: 'TsoLogin' });
      }

      let defaultMsg = 'Lỗi không xác định';
      if (status >= 400 && status < 500) {
        defaultMsg = 'Yêu cầu không hợp lệ';
      } else if (status >= 500) {
        defaultMsg = 'Lỗi máy chủ nội bộ';
      }

      throw new ApiException(status, serverMessage || defaultMsg, data);
    } else {
      throw new AppError(error.message || 'Lỗi kết nối máy chủ');
    }
  }
);

// Các hàm wrapper common để dễ dàng tái sử dụng và khai báo kiểu dữ liệu (Generic Types)
export const apiGet = <T = any>(url: string, params?: any): Promise<T> => {
  return apiClient.get(url, { params });
};

export const apiPost = <T = any>(url: string, data?: any): Promise<T> => {
  return apiClient.post(url, data);
};

export const apiPut = <T = any>(url: string, data?: any): Promise<T> => {
  return apiClient.put(url, data);
};

export const apiDelete = <T = any>(url: string, params?: any): Promise<T> => {
  return apiClient.delete(url, { params });
};

export default apiClient;
