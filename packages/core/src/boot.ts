// register service worker
// import './lib/service-worker/registerServiceWorker'

import owdCreateStore from './store'
import owdCreateRouter from './router'
import owdTerminalExtend from './lib/terminal/extend/terminalExtend.class'
import owdModulesExtend from './lib/modules/extend/modulesExtend.class'

import {App, OwdCoreBootContext, OwdCoreModulesContext} from "../../types";

import deviceDetector from "./plugins/deviceDetector";

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

  /**
   * Initialize OWD
   * @param context
   */
  initialize(context: OwdCoreBootContext) {
    // config
    this.initializeConfig(context);

    // assets
    this.initializeAssets();

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
        icons: context.app.config.owd.icons
      }
    }
  }

  /**
   * Initialize assets
   */
  initializeAssets() {
    // import app core styles
    require('./assets/css/app.scss')

    // import app custom styles from owd-client
    require('@/assets/css/app.scss')

    // import Oswald font with typeface
    require('typeface-oswald')

    // import Jetbrains Mono font with typeface
    require('typeface-jetbrains-mono')

    // assign vuetify config to $vuetify
    // Vue.prototype.$vuetify = this.config.vuetify
  }

  initializePlugins(app: App) {
    app.use(deviceDetector)
  }

  initializeStore(app: App) {
    // create owd store
    const owdStore = owdCreateStore()

    // initialize owd store
    app.use(owdStore)

    return owdStore
  }

  initializeRouter(app: App) {
    // create owd router
    // @ts-ignore
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
    return new owdModulesExtend(context)
  }
}