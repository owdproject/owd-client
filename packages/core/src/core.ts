import {App, createApp} from 'vue'

import {
  OwdClientConfiguration,
  OwdClientConfigurationExtensions,
  OwdCoreBootContext
} from "@owd-client/types";

import {initializeApp, initializeDesktop} from "./libraries/core/boot";

export default class Core {
  private readonly app: App
  private readonly config: OwdClientConfiguration
  private readonly extensions: OwdClientConfigurationExtensions

  private store: any
  private terminal: any

  private booted = {
    app: false,
    desktop: false
  }

  constructor(context: OwdCoreBootContext) {
    if (this.booted.app) {
      throw Error('[owd] app already initialized')
    }

    this.config = context.config
    this.extensions = context.extensions

    this.app = createApp(context.component)

    this.boot()
  }

  /**
   * Boot desktop
   * @private
   */
  private boot() {
    initializeApp(this)

    // desktop autostart (no custom login or other behaviour)
    if (this.config.desktop?.autostart) {
      if (debug) console.log('[owd] initializing desktop...')
      initializeDesktop(this)
    }

    this.app.mount('#app')
  }

  /**
   * Lazy desktop initialization
   * (with t+his.config.desktop?.autostart === false)
   */
  public initializeDesktop() {
    if (debug) console.log('[owd] initializing desktop manually...')
    initializeDesktop(this)
  }
}