export default {
  debug: false,

  // sse integration
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

  i18n: {
    locale: 'en',
    fallbackLocale: 'en',
  }
}