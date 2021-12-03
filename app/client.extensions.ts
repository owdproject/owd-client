import desktopConfig from "owd-theme-gnome/desktop.config"

// routes
import routesClient from './src/pages/client/routes'

// app modules
import AboutModule from "owd-app-about/client/index";
import DebugModule from "owd-app-debug/client/index";

export default {
  desktop: desktopConfig,

  modules: {
    app: [
      AboutModule,
      DebugModule
    ],
    desktop: []
  },

  routes: [
    ...routesClient,
  ],

  plugins: [],

  store: {}
}