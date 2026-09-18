import i18n from '../i18n';

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
      const { t } = i18n.global;
      if (error.statusCode === 401) {
        // Thường lỗi 401 đã được xử lý (redirect) ở axios interceptor
        return;
      }
      if (error.statusCode === 403) {
        alert(t('common.forbidden'));
        return;
      }
      if (error.statusCode >= 500) {
        alert(t('common.serverErrorWithCode', { code: error.statusCode, message: error.message }));
      } else {
        alert(t('common.errorWithCode', { code: error.statusCode, message: error.message }));
      }
    }
  }
}
