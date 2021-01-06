import { owdCreateStore } from './store'
import { owdCreateRouter } from './router'
import owdTerminalExtend from './lib/terminal/extend/terminalExtend.class'
import owdModulesExtend from './lib/modules/extend/modulesExtend.class'
import owdModulesDesktopExtend from "./lib/modules/extend/modulesDesktop.class";

import {App, OwdCoreBootContext, OwdCoreModulesContext} from "../../types";

// import libraries
import deviceDetector from "./plugins/deviceDetector";

// register service worker
import './lib/service-worker/registerServiceWorker'

// global components
import VIcon from "./components/shared/icon/VIcon.vue";

interface Boot {
  loaded: boolean;
  store: any;
  terminal: any;
}

export default class OwdBoot implements Boot {
  loaded: boolean = false
  store: any
  terminal: any

  constructor(context: OwdCoreBootContext) {
    try {
      this.initialize(context)
      this.loaded = true
    } catch(e) {
      console.error(e)
    }
  }

  hasLoaded(): boolean {
    return this.loaded
  }

  /**
   * Initialize OWD
   * @param context
   */
  initialize(context: OwdCoreBootContext) {
    // config
    this.initializeConfig(context);

    // global components
    this.initializeGlobalCompanents(context);

    // assets
    this.initializeAssets(context.app);

    // plugins
    this.initializePlugins(context.app);

    // router
    this.initializeRouter(context.app)

    // store
    this.store = this.initializeStore(context.app)

    // terminal
    this.terminal = this.initializeTerminal()

    this.initializeModules({
      config: context.config,
      app: context.app,
      store: this.store,
      terminal: this.terminal
    })
  }

  initializeConfig(context: OwdCoreBootContext) {
    // assign owd config to Vue app.config
    context.app.config.owd = context.config

    // assign $owd to Vue global properties
    context.app.config.globalProperties.$owd = {
      config: {
        debug: context.app.config.owd.debug,
        theme: context.app.config.owd.theme,
        icons: context.app.config.owd.icons,
        desktop: context.app.config.owd.desktop
      }
    }
  }

  initializeGlobalCompanents(context: OwdCoreBootContext) {
    // @ts-ignore / temporary VIcon (until Vuetify 3 is ready)
    context.app.component('v-icon', VIcon)
  }

  /**
   * Initialize assets
   */
  initializeAssets(app: App) {
    // import app core styles
    require('./assets/css/app.scss')

    // import app custom styles from owd-client
    require('@/assets/css/app.scss')

    // try to load custom theme styles
    try { require(`@/assets/themes/${app.config.owd.theme}/app.scss`) } catch(e) {}

    // import Oswald font with typeface
    require('@fontsource/cantarell')
    require('@fontsource/oswald')
    require('@fontsource/jetbrains-mono')

    // assign vuetify config to $vuetify
    // Vue.prototype.$vuetify = this.config.vuetify
  }

  /**
   * Initialize plugins
   *
   * @param app
   */
  initializePlugins(app: App) {
    app.use(deviceDetector)
  }

  /**
   * Initialize store
   *
   * @param app
   */
  initializeStore(app: App) {
    // create owd store
    const owdStore = owdCreateStore()

    // initialize owd store
    app.use(owdStore)

    return owdStore
  }

  /**
   * Initialize router
   *
   * @param app
   */
  initializeRouter(app: App) {
    // create owd router
    const owdRouter = owdCreateRouter(app.config.owd.routes)

    // initialize owd router
    app.use(owdRouter)
  }

  /**
   * Initialize global terminal support
   */
  initializeTerminal() {
    return new owdTerminalExtend()
  }

  /**
   * Initialize modules
   */
  initializeModules(context: OwdCoreModulesContext) {
    new owdModulesAppExtend(context)
    new owdModulesDesktopExtend(context)
  }
}