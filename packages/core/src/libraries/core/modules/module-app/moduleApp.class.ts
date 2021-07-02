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
  OwdModuleAppWindowStorage, OwdModuleAppWindowInstance, OwdModuleAppSetupContext, OwdModuleAppSetupAssetsContext,
} from "@owd-client/types";
import {MutationPayload} from "vuex";
import {markRaw} from "vue";
import ModuleAppWindow from "./moduleAppWindow.class";

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

    if (!this.moduleInfo.windows) {
      this.moduleInfo.windows = []
    }

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
    this.setupAssets({
      app: this.app,
      config: this.moduleInfo,
      store: this.store
    })
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
      app: this.app,
      config: this.moduleInfo,
      store: this.store,
      terminal: this.terminal
    })

    if (this.moduleStore) {
      this.registerModuleStore()

      return true
    }
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
      let moduleInfo = this.setup({
        app: this.app
      })

      if (moduleInfo.windows) {
        moduleInfo.windows.forEach(window => {
          window.component = markRaw(window.component)
        })
      }

      return moduleInfo
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
  private initializeModuleSseEvents(): boolean {
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
  private initializeModuleWindowComponents() {
    return true
  }

  /**
   * Add a new window (just register it),
   * instead of declaring it statically from the module conf
   *
   * @param config
   * @param storage
   */
  public addWindow(config: OwdModuleAppWindowConfig|string, storage?: OwdModuleAppWindowStorage): OwdModuleAppWindowInstance {
    if (typeof config === 'string') {
      config = this.resolveWindowConfigByName(config)
    }

    return new ModuleAppWindow({
      module: this,
      config: config,
      storage: storage
    })
  }

  /**
   * Restore windows or create a new one
   *
   * @param config
   */
  public restoreOrAddWindow(config: OwdModuleAppWindowConfig|string): OwdModuleAppWindowInstance {
    if (typeof config === 'string') {
      config = this.resolveWindowConfigByName(config)
    }

    const windowInstance = this.addWindow(config)

    if (windowInstance) {
      windowInstance.restore()
    }

    return windowInstance
  }

  /**
   * Create a new window
   *
   * @param config
   * @param storage
   */
  public createWindow(config: OwdModuleAppWindowConfig|string, storage?: OwdModuleAppWindowStorage): OwdModuleAppWindowInstance {
    if (typeof config === 'string') {
      config = this.resolveWindowConfigByName(config)
    }

    const instance = this.addWindow(config, storage)

    if (instance) {
      instance.create()
      instance.open(true)
    }

    return instance
  }

  /**
   * Restore windows or create a new one
   *
   * @param config
   */
  public restoreOrCreateWindow(config: OwdModuleAppWindowConfig|string): OwdModuleAppWindowInstance {
    if (typeof config === 'string') {
      config = this.resolveWindowConfigByName(config)
    }

    const windowInstance = this.addWindow(config)

    if (windowInstance.restore()) {
      return windowInstance
    }

    return this.createWindow(config)
  }

  /**
   * Resolve window config from a window name
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
  public windowGroupInstancesCount(windowName: string): number {
    if (this.windowInstances[windowName]) {
      return Object.keys(this.windowInstances[windowName]).length
    }

    return 0
  }

  /**
   * Get the first window instance from a window group
   * @param windowName
   */
  public windowGroupInstancesFirstInstance(windowName: string): OwdModuleAppWindowInstance|boolean {
    if (this.windowGroupInstancesCount(windowName) > 0) {
      return Object.values(this.windowInstances[windowName])[0]
    }

    return false
  }
}