import Vue from 'vue'

import {loadModuleFileCommands} from "../../../utils/modules/moduleCommand.utils";
import {loadModuleFileComponentWindow} from "../../../utils/modules/moduleComponent.utils";
import {loadModuleFileStore, loadModuleFileStoreConfig} from "../../../utils/modules/moduleStore.utils";

export default class {
  constructor({ store, terminal, config }) {
    if (!this.isConfigModuleValid(config)) return

    this.config = config
    this.terminal = terminal
    this.store = store

    this.modulesLoaded = {}
    this.windowsLoaded = {}

    this.initialize()
  }

  isConfigModuleValid() {
    let failed = true

    if (this.config && this.config.modules) {
      if (this.config.modules.type !== 'client') {
        if (this.config.debug) console.error('[OWD] Config modules.json is not valid.')
      }

      if (!this.config.modules.modulesEnabled || Object.keys(this.config.modules.modulesEnabled).length === 0) {
        if (this.config.debug) console.error("[OWD] There are no modules to load.")
      }

      failed = false
    }

    return failed
  }

  initialize() {
    // get names of the modules
    const modulesNames = Object.keys(this.config.modules.modulesEnabled)

    for (const moduleName of modulesNames) {
      // load module info
      const moduleInfo = this.loadModuleInfo(moduleName)

      // compatibility with module v1
      let moduleInstance = moduleInfo

      // load module
      switch (parseInt(moduleInfo.version)) {
        case 2:
          // load module class
          moduleInstance = this.loadModule(moduleInfo)
          break;
        case 1:
        default:
          // load module with commands.js + store
          this.loadLegacyModule(moduleInfo)
          break;
      }

      // add module info to loaded modules
      this.modulesLoaded[moduleInfo.name] = moduleInstance
    }
  }

  /**
   * Load module class initializer
   *
   * @param moduleInfo
   */
  loadModule(moduleInfo) {
    const moduleClass = require('@/../src/modules/' + moduleInfo.name + '/index')

    if (moduleClass && typeof moduleClass.default === 'function') {
      const moduleInstance = new moduleClass.default({
        // context
        moduleInfo: moduleInfo,
        terminal: this.terminal,
        store: this.store
      })

      if (moduleInstance) {
        // load all module window components
        if (Array.isArray(moduleInfo.windows)) {
          this.registerModuleComponentWindows(moduleInfo, moduleInstance)
        }

        return moduleInstance
      }

      return false
    }
  }

  /**
   * Load legacy module
   *
   * - commands.js
   * - store.js or storeInstance.js
   */
  async loadLegacyModule(moduleInfo) {
    if (!moduleInfo) {
      if (this.config.debug) console.error('[OWD] Module info is not valid.')

      return false
    }

    // check dependencies
    if (!this.areDependenciesSatisfied(moduleInfo.dependencies)) {
      if (this.config.debug) console.error(
        `Dependencies of ${moduleInfo.name} are not satisfied.\n` +
        JSON.stringify(moduleInfo.dependencies)
      )

      return false
    }

    // load all window components
    if (Array.isArray(moduleInfo.windows)) {
      this.registerModuleComponentWindows(moduleInfo, moduleInfo)
    }

    // register store to Vuex
    if (moduleInfo.store) {
      // load src/modules/<module-name>/store.js
      const moduleStore = loadModuleFileStore(moduleInfo)
      // load config/<module-name>/config.json
      const moduleStoreConfig = loadModuleFileStoreConfig(moduleInfo)

      this.registerLegacyModuleStore(moduleInfo, moduleStore, moduleStoreConfig)
    }

    // register commands to OWD global terminal commands
    if (moduleInfo.commands) {
      // load src/modules/<module-name>/commands.js
      const commandsLoader = loadModuleFileCommands(moduleInfo)

      if (commandsLoader) {
        // initialize commands
        const moduleCommands = commandsLoader({
          store: this.store,
          terminal: this.terminal
        })

        this.registerLegacyModuleCommands(moduleCommands)
      }
    }
  }

  isModuleLoaded(module) {
    return Object.keys(this.modulesLoaded).includes(module)
  }

  getWindowConfigurationFromWindowName(windowName) {
    if (typeof this.windowsLoaded[windowName] !== 'undefined') {
      return this.windowsLoaded[windowName].window
    }

    return null
  }

  /**
   * Used in some modules
   *
   * @param moduleName
   * @returns {null|*}
   */
  getModuleFromWindowName(moduleName) {
    if (typeof this.windowsLoaded[moduleName] !== 'undefined') {
      return this.windowsLoaded[moduleName].module
    }

    return null
  }

  /**
   * Check if dependencies are satisfied (wip)
   *
   * @param dependencies
   * @returns {boolean}
   */
  areDependenciesSatisfied(dependencies) {
    let dependenciesStatisfied = true

    if (dependencies && dependencies.length > 0) {
      dependencies.forEach((dependency) => {

        if (dependenciesStatisfied) {
          if (!this.modulesLoaded.list.includes(dependency)) {
            dependenciesStatisfied = false
          }
        }

      })
    }

    return dependenciesStatisfied
  }

  /**
   * Load module info
   *
   * @param moduleFolder
   * @returns {any}
   */
  loadModuleInfo(moduleFolder) {
    try {
      return require('@/../src/modules/' + moduleFolder + '/module.json')
    } catch(e) {
      if (this.config.debug) console.error(`[OWD] Unable to load "/modules/${moduleFolder}/module.json"`, e)
    }
  }

  /**
   * Register module window components
   *
   * @param moduleInfo
   * @param moduleInstance
   */
  registerModuleComponentWindows(moduleInfo, moduleInstance) {
    moduleInfo.windows.forEach(windowComponent => {
      if (!windowComponent.name) {
        if (this.config.debug) console.error(`[OWD] Component name is missing in ${windowComponent.name}.`)

        return false
      }

      const moduleComponent = loadModuleFileComponentWindow(moduleInfo, windowComponent.name)

      if (moduleComponent) {
        Vue.component(windowComponent.name, moduleComponent)

        // add module info to loaded modules
        this.windowsLoaded[windowComponent.name] = {
          window: windowComponent,
          module: moduleInstance
        }
      }
    })
  }

  /**
   * Register module store
   *
   * @param moduleInfo
   * @param moduleStore
   * @param moduleStoreConfig
   */
  registerLegacyModuleStore(moduleInfo, moduleStore, moduleStoreConfig) {
    const merge = require('lodash.merge')

    let storeConfig = {}

    if (moduleInfo.config && moduleStoreConfig) {
      storeConfig = moduleStoreConfig
    }

    // register store to Vuex
    this.store.registerModule(moduleInfo.name, merge(
      moduleStore,
      {
        namespaced: true,
        state: storeConfig
      }
    ))
  }

  /**
   * Globally register commands to terminal
   *
   * @param moduleCommands
   */
  registerLegacyModuleCommands(moduleCommands) {
    if (moduleCommands) {
      // register commands to OWD global terminal commands
      Object.keys(moduleCommands).forEach((commandName) => {
        this.terminal.addCommand(commandName, moduleCommands[commandName])
      })
    }
  }
}