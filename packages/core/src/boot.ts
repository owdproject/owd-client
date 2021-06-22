import {App, createApp} from 'vue'
import {
  OwdClientConfiguration,
  OwdClientConfigurationExtensions,
  OwdCoreBootContext
} from "@owd-client/types";

import { owdCreateStore } from './store'

import initializeAssets from "./libraries/core/assets";
import initializeModules from "./libraries/core/modules";
import initializeTerminal from "./libraries/core/terminal";
import {initializePlugins} from "./libraries/core/plugins";

export default class OwdBoot {
  private readonly loaded: boolean = false

  private readonly config: OwdClientConfiguration
  private readonly extensions: OwdClientConfigurationExtensions

  private readonly app: App

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

  /**
   * Initialize OWD
   *
   * @param context
   */
  initialize(context: OwdCoreBootContext) {
    // assign owd config to Vue app.config globalProperties
    this.app.config.globalProperties.$owd = this.config

    // store
    context.store = this.initializeStore(context.app)

    // terminal
    context.terminal = initializeTerminal()

    // plugins
    initializePlugins(context)

    // global components & assets
    initializeAssets(context)

    // modules extend
    initializeModules(context)
  }

  mount() {
    this.app.mount('#app')
  }
}