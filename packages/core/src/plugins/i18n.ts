// @ts-ignore
import { createI18n, I18n } from 'vue-i18n/index'
// @ts-ignore
import messages from '/@/../src/locales/index'
import {App} from "vue";

let i18n: I18n

export function initializeAppI18n(app: App) {
  const config = app.config.globalProperties.$owd.i18n || {
    locale: 'en',
    fallbackLocale: 'en',
  }

  i18n = createI18n({
    locale: config.locale,
    fallbackLocale: config.fallbackLocale,
    messages
  })

  app.use(i18n)
}