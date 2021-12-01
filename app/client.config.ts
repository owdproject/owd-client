import { version } from './package.json'

export default {
  debug: true,

  name: 'owd-client',
  hostname: 'owdproject.org',
  version,

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

  // i18n config
  i18n: {
    locale: 'en',
    fallbackLocale: 'en',
  }
}