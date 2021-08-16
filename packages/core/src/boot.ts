import {App, createApp} from 'vue'
import {
  OwdClientConfiguration,
  OwdClientConfigurationExtensions,
  OwdCoreBootContext
} from "@owd-client/types";

import {initializeAppStore} from './store'
import {initializeAppI18n} from "./plugins/i18n";
import {initializeAppRouter} from "./plugins/router";
import {initializeAppPlugins} from "./libraries/core/plugins";
import {initializeAppAssets, initializeDesktopAssets} from "./libraries/core/assets";
import {initializeDesktopApps, initializeDesktopModules} from "./libraries/core/modules";
import {initializeDesktopTerminal} from "./libraries/core/terminal";

export default class OwdBoot {
  private readonly loaded: {
    app: boolean,
    desktop: boolean
  } = {
    app: false,
    desktop: false
  }

  private readonly config: OwdClientConfiguration
  private readonly extensions: OwdClientConfigurationExtensions

  private readonly app: App

  private store: any
  private terminal: any

  constructor(context: OwdCoreBootContext) {
    this.config = context.config
    this.extensions = context.extensions

    this.app = createApp(context.component)
    this.app.config.globalProperties.$owd = this.config

    this.initializeApp()

    if (!!this.config.desktop?.autostart) {
      this.initializeDesktop()
    }

    this.mount()
  }

  isAppLoaded(): boolean {
    return this.loaded.app
  }

  isDesktopLoaded(): boolean {
    return this.loaded.desktop
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
   * Initialize app
   */
  initializeApp() {
    if (this.loaded.app) {
      return false
    }

    console.log('[owd] app initializing...')

    this.store = initializeAppStore({
      app: this.app,
      modules: this.extensions.store
    })

    initializeAppRouter({
      app: this.app,
      routes: this.extensions.routes
    })

    initializeAppPlugins({
      app: this.app,
      plugins: this.extensions.plugins
    })

    initializeAppI18n(this.app)
    initializeAppAssets({
      app: this.app,
      extensions: this.extensions
    })

    this.loaded.app = true
    console.log('[owd] app initialized.')
  }

  /**
   * Initialize desktop
   */
  initializeDesktop() {
    if (this.loaded.desktop) {
      return false
    }

    console.log('[owd] desktop initializing...')

    this.terminal = initializeDesktopTerminal()

    initializeDesktopAssets({
      app: this.app,
      extensions: this.extensions
    })

    initializeDesktopApps({
      app: this.app,
      extensions: this.extensions,
      store: this.store,
      terminal: this.terminal
    })

    initializeDesktopModules({
      app: this.app,
      extensions: this.extensions,
      store: this.store,
      terminal: this.terminal
    })

    this.loaded.desktop = true
    console.log('[owd] desktop initialized.')
  }

  mount() {
    this.app.mount('#app')
  }
}