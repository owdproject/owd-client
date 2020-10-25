// import all pages routes
import routesMain from '@/pages/main/routes'

// import modules configuration
import modulesConfig from '@/../config/modules.json'

export default {
  debug: false,

  // owd routes
  routes: [
    routesMain
  ],

  // owd modules
  modules: modulesConfig,

  // vuetify config
  vuetify: {
    rtl: false
  }
}
