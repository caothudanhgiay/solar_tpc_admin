import { apiGet, apiPost, apiPut, apiDelete } from './apiClient';

const BASE_PATH = '/api/users';

/**
 * API service cho màn hình quản lý Người dùng.
 */
export const TsoUserApi = {
  /** Lấy tất cả người dùng */
  getAllUsers: () => apiGet(BASE_PATH),

  /** Lấy người dùng theo ID */
  getUserById: (id: number) => apiGet(`${BASE_PATH}/${id}`),

  /** Tạo người dùng mới */
  createUser: (data: any) => apiPost(BASE_PATH, data),

  /** Cập nhật thông tin người dùng */
  updateUser: (id: number, data: any) => apiPut(`${BASE_PATH}/${id}`, data),

  /** Xóa người dùng */
  deleteUser: (id: number) => apiDelete(`${BASE_PATH}/${id}`),

  /** Nhân bản người dùng */
  copyUser: (id: number) => apiPost(`${BASE_PATH}/${id}/copy`),

  /**
   * Đổi mật khẩu người dùng.
   * PUT /api/users/:id/password
   */
  changePassword: (id: number, data: { oldPassword: string; newPassword: string; confirmPassword: string }) =>
    apiPut(`${BASE_PATH}/${id}/password`, data),
};
