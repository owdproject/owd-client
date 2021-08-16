export default {
  debug: false,

  // desktop config
  desktop: {
    autostart: true
  },

  // sse config
  sse: {
    enabled: false,
    reconnectOnError: true,
    reconnectTimeout: 5000
  },

  // vuetify config
  vuetify: {
    theme: {
      defaultTheme: 'dark',
      options: { customProperties: true }
    },
    rtl: false
  },

  // i18n config
  i18n: {
    locale: 'en',
    fallbackLocale: 'en',
  }
}