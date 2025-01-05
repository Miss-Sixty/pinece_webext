import { createI18n } from 'vue-i18n';
import en from '../locales/en';
import zh from '../locales/zh';

export default createI18n({
  legacy: false,
  locale: navigator.language.includes('zh') ? 'zh' : 'en',
  fallbackLocale: 'en',
  messages: {
    en,
    zh
  }
}); 