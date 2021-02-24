import { owdCreateStore } from './store'
import { owdCreateRouter } from './router'
import { owdCreateI18n } from './i18n'
import owdTerminalExtend from './libraries/terminal/extend/terminalExtend.class'
import owdModulesAppExtend from './libraries/modules-app/extend/modulesAppExtend.class'
import owdModulesDesktopExtend from "./libraries/modules-desktop/extend/modulesDesktopExtend.class";

import {App, OwdCoreBootContext, OwdCoreModulesContext} from "@owd-client/types";

// import plugins
import moment from "./plugins/moment";
import deviceDetector from "./plugins/deviceDetector";

// register service worker
import './libraries/service-worker/registerServiceWorker'

// global components
import VIcon from "./components/shared/icon/VIcon.vue";

interface Boot {
  store: any;
  terminal: any;
}

export default class OwdBoot implements Boot {
  private readonly loaded: boolean = false
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
   *
   * @param context
   */
  initialize(context: OwdCoreBootContext) {
    // config
    this.initializeConfig(context)

    // global components
    this.initializeGlobalCompanents(context)

    // assets
    this.initializeAssets(context.app)

    // plugins
    this.initializePlugins(context.app)

    // internationalization
    this.initializeRouter(context.app)

    // router
    this.initializeInternationalization(context.app)

    // store
    this.store = this.initializeStore(context.app)

    // terminal
    this.terminal = this.initializeTerminal()

    // modules extend
    this.initializeModules({
      config: context.config,
      app: context.app,
      store: this.store,
      terminal: this.terminal
    })

    // provide owd boot instance for easy access to store and terminal instances
    context.app.provide('owd', {
      config: context.config,
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
        desktop: context.app.config.owd.desktop,
        sse: context.app.config.owd.sse
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
    const themeName = app.config.owd.theme

    // import app core styles
    require('./assets/css/app.scss')

    // import app custom styles from owd-client
    require('@/assets/css/app.scss')

    // try to load custom theme styles
    try {
      require(`@/assets/themes/${themeName}/app.scss`)
    } catch(e) {
      console.error(`[OWD] Error while loading "${themeName}" theme app.scss`)
    }

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
    app.use(moment)
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
   * Initialize internationalization
   *
   * @param app
   */
  initializeInternationalization(app: App) {
    const i18n = owdCreateI18n()

    app.use(i18n)
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