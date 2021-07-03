import desktopConfig from "@owd-client/core/src/modules/desktop/linux/gnome/desktop.config"

// routes
import routesMain from './src/pages/main/routes'

// app modules
import AboutModule from "@owd-client/core/src/modules/app/about";
import DebugModule from "@owd-client/core/src/modules/app/debug";

export default {
  app: {
    modules: [
      AboutModule,
      DebugModule
    ]
  },

  desktop: desktopConfig,

  routes: [
    ...routesMain,
  ],

  plugins: [],

  store: {}
}