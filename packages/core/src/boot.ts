import {App, createApp} from 'vue'
import {
  OwdClientConfiguration,
  OwdClientConfigurationExtensions,
  OwdCoreBootContext
} from "@owd-client/types";
import {initializeApp, initializeDesktop} from "./libraries/core/boot";

export default class OwdBoot {
  private readonly app: App
  private readonly config: OwdClientConfiguration
  private readonly extensions: OwdClientConfigurationExtensions

  private store: any
  private terminal: any

  private stats = {
    loaded: { app: false, desktop: false }
  }

  constructor(context: OwdCoreBootContext) {
    this.config = context.config
    this.extensions = context.extensions

    this.app = createApp(context.component)

    // set owd context to $owd vue globalProperties
    this.app.config.globalProperties.$owd = { ...this.config }

    if (this.stats.loaded.app) {
      throw Error('[owd] app already initialized')
    }

    initializeApp(this)

    if (this.config.desktop?.autostart) {
      if (debug) console.log('[owd] initializing desktop...')
      initializeDesktop(this)
    }

    this.mount()
  }

  initializeDesktop() {
    if (debug) console.log('[owd] initializing desktop manually...')
    initializeDesktop(this)
  }

  mount() {
    this.app.mount('#app')
  }
}