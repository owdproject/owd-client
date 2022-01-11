import {App, createApp} from 'vue'

import {
  OwdClientConfiguration,
  OwdClientConfigurationExtensions,
  OwdCoreBootContext
} from "@owd-client/types";

import {initializeApp, initializeDesktop, terminateDesktop} from "./core/boot";
import {EventEmitter} from "./core/event-emitter";

export default class Core extends EventEmitter {
  readonly app: App
  readonly config: OwdClientConfiguration
  readonly extensions: OwdClientConfigurationExtensions

  store: any
  terminal: any

  booted = {
    app: false,
    desktop: false
  }

  constructor(context: OwdCoreBootContext) {
    super()

    if (this.booted.app) {
      throw Error('[owd] app already initialized')
    }

    // assign client.config.ts and client.extensions.ts objects internally
    this.config = context.config
    this.extensions = context.extensions

    // create vue app
    this.app = createApp(context.component)

    // load essential libraries
    initializeApp(this)
  }

  /**
   * Initialize desktop
   */
  public initialize() {
    if (debug) console.log('[owd] initializing desktop...')
    initializeDesktop(this)
  }

  /**
   * Terminate desktop
   */
  public terminate() {
    if (debug) console.log('[owd] terminating desktop...')
    terminateDesktop(this)
  }
}