import desktopConfig from "owd-theme-gnome/desktop.config"

// routes
import routesClient from './src/pages/client/routes'

// app modules
import AboutModule from "@owd-client/core/src/modules/app/about";
import DebugModule from "@owd-client/core/src/modules/app/debug";

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