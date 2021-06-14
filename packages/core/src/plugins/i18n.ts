// @ts-ignore
import { createI18n } from 'vue-i18n/index'
// @ts-ignore
import messages from '/@/../src/i18n/index.ts'

export function owdCreateI18n() {
  return createI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages
  })
}