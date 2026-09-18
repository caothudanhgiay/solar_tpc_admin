import i18n from '../i18n';

export class AppError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }

  public static handle(error: any) {
    if (typeof window !== 'undefined') {
      const { t } = i18n.global;
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        alert(t('common.connectionError'));
      } else if (error instanceof AppError) {
        alert(error.message);
      } else {
        alert(error?.message || t('common.systemError'));
      }
    }
  }
}
