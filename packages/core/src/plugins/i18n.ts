// @ts-ignore
import { createI18n } from 'vue-i18n/index'
// @ts-ignore
import messages from '@/i18n'

export const owdCreateI18n = function() {
  return createI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages
  })
}