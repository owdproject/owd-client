// theme
import GnomeTheme from "owd-theme-gnome/desktop.config"

// routes
import routesClient from './src/pages/client/routes'

// app modules
import AboutModule from "owd-app-about/client"
import DebugModule from "owd-app-debug/client"

export default {
  modules: {
    app: [
      AboutModule,
      DebugModule,
    ],
    desktop: []
  },

  // desktop theme
  theme: GnomeTheme,

  routes: [
    ...routesClient,
  ],

  plugins: [],

  store: {}
}