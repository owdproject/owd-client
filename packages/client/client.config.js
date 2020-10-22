// import all pages routes
import routesMain from '@/pages/main/routes'

// modules configuration
const modulesConfig = require('@/../config/modules.json')

export default {
  routes: [
    routesMain
  ],
  modules: modulesConfig,

  // vuetify config
  vuetify: {
    rtl: false
  }
}
