import { createI18n, I18n } from 'vue-i18n'
// @ts-ignore
import messages from '/@/../src/locales/index'
import {App,nextTick} from "vue";

let i18n: I18n

/**
 * Initialize i18n
 *
 * @param app
 */
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

/**
 * Set i18n language
 *
 * @param locale
 */
export function setI18nLanguage(locale: string) {
  if (i18n.mode === 'legacy') {
    i18n.global.locale = locale
  } else {
    i18n.global.locale.value = locale
  }
}

/**
 * Load additional locale messages
 *
 * @param messages
 */
export async function loadLocaleMessages(messages: any) {
  for (const locale of Object.keys(messages)) {
    i18n.global.setLocaleMessage(locale, Object.assign(i18n.global.messages[locale], messages[locale]))
  }

  return nextTick()
}