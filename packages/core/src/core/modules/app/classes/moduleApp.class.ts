import {
  OwdCoreContext,
  OwdModuleAppWindowConfig,
  OwdModuleAppInfo,
  OwdModuleAppWindowsInstances,
  OwdModuleAppSetupCommandsContext,
  OwdModuleAppCommands,
  OwdModuleAppSseEvents,
  OwdModuleAppSetupSseEventsContext,
  OwdModuleAppSetupStoreContext,
  OwdModuleAppWindowStorage,
  OwdModuleAppWindowInstance,
  OwdModuleAppSetupContext,
  OwdModuleAppSetupAssetsContext,
} from "@owd-client/types";
import {MutationPayload} from "vuex";
import {reactive} from "vue";
import ModuleAppWindow from "./moduleAppWindow.class";
import * as helperStorage from "@owd-client/core/src/helpers/helperStorage";

interface OwdModuleAppClass {
  setup(context: OwdModuleAppSetupContext): OwdModuleAppInfo;
  setupAssets?(context: OwdModuleAppSetupAssetsContext): void;
  setupCommands?(context: OwdModuleAppSetupCommandsContext): OwdModuleAppCommands
  setupSseEvents?(context: OwdModuleAppSetupSseEventsContext): OwdModuleAppSseEvents
  setupStore?(context: OwdModuleAppSetupStoreContext): void | any
  setupStoreInstance?(context: OwdModuleAppSetupStoreContext): any
}

abstract class OwdModuleAppClass {}

export default abstract class ModuleApp extends OwdModuleAppClass {
  public readonly app
  public readonly store
  public readonly terminal

  public moduleInfo: OwdModuleAppInfo;
  public moduleStore: any
  public moduleStoreConfig: any
  public moduleStoreInstance: any
  public moduleCommands: any
  public moduleSseEvents: any

  public windowInstances: OwdModuleAppWindowsInstances = reactive({})

  constructor(context: OwdCoreContext) {
    super()

    this.app = context.app
    this.store = context.store
    this.terminal = context.terminal

    if (typeof this.setup === 'function') {
      this.moduleInfo = this.setup({
        app: this.app
      })

      // initialize other module features
      this.initializeConfig()
      this.initializeStore()
      this.initializeStoreInstance()
      this.initializeWindows()
      this.initializeCommands()
      this.initializeAssets()
      this.initializeSseEvents()
    } else {
      throw new Error('Module app has no setup')
    }
  }

  /**
   * Is this module app a singleton?
   * (it doesn't allow multiple window instances)
   */
  public get isSingleton() {
    return (
      typeof this.moduleInfo.singleton === 'undefined' ||
      typeof this.moduleInfo.singleton === 'boolean' && this.moduleInfo.singleton === true
    )
  }

  /**
   * Check if store has sub-modules
   */
  public get isMultiStore(): boolean {
    return Object.prototype.hasOwnProperty.call(this.moduleStore, 'modules')
  }

  /**
   * Check if has module store instance
   */
  public hasStoreInstance() {
    if (this.moduleStoreInstance) {
      return true
    }

    return false
  }

  /**
   * Load module store config
   * (it'll be set to the vuex module state)
   */
  private initializeConfig() {
    // assign empty array to "windows" if missing in moduleInfo
    if (!Array.isArray(this.moduleInfo.windows)) {
      this.moduleInfo.windows = []
    }

    //load main moduleApp store config
    if (this.moduleInfo.config) {
      this.moduleStoreConfig = this.moduleInfo.config
    }
  }

  /**
   * Load module store
   */
  private initializeStore() {
    if (typeof this.setupStore !== 'function') {
      return false
    }

    // load module store
    this.moduleStore = this.setupStore({
      app: this.app,
      config: this.moduleInfo,
      store: this.store,
      terminal: this.terminal
    })

    if (this.moduleStore) {
      this.registerStore()

      return true
    }
  }

  /**
   * Load module assets
   */
  private initializeAssets() {
    if (typeof this.setupAssets !== 'function') {
      return false
    }

    // load module assets
    this.setupAssets({
      app: this.app,
      config: this.moduleInfo,
      store: this.store
    })
  }

  /**
   * Register module store
   */
  private registerStore() {

    // does store contain multiple vuex modules?
    // if "strict" = true, register vuex submodules using the Vuex original way
    // if "strict" = false, register vuex submodules with the OWD way
    if (this.isMultiStore && !this.moduleStore.strict) {

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

  /**
   * Load module store instance
   */
  private initializeStoreInstance() {
    // load module store instance
    if (!this.isSingleton) {
      if (typeof this.setupStoreInstance !== 'function') {
        return false
      }

      this.moduleStoreInstance = this.setupStoreInstance({
        app: this.app,
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
  public registerStoreInstance(storeName: string) {
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
  public unregisterStoreInstance(storeName: string) {
    this.store.unregisterModule(storeName)
  }

  /**
   * Load module commands
   */
  private initializeCommands() {
    if (typeof this.setupCommands !== 'function') {
      return false
    }

    // load commands
    this.moduleCommands = this.setupCommands({
      app: this.app,
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
  private initializeSseEvents(): boolean {
    if (typeof this.setupSseEvents !== 'function') {
      return false
    }

    // load events sse
    this.moduleSseEvents = this.setupSseEvents({
      app: this.app,
      config: this.moduleInfo,
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
  private initializeWindows() {
    // no module app windows? go ahead
    if (!this.moduleInfo.windows || this.moduleInfo.windows.length === 0) {
      return false
    }

    const storageWindows = helperStorage.loadStorage('window') || {}

    for (const windowConfig of this.moduleInfo.windows) {

      ModuleAppWindow.register({
        module: this,
        config: windowConfig
      })

      if (Object.prototype.hasOwnProperty.call(storageWindows, windowConfig.name)) {
        // restore previous opened windows
        this.restoreWindows(windowConfig)
      } else {
        // open it if .autoOpen is set to true
        if (windowConfig.autoOpen) {
          this.createWindow(windowConfig).open(true)
        }
      }

      // add window to store launcher

      if (debug) console.log('[owd] window initialized: ' + windowConfig.name)
    }

    return true
  }

  /**
   * Create a new window
   *
   * @param windowConfig
   * @param windowStorage
   */
  public createWindow(windowConfig: OwdModuleAppWindowConfig|string, windowStorage?: OwdModuleAppWindowStorage): OwdModuleAppWindowInstance {
    if (typeof windowConfig === 'string') {
      windowConfig = this.resolveWindowConfigByName(windowConfig)
    }

    return new ModuleAppWindow({
      module: this,
      config: windowConfig,
      storage: windowStorage
    })
  }

  /**
   * Restore windows
   *
   * @param windowConfig
   */
  public restoreWindows(windowConfig: OwdModuleAppWindowConfig) {
    const storageWindows = helperStorage.loadStorage('window') || []

    if (storageWindows) {
      if (Object.prototype.hasOwnProperty.call(storageWindows, windowConfig.name)) {
        for (const uniqueID in storageWindows[windowConfig.name]) {

          if (Object.prototype.hasOwnProperty.call(storageWindows[windowConfig.name], uniqueID)) {
            const windowStorage = storageWindows[windowConfig.name][uniqueID]

            this.createWindow(windowConfig, windowStorage).onMounted((windowInstance: OwdModuleAppWindowInstance) => {
              if (!windowStorage.minimized) {
                windowInstance.open()
              }
            })
          }

        }

        return true
      }
    }

    return false
  }

  /**
   * Resolve window config from a window name
   *
   * @param windowName
   */
  public resolveWindowConfigByName(windowName: string): OwdModuleAppWindowConfig {
    if (this.moduleInfo.windows) {
      const windowConfig = this.moduleInfo.windows.find(windowConfig => windowConfig.name === windowName)

      if (windowConfig) {
        return windowConfig
      }
    }

    throw new Error(`unable to find a window called '${windowName}'`)
  }

  /**
   * Get number of window instances for this group of windows
   *
   * @param windowName
   */
  public getWindowInstancesCount(windowName: string): number {
    if (Object.prototype.hasOwnProperty.call(this.windowInstances, windowName)) {
      return Object.keys(this.windowInstances[windowName]).length
    }

    return 0
  }

  /**
   * Get the first window instance from a window group
   *
   * @param windowName
   */
  public getFirstWindowInstance(windowName: string) {
    if (this.getWindowInstancesCount(windowName) > 0) {
      return Object.values(this.windowInstances[windowName])[0]
    }

    throw Error(`[owd] this window group doesn't have any window instance`)
  }
}