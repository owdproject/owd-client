// import mdi icons
import '@mdi/font/css/materialdesignicons.css'

// import all pages routes
import routesMain from '@/pages/main/routes'

// import modules configuration
import modulesConfig from '@/../config/modules.json'

// active theme
const themesConfig = require('./src/assets/themes/index.js')

// types
import {OwdClientConfiguration} from "../types";

export default {
  debug: false,

  // owd theme
  theme: themesConfig.active,

  // owd routes
  routes: [
    routesMain
  ],

  // owd modules
  modules: modulesConfig,

  // owd desktop
  desktop: {
    Logo: {
      options: {
        enabled: true
      }
    },
    SystemBar: {
      modules: [
        'ApplicationMenu',
        'NotificationMenu'
      ],
      options: {
        enabled: true,
        position: 'bottom',
        modules: {
          ApplicationMenu: {
            categoryAppsTriggerType: 'mouseover'
          },
          NotificationMenu: {
            menu: {
              dateFormat: 'MMM D',
              timeFormat: 'HH:mm'
            },
            calendar: {
              header: {
                dayOfWeekFormat: 'dddd',
                dateFormat: 'MMMM D YYYY'
              }
            },
            floatingNotification: {
              max: 2,
              duration: 8000
            }
          }
        }
      }
    },
  },

  // owd icons
  icons: {
    windows: {
      minimize: 'mdi-window-minimize',
      maximize: 'mdi-window-maximize',
      close: 'mdi-window-close',
      external: 'mdi-open-in-new'
    },
    systemBar: {
      battery: 'mdi-battery',
      'battery-0': 'mdi-battery-alert-variant-outline',
      'battery-20': 'mdi-battery-20',
      'battery-40': 'mdi-battery-40',
      'battery-60': 'mdi-battery-60',
      'battery-80': 'mdi-battery-80',
      'battery-100': 'mdi-battery'
    }
  },

  // vuetify config
  vuetify: {
    rtl: false
  }
} as OwdClientConfiguration