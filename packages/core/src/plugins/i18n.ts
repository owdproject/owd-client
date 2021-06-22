// @ts-ignore
import { createI18n, I18n } from 'vue-i18n'
// @ts-ignore
import messages from '/@/../src/locales/index'
import {OwdCoreI18nContext} from "@owd-client/types";

let i18n: I18n

export function initializeDesktopI18n(context: OwdCoreI18nContext) {
  i18n = createI18n({
    locale: context.config.locale,
    fallbackLocale: context.config.fallbackLocale,
    messages
  })

  context.app.use(i18n)
}