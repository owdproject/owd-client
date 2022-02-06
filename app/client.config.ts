import { version } from './package.json'

// locales
import messages from './src/locales'

export default {
  name: 'owd-client',
  hostname: 'owdproject.org',
  version,

  dev: true,

  // desktop internationalization config
  i18n: {
    messages,
    locale: 'en',
    fallbackLocale: 'en',
  },

  // desktop server-sent events config
  sse: {
    enabled: false,
    reconnectOnError: true,
    reconnectTimeout: 5000
  },
}