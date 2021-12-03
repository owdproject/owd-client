import { version } from './package.json'

import messages from './src/locales'

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
    messages,
    locale: 'en',
    fallbackLocale: 'en',
  }
}