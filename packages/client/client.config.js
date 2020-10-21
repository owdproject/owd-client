import '@mdi/font/css/materialdesignicons.css'

// import all pages routes
import routesMain from '@/pages/main/routes'

// merge all pages routes into an unique pages array
const pages = [].concat(
  routesMain
)

// modules configuration
const modulesConfig = require(`@/../config/modules.json`)

export default {
  pages,
  plugins: [],
  modules: modulesConfig,
}
