import {App, createApp} from 'vue'
import {
  OwdClientConfiguration,
  OwdClientConfigurationExtensions,
  OwdCoreBootContext
} from "@owd-client/types";

import {initializeDesktopStore} from './store'
import {initializeDesktopTerminal} from "./libraries/core/terminal";
import {initializeDesktopI18n} from "./plugins/i18n";
import {initializeDesktopRouter} from "./plugins/router";

import {initializeAssets} from "./libraries/core/assets";
import {initializeAppModules, initializeDesktopModules} from "./libraries/core/modules";
import {initializePlugins} from "./libraries/core/plugins";

export default class OwdBoot {
  private readonly loaded: boolean = false

  private readonly config: OwdClientConfiguration
  private readonly extensions: OwdClientConfigurationExtensions

  private readonly app: App

  private store: any
  private terminal: any
  private modulesApp: any
  private modulesDesktop: any

  constructor(context: OwdCoreBootContext) {
    this.config = context.config
    this.extensions = context.extensions

    this.app = createApp(context.component)

    this.initialize()
    this.mount()
  }

  hasLoaded(): boolean {
    return this.loaded
  }

  get context() {
    return {
      app: this.app,
      config: this.config,
      extensions: this.extensions,
      store: this.store,
      terminal: this.terminal
    }
  }

  /**
   * Initialize OWD
   */
  initialize() {
    this.app.config.globalProperties.$owd = this.config

    this.store = initializeDesktopStore({
      app: this.app,
      modules: this.extensions.store
    })

    this.terminal = initializeDesktopTerminal()

    initializeDesktopRouter({
      app: this.app,
      routes: this.extensions.routes
    })

    initializePlugins({
      app: this.app,
      plugins: this.extensions.plugins
    })

    initializeDesktopI18n(this.app)
    initializeAssets({
      app: this.app,
      extensions: this.extensions
    })

    this.modulesApp = initializeAppModules({
      app: this.app,
      extensions: this.extensions,
      store: this.store,
      terminal: this.terminal
    })

    this.modulesDesktop = initializeDesktopModules({
      app: this.app,
      extensions: this.extensions,
      store: this.store,
      terminal: this.terminal
    })
  }

  mount() {
    this.app.mount('#app')
  }
}