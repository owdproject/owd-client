import desktopConfig from "@owd-client/core/src/themes/midnight-black/desktop.config"

// routes
import routesMain from './src/pages/main/routes'

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
    ...routesMain,
  ],

  plugins: [],

  store: {}
}