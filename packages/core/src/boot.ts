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

  constructor(context: OwdCoreBootContext) {
    this.config = context.config
    this.extensions = context.extensions

    this.app = createApp(context.component)

    // set owd context to $owd vue globalProperties
    this.app.config.globalProperties.$owd = {
      ...this.config,
      ...this.extensions
    }

    initializeApp(this)

    if (this.config.desktop?.autostart) {
      console.log('[owd] initializing desktop...')
      initializeDesktop(this)
    }

    this.mount()
  }

  initializeDesktop() {
    console.log('[owd] initializing desktop manually...')
    initializeDesktop(this)
  }

  mount() {
    this.app.mount('#app')
  }
}