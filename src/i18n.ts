import { createI18n } from 'vue-i18n';

const messages = {
  vi: {
    dashboard: 'Bảng điều khiển',
    login: 'Đăng nhập',
    logout: 'Đăng xuất',
    welcome: 'Chào mừng'
  },
  en: {
    dashboard: 'Dashboard',
    login: 'Login',
    logout: 'Logout',
    welcome: 'Welcome'
  }
};

const i18n = createI18n({
  legacy: false, // use Composition API
  locale: 'vi', // default locale
  fallbackLocale: 'en',
  messages,
});

export default i18n;
