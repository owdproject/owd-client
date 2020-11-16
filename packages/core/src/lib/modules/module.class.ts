import {loadModuleFileStoreConfig} from "../../utils/modules/moduleStore.utils";
import store from "../../store";

export default class Module {
  constructor(context) {
    this.moduleInfo = context.moduleInfo
    this.moduleStore = null
    this.moduleStoreInstance = null
    this.moduleStoreConfig = null

    this.loadModuleStoreConfig(context)
    this.loadModuleStore(context)
    this.loadModuleStoreInstance(context)
    this.loadModuleCommands(context)
    this.loadModuleSseEvents(context)
  }

  /**
   * Check module dependencies (todo)
   */
  checkDependencies() {}

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
   *
   * @param context
   */
  loadModuleStore(context) {
    // load module store
    if (typeof this.loadStore === 'function') {
      this.moduleStore = this.loadStore(context)
      this.createModuleStore(context)
    }
  }

  /**
   * Create module store
   *
   * @param context
   */
  createModuleStore(context) {
    const merge = require('lodash.merge')

    let moduleStore = this.moduleStore
    let moduleStoreMerge = {
      namespaced: true
    }

    if (this.moduleStoreConfig) {
      moduleStoreMerge = {
        namespaced: true,
        state: this.moduleStoreConfig
      }
    }

    // register store to Vuex
    context.store.registerModule(this.moduleInfo.name, merge(
      moduleStore,
      moduleStoreMerge
    ))
  }

  // ### MODULE STORE INSTANCE

  /**
   * Load module store instance
   *
   * @param context
   */
  loadModuleStoreInstance(context) {
    // load module store instance
    if (!context.moduleInfo.singleton) {
      if (typeof this.loadStoreInstance === 'function') {
        this.moduleStoreInstance = this.loadStoreInstance({
          store: context.store,
          terminal: context.terminal
        })
      }
    }
  }

  /**
   * Create module store instance
   *
   * @param storeName
   */
  createModuleStoreInstance(storeName) {
    const storeModule = {
      namespaced: true,
      ...this.moduleStoreInstance
    }

    // we initialize the new dynamic module in the global store:
    store.registerModule(storeName, storeModule)
  }

  /**
   * Destroy module store instance
   *
   * @param storeName
   */
  destroyModuleStoreInstance(storeName) {
    store.unregisterModule(storeName)
  }

  // ### MODULE STORE CONFIG

  /**
   * Load module store config
   *
   * @param context
   */
  loadModuleStoreConfig(context) {
    if (context.moduleInfo.config) {
      this.moduleStoreConfig = loadModuleFileStoreConfig(context.moduleInfo);
    }
  }

  // ### MODULE COMMANDS

  /**
   * Load module commands
   *
   * @param context
   */
  loadModuleCommands(context) {
    // load commands
    if (typeof this.loadCommands === 'function') {
      const moduleCommands = this.loadCommands({
        store: context.store,
        terminal: context.terminal
      })

      // register commands to OWD global terminal commands
      if (moduleCommands) {
        Object.keys(moduleCommands).forEach((commandName) => {
          context.terminal.addCommand(commandName, moduleCommands[commandName])
        })
      }
    }
  }

  // ### MODULE SSE EVENTS

  /**
   * Load module SSE events
   *
   * @param context
   */
  loadModuleSseEvents(context) {
    // load events sse
    if (typeof this.loadSseEvents === 'function') {
      const moduleSseEvents = this.loadSseEvents({
        store: context.store,
        terminal: context.terminal
      })

      const moduleSseEventsKeys = Object.keys(moduleSseEvents);

      context.store.subscribe((mutation) => {
        if (mutation.type === 'core/sse/LOG_EVENT') {
          const event = mutation.payload

          if (moduleSseEventsKeys.includes(event.name)) {
            if (typeof moduleSseEvents[event.name] === 'function') moduleSseEvents[event.name](event.data)
          }
        }
      })
    }
  }
}