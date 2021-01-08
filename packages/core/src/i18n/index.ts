import { createI18n } from 'vue-i18n'
import messages from '@/i18n/index';

export const owdCreateI18n = function() {
  return createI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages
  })
}