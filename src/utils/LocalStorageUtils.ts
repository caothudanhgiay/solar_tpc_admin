/**
 * Các hằng số key của LocalStorage
 */
export const STORAGE_KEYS = {
  TOKEN: 'solar_admin_token',
  USER: 'solar_admin_user',
} as const;

/**
 * Tiện ích quản lý LocalStorage của ứng dụng
 */
export class LocalStorageUtils {
  
  /**
   * Ghi dữ liệu vào localStorage
   * @param key Key lưu trữ
   * @param value Giá trị (tự động chuyển thành string/JSON string)
   */
  static setItem(key: string, value: any): void {
    try {
      if (value === null || value === undefined) {
        localStorage.removeItem(key);
      } else if (typeof value === 'object') {
        localStorage.setItem(key, JSON.stringify(value));
      } else {
        localStorage.setItem(key, String(value));
      }
    } catch (error) {
      console.error(`Lỗi khi setItem vào localStorage với key "${key}":`, error);
    }
  }

  /**
   * Lấy dữ liệu từ localStorage
   * @param key Key lưu trữ
   */
  static getItem<T = string>(key: string): T | null {
    try {
      const value = localStorage.getItem(key);
      if (value === null) {
        return null;
      }
      
      // Kiểm tra nếu có vẻ là định dạng JSON (object hoặc array)
      const trimmed = value.trim();
      if (
        (trimmed.startsWith('{') && trimmed.endsWith('}')) ||
        (trimmed.startsWith('[') && trimmed.endsWith(']'))
      ) {
        return JSON.parse(value) as T;
      }
      
      return value as unknown as T;
    } catch (error) {
      console.error(`Lỗi khi getItem từ localStorage với key "${key}":`, error);
      return null;
    }
  }

  /**
   * Xóa một key trong localStorage
   * @param key Key cần xóa
   */
  static removeItem(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Lỗi khi removeItem khỏi localStorage với key "${key}":`, error);
    }
  }

  /**
   * Xóa toàn bộ localStorage
   */
  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Lỗi khi clear localStorage:', error);
    }
  }

  // --- Các hàm helper cụ thể dành cho Authentication ---

  /**
   * Lưu token
   */
  static setToken(token: string): void {
    this.setItem(STORAGE_KEYS.TOKEN, token);
  }

  /**
   * Lấy token hiện tại
   */
  static getToken(): string | null {
    return this.getItem<string>(STORAGE_KEYS.TOKEN);
  }

  /**
   * Xóa token
   */
  static removeToken(): void {
    this.removeItem(STORAGE_KEYS.TOKEN);
  }

  /**
   * Lưu thông tin người dùng
   */
  static setUser(user: any): void {
    this.setItem(STORAGE_KEYS.USER, user);
  }

  /**
   * Lấy thông tin người dùng hiện tại
   */
  static getUser<T = any>(): T | null {
    return this.getItem<T>(STORAGE_KEYS.USER);
  }

  /**
   * Xóa thông tin người dùng
   */
  static removeUser(): void {
    this.removeItem(STORAGE_KEYS.USER);
  }

  /**
   * Xóa thông tin auth (cả token và user)
   */
  static clearAuth(): void {
    this.removeToken();
    this.removeUser();
  }
}
