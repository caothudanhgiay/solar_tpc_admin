import { createI18n } from 'vue-i18n';
import vi from './locales/vi.json';
import en from './locales/en.json';

const messages = {
  vi,
  en
};

const i18n = createI18n({
  legacy: false, // use Composition API
  locale: 'vi', // default locale
  fallbackLocale: 'en',
  messages,
});

export default i18n;
