// register service worker
// import './lib/service-worker/registerServiceWorker'

import owdCreateStore from './store'
import owdCreateRouter from './router'
/*
import owdTerminalExtend from './lib/terminal/extend/terminalExtend.class.js'
import owdModulesExtend from './lib/modules/extend/modulesExtend.class.js'
 */

import {createApp} from "vue";
import {OwdCoreBootContext} from "../../types";

import deviceDetector from "./plugins/deviceDetector";

interface IBoot {
  loaded: boolean
}

type App = ReturnType<typeof createApp>

export default class Boot implements IBoot {
  public loaded: boolean = false

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
    const store = this.initializeStore(context.app)
    /*
    this.router = this.initializeRouter(context.app)
    this.terminal = this.initializeTerminal(context.app)
    this.modules = this.initializeModules({
      app: context.app,
      store: this.store,
      terminal: this.terminal
    })
     */
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
    console.log(app.config)

    // create owd router
    // @ts-ignore
    const owdRouter = owdCreateRouter(app.config.owd.routes)

    // initialize owd router
    app.use(owdRouter)
  }

  /**
   * Initialize global terminal support
   */
  /*
  initializeTerminal() {
    const terminalExtend = new owdTerminalExtend()

    // pre assign terminal to $owd (for module integrations)
    // Vue.prototype.$owd = { terminal: terminalExtend }

    return new owdTerminalExtend()
  }

  initializeModules({app, store, terminal}) {
    return new owdModulesExtend({app, store, terminal})
  }
   */
}