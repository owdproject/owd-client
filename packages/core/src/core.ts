import {App, createApp} from 'vue'

import {
  OwdClientConfiguration,
  OwdClientExtensions,
  OwdCoreContext
} from "@owd-client/types";
import CoreModule from "./core/core.module";

import CoreModulesApp from "./core/modules/app";
import CoreModulesDesktop from "./core/modules/desktop";
import CoreStore from "./core/store";
import CoreRouter from "./core/router";
import CorePlugins from "./core/plugins";
import CoreTerminal from "./core/terminal";
import CoreAssets from "./core/assets";
import CoreI18n from "./core/i18n";

export default class Core extends CoreModule implements OwdCoreContext {
  private readonly app: App

  private readonly config: OwdClientConfiguration
  private readonly extensions: OwdClientExtensions

  private store: any
  private router: any
  private i18n: any
  private plugins: any
  private terminal: any
  private assets: any
  private modules: { app: any, desktop: any } = {
    app: null,
    desktop: null
  }

  private booted = {
    app: false,
    desktop: false
  }

  constructor(ctx) {
    super(ctx)

    if (this.booted.app) {
      throw Error('[owd] app already initialized')
    }

    // assign client.config.ts and client.extensions.ts objects internally
    this.config = ctx.config
    this.extensions = ctx.extensions

    // create vue app
    this.app = createApp(ctx.component)

    // initialize plugins
    // (vuex, vue router and other core libraries)
    if (debug) console.log('[owd] initializing app...')

    // set owd config to $owd vue globalProperties.
    this.app.config.globalProperties.$owd = { ...this.config }

    this.store = new CoreStore(this)
    this.router = new CoreRouter(this)
    this.plugins = new CorePlugins(this)
    this.terminal = new CoreTerminal(this)
    this.assets = new CoreAssets(this)
    this.i18n = new CoreI18n(this)
    this.modules.app = new CoreModulesApp(this)
    this.modules.desktop = new CoreModulesDesktop(this)

    // mount vue app
    this.app.mount('#app')

    // app loaded
    this.booted.app = true

    if (debug) console.log('[owd] initialized app.')
  }

  /**
   * Initialize desktop
   */
  public initialize() {
    if (this.booted.desktop) {
      throw Error('[owd] desktop already initialized')
    }

    if (debug) console.log('[owd] initializing desktop...')

    // initialize store client
    this.store.dispatch('core/client/initialize')

    this.assets.initialize()
    this.modules.app.initialize()
    this.modules.desktop.initialize()

    // set desktop loaded
    this.booted.desktop = true

    if (debug) console.log('[owd] initialized desktop.')
  }

  /**
   * Terminate desktop
   */
  public terminate() {
    if (!this.booted.desktop) {
      throw Error('[owd] desktop not initialized')
    }

    if (debug) console.log('[owd] terminating desktop...')

    // terminate store client
    this.store.dispatch('core/client/terminate')

    this.assets.terminate()
    this.modules.app.terminate()
    this.modules.desktop.terminate()

    // set desktop unloaded
    this.booted.desktop = false

    if (debug) console.log('[owd] terminated desktop.')
  }
}