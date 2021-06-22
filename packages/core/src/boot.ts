import {App, createApp} from 'vue'
import {
  OwdClientConfiguration,
  OwdClientConfigurationExtensions,
  OwdCoreBootContext
} from "@owd-client/types";

import { initializeDesktopStore } from './store'
import { initializeDesktopTerminal } from "./libraries/core/terminal";

import initializeAssets from "./libraries/core/assets";
import initializeModules from "./libraries/core/modules";
import {initializePlugins} from "./libraries/core/plugins";

export default class OwdBoot {
  private readonly loaded: boolean = false

  private readonly config: OwdClientConfiguration
  private readonly extensions: OwdClientConfigurationExtensions

  private readonly app: App

  private store: any
  private terminal: any

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
    // assign owd config to Vue app.config globalProperties
    this.app.config.globalProperties.$owd = this.config

    // vue store
    this.store = initializeDesktopStore({
      app: this.app,
      config: this.config.store,
      modules: this.extensions.store
    })

    // terminal
    this.terminal = initializeDesktopTerminal({
      app: this.app
    })

    // plugins
    initializePlugins(this.context)

    // global components & assets
    initializeAssets(this.context)

    // modules extend
    initializeModules(this.context)
  }

  mount() {
    this.app.mount('#app')
  }
}