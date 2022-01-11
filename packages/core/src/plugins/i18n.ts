import { createI18n, I18n } from 'vue-i18n'
import {nextTick} from "vue";
import {OwdCoreContext} from "@owd-client/types";

let i18n: I18n

/**
 * Initialize i18n
 *
 * @param context
 */
export function initializeI18n(context: OwdCoreContext) {
  const config = context.config.i18n || {
    locale: 'en',
    fallbackLocale: 'en',
    messages: {}
  }

  i18n = createI18n({
    locale: config.locale,
    fallbackLocale: config.fallbackLocale,
    messages: config.messages
  })

  context.app.use(i18n)
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
    // @ts-ignore
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
    // @ts-ignore
    i18n.global.setLocaleMessage(locale, Object.assign(i18n.global.messages[locale], messages[locale]))
  }

  return nextTick()
}