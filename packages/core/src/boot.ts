import { App } from 'vue'
import {
  OwdClientConfiguration,
  OwdClientConfigurationExtensions,
  OwdCoreBootContext,
  OwdCoreModuleContext
} from "@owd-client/types";

import { owdCreateStore } from './store'
import { owdCreateI18n } from './plugins/i18n'
import { owdCreateRouter } from './plugins/router'
import { owdCreateVuetify } from './plugins/vuetify'

import owdTerminalExtend from './libraries/terminal/extend/terminalExtend'
import owdModuleAppExtend from "./libraries/module-app/extend/moduleAppExtend";
import owdModuleDesktopExtend from "./libraries/module-desktop/extend/moduleDesktopExtend";

// import plugins
import moment from "./plugins/moment";

// import basic fonts
import '@fontsource/jetbrains-mono'
import '@fontsource/cantarell'

// register service worker
import './libraries/service-worker/registerServiceWorker'

export default class OwdBoot {
  private readonly loaded: boolean = false

  private readonly config: OwdClientConfiguration
  private readonly extensions: OwdClientConfigurationExtensions
  private store: any
  private terminal: any

  constructor(context: OwdCoreBootContext) {
    this.config = context.config
    this.extensions = context.extensions

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
    this.initializeConfig(context.app)

    // assets
    this.initializeAssets(context.app)

    // plugins
    this.initializePlugins(context.app)

    // internationalization
    this.initializeInternationalization(context.app)

    // router
    this.initializeRouter(context.app)

    // store
    this.store = this.initializeStore(context.app)

    // terminal
    this.terminal = this.initializeTerminal()

    // modules extend
    this.initializeModules({
      app: context.app,
      config: context.config,
      extensions: context.extensions,
      store: this.store,
      terminal: this.terminal
    })

    // provide owd boot instance for easy access to store and terminal instances
    /*
    context.app.provide('owd', {
      config: context.config,
      store: this.store,
      terminal: this.terminal
    })
     */
  }

  initializeConfig(app: App) {
    // assign owd config to Vue app.config globalProperties
    app.config.globalProperties.$owd = this.config
  }

  /**
   * Initialize assets
   */
  initializeAssets(app: App) {
    // import core styles
    import('./assets/css/app.scss')

    // import custom theme styles from owd-client/app
    try {
      import(/* @vite-ignore */ `/@/../src/assets/themes/${this.config.ui.de}/${this.config.ui.theme}/index.scss`)
    } catch(e) {
      console.error('Error while loading theme styles')
    }

    // initialize vuetify
    app.use(owdCreateVuetify(app))

    // append desktop-environment and theme to #app classes
    const appElement = document.getElementById('app')

    appElement.setAttribute('os-name', this.config.ui.de.split('/')[0])
    appElement.setAttribute('os-version', this.config.ui.de.split('/')[1])
    appElement.setAttribute('theme', this.config.ui.theme)
  }

  /**
   * Initialize generic plugins
   *
   * @param app
   */
  initializePlugins(app: App) {
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
    const owdRouter = owdCreateRouter(this.extensions.routes)

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
  initializeModules(context: OwdCoreModuleContext) {
    new owdModuleAppExtend(context)
    new owdModuleDesktopExtend(context)
  }
}