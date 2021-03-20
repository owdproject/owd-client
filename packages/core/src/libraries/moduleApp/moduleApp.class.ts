import {
  OwdModuleApp,
  OwdModuleAppContext,
  OwdModuleAppCommands,
  OwdModuleAppWindowConfig,
  OwdModuleAppSseEvents,
  OwdModuleAppInfo,
  OwdModuleAppWindowsInstances,
  OwdModuleAppLoadCommandsContext,
  OwdModuleAppLoadSseEventsContext,
  OwdModuleAppLoadStoreContext
} from "@owd-client/types";
import {MutationPayload} from "vuex";

export default abstract class ModuleApp implements OwdModuleApp {
  private readonly app
  private readonly store
  private readonly terminal

  public moduleInfo: OwdModuleAppInfo;
  public moduleStore: any
  public moduleStoreConfig: any
  public moduleStoreInstance: any

  public windowInstances: OwdModuleAppWindowsInstances

  constructor(context: OwdModuleAppContext) {
    this.moduleInfo = context.moduleInfo
    this.app = context.app
    this.store = context.store
    this.terminal = context.terminal

    this.windowInstances = {}

    this.checkModuleInfo(context.moduleInfo)
    this.loadModuleStoreConfig()
    this.loadModuleStore()
    this.loadModuleStoreInstance()
    this.loadModuleWindowComponents()
    this.loadModuleCommands()
    this.loadModuleAssets()
    this.loadModuleSseEvents()
  }

  abstract loadAssets(): void
  abstract loadCommands(context: OwdModuleAppLoadCommandsContext): OwdModuleAppCommands
  abstract loadSseEvents(context: OwdModuleAppLoadSseEventsContext): OwdModuleAppSseEvents
  abstract loadStore(context: OwdModuleAppLoadStoreContext): void | any
  abstract loadStoreInstance(context: OwdModuleAppLoadStoreContext): void

  static isModuleSource(moduleName: string): boolean {
    return true
  }

  static getModuleFile(module: any, moduleFile: string) {
    try {
      if (ModuleApp.isModuleSource(module.name)) {
        return require(`@/../src/modules/${module.name}/${moduleFile}`)
      } else {
        try {
          return require(`@/../node_modules/${module.name}/client/${moduleFile}`)
        } catch(e) {
          return require(`@/../../../node_modules/${module.name}/client/${moduleFile}`)
        }
      }
    } catch(e) {
      return null
    }
  }

  /**
   * Load module app info
   *
   * @param module
   * @returns {any}
   */
  static loadModuleInfo(module: any) {
    return ModuleApp.getModuleFile(module, 'module.json')
  }

  /**
   * Check if this module info is valid
   *
   * @param moduleName
   * @param moduleInfo
   * @returns {any}
   */
  static isModuleInfoValid(moduleName: string, moduleInfo: OwdModuleAppInfo) {
    if (!moduleInfo) {
      console.error(`[OWD] Config "${moduleName}/module.json" is not valid`)
      return false;
    }

    return true;
  }

  public get isSingleton() {
    return (
      typeof this.moduleInfo.singleton === 'undefined' ||
      typeof this.moduleInfo.singleton === 'boolean' && this.moduleInfo.singleton === true
    )
  }

  /**
   * Parse module info to fix errors or missing values
   */
  checkModuleInfo(moduleInfo: OwdModuleAppInfo) {
    this.moduleInfo = moduleInfo

    if (this.moduleInfo.windows) {
      let i = 0;
      for (const moduleWindow of this.moduleInfo.windows) {
        if (!moduleWindow.titleShort) {
          // titleShort always available
          this.moduleInfo.windows[i].titleShort = this.moduleInfo.windows[i].title
        }
        i++
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
      this.moduleStore = this.loadStore({ store: this.store })

      if (this.moduleStore) {
        this.registerModuleStore()
      }
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

      return true;
    }

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

  /**
   * Check if has module store instance
   */
  public hasModuleStoreInstance() {
    if (this.moduleStoreInstance) {
      return true
    }

    return false
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
        if (ModuleApp.isModuleSource(this.moduleInfo.name)) {
          return require('@/../config/' + this.moduleInfo.name + '/config.json')
        } else {
          return require(this.moduleInfo.name + '/client/config.json')
        }
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
      this.moduleInfo.windows.forEach((windowConfig: OwdModuleAppWindowConfig) => {
        if (!windowConfig.name) {
          if (this.app.config.owd.debug) console.error(`[OWD] Component name is missing in ${windowConfig.name}.`)

          return false
        }

        this.registerModuleWindowComponent(windowConfig.name)
      })
    }
  }

  private registerModuleWindowComponent(windowName: string) {
    try {
      const windowComponent = ModuleApp.getModuleFile(this.moduleInfo, `windows/${windowName}.vue`)

      if (windowComponent) {
        // sync vue component registration
        this.app.component(windowName, windowComponent.default)
      }
    } catch(e) {
      if (this.app.config.owd.debug) console.error(`[OWD] Unable to load "/modules/${this.moduleInfo.name}/windows/${windowName}.vue"`, e)
    }
  }
}