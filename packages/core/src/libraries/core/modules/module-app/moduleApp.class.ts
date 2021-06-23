import {
  OwdModuleAppContext,
  OwdModuleAppWindowConfig,
  OwdModuleAppInfo,
  OwdModuleAppWindowsInstances,
  OwdModuleAppSetupCommandsContext,
  OwdModuleAppCommands,
  OwdModuleAppSseEvents,
  OwdModuleAppSetupSseEventsContext,
  OwdModuleAppSetupStoreContext,
  OwdModuleAppWindowsStorage,
  OwdModuleAppWindowCreateInstanceData, OwdModuleAppWindowStorage,
} from "@owd-client/types";
import {MutationPayload} from "vuex";
import {Component} from "vue";

interface OwdModuleAppClass {
  setup(): OwdModuleAppInfo;
  setupAssets?(): void;
  setupCommands?(context: OwdModuleAppSetupCommandsContext): OwdModuleAppCommands
  setupSseEvents?(context: OwdModuleAppSetupSseEventsContext): OwdModuleAppSseEvents
  setupStore?(context: OwdModuleAppSetupStoreContext): void | any
  setupStoreInstance?(context: OwdModuleAppSetupStoreContext): any
}

abstract class OwdModuleAppClass {}

export default abstract class ModuleApp extends OwdModuleAppClass {
  private readonly app
  private readonly store
  private readonly terminal

  public readonly moduleInfo: OwdModuleAppInfo;
  public moduleStore: any
  public moduleStoreConfig: any
  public moduleStoreInstance: any
  public moduleCommands: any
  public moduleSseEvents: any

  public windowInstances: OwdModuleAppWindowsInstances = {}

  constructor(context: OwdModuleAppContext) {
    super()

    this.app = context.app
    this.store = context.store
    this.terminal = context.terminal

    this.moduleInfo = this.initializeModuleApp()

    this.initializeModuleStoreConfig()
    this.initializeModuleStore()
    this.initializeModuleStoreInstance()
    this.initializeModuleWindowComponents()
    this.initializeModuleCommands()
    this.initializeModuleAssets()
    this.initializeModuleSseEvents()
  }

  public get isSingleton() {
    return (
      typeof this.moduleInfo.singleton === 'undefined' ||
      typeof this.moduleInfo.singleton === 'boolean' && this.moduleInfo.singleton === true
    )
  }

  /**
   * Load module assets
   */
  private initializeModuleAssets() {
    if (typeof this.setupAssets !== 'function') {
      return false
    }

    // load module assets
    this.setupAssets()
  }

  /**
   * Load module store
   */
  private initializeModuleStore() {
    if (typeof this.setupStore !== 'function') {
      return false
    }

    // load module store
    this.moduleStore = this.setupStore({
      config: this.moduleInfo,
      store: this.store
    })

    if (this.moduleStore) {
      this.registerModuleStore()

      return true
    }

    throw Error('Unable to intialize module store')
  }

  /**
   * Check if store has sub-modules
   * @private
   */
  private get isModuleMultiStore(): boolean {
    return Object.prototype.hasOwnProperty.call(this.moduleStore, 'modules')
  }

  /**
   * Register module store
   */
  registerModuleStore() {

    // does store contain multiple vuex modules?
    // if "strict" = true, register vuex submodules using the Vuex original way
    // if "strict" = false, register vuex submodules with the OWD way
    if (this.isModuleMultiStore && !this.moduleStore.strict) {

      // list of vuex modules of this OWD Module
      const owdModuleMultiStoreModules = this.moduleStore.modules

      // get names of these vuex modules
      const owdModuleMultiStoreModuleNames = Object.keys(owdModuleMultiStoreModules)

      if (owdModuleMultiStoreModuleNames.length > 0) {

        // for each vuex module of this OWD Module
        for (const storeName of owdModuleMultiStoreModuleNames) {

          const storeModule = {

            // import vuex store
            ...owdModuleMultiStoreModules[storeName],

            // set namespaced as true
            namespaced: true

          }

          if (
            this.moduleStoreConfig && this.moduleStoreConfig.modules &&
            Object.prototype.hasOwnProperty.call(this.moduleStoreConfig.modules, storeName)
          ) {

            // add store state from moduleStoreConfig
            storeModule.state = {
              ...storeModule.state,
              ...this.moduleStoreConfig.modules[storeName]
            }
          }

          // register store to Vuex
          this.store.registerModule(storeName, storeModule)
        }
      }

    } else {

      // import single store module with basic config (if available)
      this.store.registerModule(this.moduleInfo.name, {
        // import vuex store
        ...this.moduleStore,

        state: {
          // import default state
          ...this.moduleStore.state,

          // import basic config into state
          ...this.moduleStoreConfig || {},
        },

        // set namespaced as true
        namespaced: true
      })

    }

    return true
  }

  // ### MODULE STORE INSTANCE

  /**
   * Load module store instance
   */
  private initializeModuleStoreInstance() {
    // load module store instance
    if (!this.moduleInfo.singleton) {
      if (typeof this.setupStoreInstance !== 'function') {
        return false
      }

      this.moduleStoreInstance = this.setupStoreInstance({
        config: this.moduleInfo,
        store: this.store,
        terminal: this.terminal
      })
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

  /**
   * Check if has module store instance
   */
  public hasModuleStoreInstance() {
    if (this.moduleStoreInstance) {
      return true
    }

    return false
  }

  // ### MODULE INFO
  initializeModuleApp() {
    if (this.setup) {
      return this.setup()
    }

    throw new Error('Module app has no setup')
  }

  // ### MODULE STORE CONFIG

  /**
   * Load module store config
   */
  private initializeModuleStoreConfig() {
    if (this.moduleInfo.config) {
      this.moduleStoreConfig = this.moduleInfo.config
    }
  }

  // ### MODULE COMMANDS

  /**
   * Load module commands
   */
  private initializeModuleCommands() {
    if (typeof this.setupCommands !== 'function') {
      return false
    }

    // load commands
    this.moduleCommands = this.setupCommands({
      config: this.moduleInfo,
      store: this.store,
      terminal: this.terminal
    })

    // register commands to OWD global terminal commands
    if (this.moduleCommands) {
      for (const commandName in this.moduleCommands) {
        if (Object.prototype.hasOwnProperty.call(this.moduleCommands, commandName)) {
          this.terminal.addCommand(commandName, this.moduleCommands[commandName])
        }
      }
    }
  }

  // ### MODULE SSE EVENTS

  /**
   * Load module SSE events
   */
  private initializeModuleSseEvents(): boolean {
    if (typeof this.setupSseEvents !== 'function') {
      return false
    }

    // load events sse
    if (typeof this.loadSseEvents === 'function') {
      const moduleSseEvents = this.loadSseEvents({
        store: this.store,
        terminal: this.terminal
      })

    const moduleSseEventsKeys = Object.keys(this.moduleSseEvents);

    // run sse event
    this.store.subscribe((mutation: MutationPayload) => {
      if (mutation.type === 'core/sse/LOG_EVENT') {
        const event = mutation.payload

        if (moduleSseEventsKeys.includes(event.name)) {
          if (typeof this.moduleSseEvents[event.name] === 'function') this.moduleSseEvents[event.name](event.data)
        }
      }
    })

    return true
  }

  /**
   * Register module window components
   */
  private initializeModuleWindowComponents() {
    if (!Array.isArray(this.moduleInfo.windows)) {
      return false
    }

    // load all module window components
    this.moduleInfo.windows.forEach((windowConfig: OwdModuleAppWindowConfig) => {
      if (!windowConfig.name) {
        if (this.app.config.globalProperties.$owd.debug) {
          console.error(`[owd] Component name is missing in ${windowConfig.name}.`)
        }

        return false
      }

      // vue component sync registration
      this.registerWindowComponent(windowConfig.name, windowConfig.component)
    })

    return true
  }

  public registerWindowComponent(name: string, component: Component) {
    this.app.component(name, component)
  }
}