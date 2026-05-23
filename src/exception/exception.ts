export class ApiException extends Error {
  public statusCode: number;
  public data: any;
  public timestamp: Date;

  constructor(statusCode: number, message: string, data?: any) {
    super(message);
    this.name = 'ApiException';
    this.statusCode = statusCode;
    this.data = data;
    this.timestamp = new Date();

    Object.setPrototypeOf(this, ApiException.prototype);
  }

  public static handle(error: ApiException) {
    if (typeof window !== 'undefined') {
      if (error.statusCode === 401) {
        // Thường lỗi 401 đã được xử lý (redirect) ở axios interceptor
        return;
      }
      if (error.statusCode === 403) {
        alert("Bạn không có quyền thực hiện thao tác này (Forbidden).");
        return;
      }
      if (error.statusCode >= 500) {
        alert(`Lỗi máy chủ (${error.statusCode}): ${error.message}`);
      } else {
        alert(`Lỗi ${error.statusCode}: ${error.message}`);
      }
    }
  }
}
