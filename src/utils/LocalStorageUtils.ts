/**
 * Các hằng số key của LocalStorage
 */
export const STORAGE_KEYS = {
  TOKEN: 'solar_admin_token',
  USER: 'solar_admin_user',
  // Cờ này LUÔN nằm ở localStorage (không phụ thuộc chính nó) để biết phiên hiện tại
  // đang lưu ở localStorage (remember=1, mặc định) hay sessionStorage (remember=0).
  REMEMBER: 'solar_admin_remember',
} as const;

/**
 * Tiện ích quản lý LocalStorage của ứng dụng
 */
export class LocalStorageUtils {

  /**
   * Chọn storage đang active cho phiên hiện tại: localStorage (mặc định, "remember me")
   * hoặc sessionStorage (khi người dùng không tick "Ghi nhớ đăng nhập" -> mất khi đóng tab/trình duyệt).
   */
  private static getStorage(): Storage {
    return localStorage.getItem(STORAGE_KEYS.REMEMBER) === '0' ? sessionStorage : localStorage;
  }

  /**
   * Ghi dữ liệu vào storage đang active
   * @param key Key lưu trữ
   * @param value Giá trị (tự động chuyển thành string/JSON string)
   */
  static setItem(key: string, value: any): void {
    try {
      const storage = this.getStorage();
      if (value === null || value === undefined) {
        storage.removeItem(key);
      } else if (typeof value === 'object') {
        storage.setItem(key, JSON.stringify(value));
      } else {
        storage.setItem(key, String(value));
      }
    } catch (error) {
      console.error(`Lỗi khi setItem vào storage với key "${key}":`, error);
    }
  }

  /**
   * Lấy dữ liệu từ storage đang active
   * @param key Key lưu trữ
   */
  static getItem<T = string>(key: string): T | null {
    try {
      const value = this.getStorage().getItem(key);
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
      console.error(`Lỗi khi getItem từ storage với key "${key}":`, error);
      return null;
    }
  }

  /**
   * Xóa một key trong storage đang active
   * @param key Key cần xóa
   */
  static removeItem(key: string): void {
    try {
      this.getStorage().removeItem(key);
    } catch (error) {
      console.error(`Lỗi khi removeItem khỏi storage với key "${key}":`, error);
    }
  }

  /**
   * Xóa toàn bộ storage đang active
   */
  static clear(): void {
    try {
      this.getStorage().clear();
    } catch (error) {
      console.error('Lỗi khi clear storage:', error);
    }
  }

  // --- Các hàm helper cụ thể dành cho Authentication ---

  /**
   * Lưu token
   * @param token Token đăng nhập
   * @param remember true (mặc định) -> lưu localStorage (giữ đăng nhập); false -> lưu sessionStorage (mất khi đóng trình duyệt)
   */
  static setToken(token: string, remember: boolean = true): void {
    localStorage.setItem(STORAGE_KEYS.REMEMBER, remember ? '1' : '0');
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
    localStorage.removeItem(STORAGE_KEYS.REMEMBER);
  }
}
