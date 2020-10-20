import Vue from 'vue'

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
        console.error('[OWD] Config modules.json is not valid.')
      }

      if (!this.config.modules.modulesEnabled || Object.keys(this.config.modules.modulesEnabled).length === 0) {
        console.error("[OWD] There aren't modules to load.")
      }

      failed = false
    }

    return failed
  }

  initialize() {
    const merge = require('lodash.merge')

    // get names of the modules
    const modulesNames = Object.keys(this.config.modules.modulesEnabled)

    if (modulesNames.length > 0) {
      for (const moduleName of modulesNames) {
        // load module info
        const moduleInfo = this.loadModuleInfo(moduleName)

        if (!moduleInfo) {
          return console.error('Module info is not valid.')
        }

        // check dependencies
        if (!this.areDependenciesSatisfied(moduleInfo.dependencies)) {
          return console.error(
            `Dependencies of ${moduleInfo.name} are not satisfied.\n` +
            JSON.stringify(moduleInfo.dependencies)
          )
        }

        // load all window components
        if (Array.isArray(moduleInfo.windows)) {
          moduleInfo.windows.forEach(windowComponent => {
            if (!windowComponent.name) {
              return console.error(`[OWD] Component name is missing in ${windowComponent.name}.`)
            }

            const loadedWindow = this.loadModuleWindow(moduleInfo.name, windowComponent.name)

            if (loadedWindow) {
              Vue.component(windowComponent.name, loadedWindow)

              // remove windows property from module basic details
              const moduleBasicDetails = {...moduleInfo}
              delete moduleBasicDetails.windows

              // add module info to loaded modules
              this.modulesLoaded[moduleInfo.name] = moduleInfo
              this.windowsLoaded[windowComponent.name] = {
                window: windowComponent,
                module: moduleBasicDetails
              }
            }
          })
        }

        // load store
        if (moduleInfo.store) {
          const loadedStore = this.loadModuleStore(moduleInfo.name)

          if (loadedStore) {
            let storeConfig = {}

            if (moduleInfo.config) {
              const loadedConfig = this.loadModuleConfig(moduleInfo.name)

              if (loadedConfig) {
                storeConfig = loadedConfig
              }
            }

            this.store.registerModule(moduleInfo.name, merge(
              loadedStore,
              {
                namespaced: true,
                state: storeConfig
              }
            ))

            // add module info to loaded modules
            this.modulesLoaded[moduleInfo.name] = moduleInfo
          }
        }

        // load commands
        if (moduleInfo.commands) {
          const commands = this.loadCommands(moduleInfo.name)

          if (commands) {
            Object.keys(commands).forEach((commandName) => {
              this.terminal.addCommand(commandName, commands[commandName])
            })
          }
        }

      }
    }

    return {
      modulesLoaded: this.modulesLoaded,
      windowsLoaded: this.windowsLoaded,
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

  getWindowModuleFromWindowName(moduleName) {
    if (typeof this.windowsLoaded[moduleName] !== 'undefined') {
      return this.windowsLoaded[moduleName].module
    }

    return null
  }

  /**
   * Check if dependencies are satisfied
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
      console.log(`[OWD] Missing "/modules/${moduleFolder}/module.json"`)
    }
  }

  /**
   * Load module window
   *
   * @param moduleName
   * @param windowName
   * @returns {*}
   */
  loadModuleWindow(moduleName, windowName) {
    try {
      return require('@/../src/modules/' + moduleName + '/windows/' + windowName + '.vue').default
    } catch(e) {
      console.log(`[OWD] Missing "/modules/${moduleName}/windows/${windowName}.vue"`)
    }
  }

  /**
   * Load module store
   *
   * @param moduleName
   * @returns {*}
   */
  loadModuleStore(moduleName) {
    try {
      return require('@/../src/modules/' + moduleName + '/store').default
    } catch(e) {
      console.log(`[OWD] Missing "/modules/${moduleName}/store"`)
    }
  }

  /**
   * Load module config
   *
   * @param moduleName
   * @returns {any}
   */
  loadModuleConfig(moduleName) {
    try {
      return require('@/../config/' + moduleName + '/config.json')
    } catch(e) {
      console.log(`[OWD] Missing "/modules/${moduleName}/config.json"`)
    }
  }

  /**
   * Load commands from module passing terminal as instance
   *
   * @param moduleFolder
   * @returns {*}
   */
  loadCommands(moduleFolder) {
    try {
      const commands = require('@/../src/modules/' + moduleFolder + '/commands.js')

      if (commands) {
        // instance commands
        return commands.default({
          store: this.store,
          terminal: this.terminal
        })
      }
    } catch(e) {
      console.log(`[OWD] Missing "/modules/${moduleFolder}/commands.js"`)
    }
  }

}