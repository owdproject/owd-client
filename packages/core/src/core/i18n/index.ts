import { createI18n, I18n } from 'vue-i18n'
import {nextTick} from "vue";
import CoreModule from "../core.module";

export default class CoreI18n extends CoreModule {
  private readonly instance: I18n

  constructor(ctx) {
    super(ctx)

    const config = this.config.i18n || {
      locale: 'en',
      fallbackLocale: 'en',
      messages: {}
    }

    this.instance = createI18n({
      locale: config.locale,
      fallbackLocale: config.fallbackLocale,
      messages: config.messages
    })

    this.app.use(this.instance)
  }

  /**
   * Set i18n language
   *
   * @param locale
   */
  public setLanguage(locale: string) {
    if (this.instance.mode === 'legacy') {
      this.instance.global.locale = locale
    } else {
      // @ts-ignore
      this.instance.global.locale.value = locale
    }
  }

  /**
   * Load additional locale messages
   *
   * @param messages
   */
  public loadLocaleMessages(messages: any) {
    for (const locale of Object.keys(messages)) {
      this.instance.global.setLocaleMessage(
          locale,
          Object.assign(this.instance.global.messages[locale], messages[locale])
      )
    }

    return nextTick()
  }
}