import {
  OwdModule,
  OwdModuleContext,
  OwdModuleCommands,
  OwdModuleWindowConfig,
  OwdModuleSseEvents, OwdModuleInfo
} from "../../../../types";
import {MutationPayload, Store} from "vuex";
import merge from 'lodash.merge'

export default abstract class Module implements OwdModule {
  private readonly app
  private readonly store
  private readonly terminal

  public moduleInfo: OwdModuleInfo;
  public moduleStore: any
  public moduleStoreConfig: any
  public moduleStoreInstance: any

  public windowsInstances: any

  constructor(context: OwdModuleContext) {
    this.moduleInfo = context.moduleInfo
    this.app = context.app
    this.store = context.store
    this.terminal = context.terminal

    this.windowsInstances = {}

    this.checkModuleInfo(context.moduleInfo)
    this.loadModuleStoreConfig()
    this.loadModuleStore()
    this.loadModuleStoreInstance()
    this.loadModuleWindowComponents()
    this.loadModuleCommands()
    this.loadModuleSseEvents()
  }

  abstract loadAssets(): void
  abstract loadCommands(context: {
    store: Store<any>,
    terminal: any
  }): OwdModuleCommands
  abstract loadSseEvents(context: {
    store: Store<any>,
    terminal: any
  }): OwdModuleSseEvents
  abstract loadStore(): void
  abstract loadStoreInstance(context: {
    store: Store<any>,
    terminal: any
  }): void

  /**
   * Check module dependencies (todo)
   */
  checkDependencies() {}

  /**
   * Parse module info to fix errors or missing values
   */
  checkModuleInfo(moduleInfo: OwdModuleInfo) {
    this.moduleInfo = moduleInfo

    if (this.moduleInfo.windows) {
      let i = 0;
      for (const moduleWindow of this.moduleInfo.windows) {
        if (!moduleWindow.titleShort) {
          // titleShort always available
          this.moduleInfo.windows[i].titleShort = moduleWindow.title
        }
      }
    }
  }

  // ### MODULE ASSETS

  /**
   * Load module assets
   */
  loadModuleAssets() {
    // load module assets
    if (typeof this.loadAssets === 'function') {
      this.loadAssets()
    }
  }

  // ### MODULE STORE

  /**
   * Load module store
   */
  loadModuleStore() {
    // load module store
    if (typeof this.loadStore === 'function') {
      this.moduleStore = this.loadStore()
      this.registerModuleStore()
    }
  }

  /**
   * Register module store
   */
  registerModuleStore() {
    let moduleStore = this.moduleStore
    let moduleStoreMerge = {
      namespaced: true,
      state: null
    }

    if (this.moduleStoreConfig) {
      moduleStoreMerge = {
        namespaced: true,
        state: this.moduleStoreConfig
      }
    }

    // register store to Vuex
    this.store.registerModule(this.moduleInfo.name, merge(
      moduleStore,
      moduleStoreMerge
    ))
  }

  // ### MODULE STORE INSTANCE

  /**
   * Load module store instance
   */
  loadModuleStoreInstance() {
    // load module store instance
    if (!this.moduleInfo.singleton) {
      if (typeof this.loadStoreInstance === 'function') {
        this.moduleStoreInstance = this.loadStoreInstance({
          store: this.store,
          terminal: this.terminal
        })
      }
    }
  }

  /**
   * Register module store instance
   *
   * @param storeName
   */
  public registerModuleStoreInstance(storeName: string) {
    const storeModule = {
      namespaced: true,
      ...this.moduleStoreInstance
    }

    // we initialize the new dynamic module in the global store:
    this.store.registerModule(storeName, storeModule)
  }

  /**
   * Destroy module store instance
   *
   * @param storeName
   */
  public unregisterModuleStoreInstance(storeName: string) {
    this.store.unregisterModule(storeName)
  }

  // ### MODULE STORE CONFIG

  /**
   * Load module store config
   */
  loadModuleStoreConfig() {
    if (this.moduleInfo.config) {
      this.moduleStoreConfig = this.loadModuleStoreConfigFile();
    }
  }

  /**
   * Load module store config from config.json
   * @returns {*}
   */
  loadModuleStoreConfigFile() {
    if (this.moduleInfo.config) {
      try {
        return require('@/../config/' + this.moduleInfo.name + '/config.json')
      } catch(e) {
        console.error(`[OWD] Unable to load "/modules/${this.moduleInfo.name}/config.json"`, e)
      }
    }

    return null
  }

  // ### MODULE COMMANDS

  /**
   * Load module commands
   */
  loadModuleCommands() {
    // load commands
    if (typeof this.loadCommands === 'function') {
      const moduleCommands = this.loadCommands({
        store: this.store,
        terminal: this.terminal
      })

      // register commands to OWD global terminal commands
      if (moduleCommands) {
        for (const commandName in moduleCommands) {
          if (Object.prototype.hasOwnProperty.call(moduleCommands, commandName))
            this.terminal.addCommand(commandName, moduleCommands[commandName])
        }
      }
    }
  }

  // ### MODULE SSE EVENTS

  /**
   * Load module SSE events
   */
  loadModuleSseEvents() {
    // load events sse
    if (typeof this.loadSseEvents === 'function') {
      const moduleSseEvents = this.loadSseEvents({
        store: this.store,
        terminal: this.terminal
      })

      const moduleSseEventsKeys = Object.keys(moduleSseEvents);

      this.store.subscribe((mutation: MutationPayload) => {
        if (mutation.type === 'core/sse/LOG_EVENT') {
          const event = mutation.payload

          if (moduleSseEventsKeys.includes(event.name)) {
            if (typeof moduleSseEvents[event.name] === 'function') moduleSseEvents[event.name](event.data)
          }
        }
      })
    }
  }

  /**
   * Register module window components
   */
  loadModuleWindowComponents() {
    // load all module window components
    if (Array.isArray(this.moduleInfo.windows)) {
      this.moduleInfo.windows.forEach((windowConfig: OwdModuleWindowConfig) => {
        if (!windowConfig.name) {
          if (this.app.config.debug) console.error(`[OWD] Component name is missing in ${windowConfig.name}.`)

          return false
        }

        this.registerModuleWindowComponent(windowConfig.name)
      })
    }
  }

  private registerModuleWindowComponent(windowName: string) {
    try {
      const windowComponent = require('@/../src/modules/' + this.moduleInfo.name + '/windows/' + windowName + '.vue').default

      if (windowComponent) {
        // sync vue component registration
        // todo make it async with defineAsyncComponent
        this.app.component(windowName, windowComponent)
      }
    } catch(e) {
      if (this.app.config.debug) console.error(`[OWD] Unable to load "/modules/${this.moduleInfo.name}/windows/${windowName}.vue"`, e)
    }
  }
}