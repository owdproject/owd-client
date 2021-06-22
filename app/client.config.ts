export default {
  debug: false,

  // user interface
  ui: {
    de: 'linux/gnome',
    theme: 'adwaita-dark',
  },

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
      options: { customProperties: true },
      themes: {
        light: {
          variables: {
            primary: '#4987c1',
            secondary: '#b0bec5',
            accent: '#8c9eff',
            error: '#b71c1c'
          }
        },
        dark: {
          variables: {
            primary: '#4987c1',
            secondary: '#b0bec5',
            accent: '#8c9eff',
            error: '#b71c1c'
          }
        }
      }
    },
    rtl: false
  },

  store: {
    strict: false,
    devtools: true
  }
}