import {loadModuleFileComponentWindow} from "../../../utils/modules/moduleComponent.utils";

export default class {
  constructor({ app, store, terminal }) {
    this.app = app
    this.terminal = terminal
    this.store = store

    this.modulesLoaded = {}
    this.windowsLoaded = {}

    this.initialize()
  }

  /*
  isModuleConfigValid() {
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
  */

  initialize() {
    // get names of the modules
    const modulesNames = Object.keys(this.app.config.owd.modules.modulesEnabled)

    for (const moduleName of modulesNames) {
      // load module info
      const moduleInfo = this.loadModuleInfo(moduleName)

      let moduleInstance = null

      try {
        moduleInstance = this.loadModule(moduleInfo)
      } catch(e) {
        console.error(e)
      }

      // add module info to loaded modules
      if (moduleInstance) {
        this.modulesLoaded[moduleInfo.name] = moduleInstance
      }
    }

    this.store.commit('core/modules/SET_LOADED_MODULES', this.modulesLoaded)
    this.store.commit('core/modules/SET_LOADED_WINDOWS', this.windowsLoaded)
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
        moduleInfo,
        app: this.app,
        store: this.store,
        terminal: this.terminal
      })

      if (moduleInstance) {
        // load all module window components
        if (Array.isArray(moduleInfo.windows)) {
          this.registerModuleWindowComponents(moduleInfo, moduleInstance)
        }

        return moduleInstance
      }

      return false
    }
  }

  getWindowConfigurationFromWindowName(windowName) {
    if (typeof this.windowsLoaded[windowName] !== 'undefined') {
      return this.windowsLoaded[windowName].window
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
  registerModuleWindowComponents(moduleInfo, moduleInstance) {
    moduleInfo.windows.forEach(windowComponent => {
      if (!windowComponent.name) {
        if (this.config.debug) console.error(`[OWD] Component name is missing in ${windowComponent.name}.`)

        return false
      }

      const moduleComponent = loadModuleFileComponentWindow(moduleInfo, windowComponent.name)

      if (moduleComponent) {
        this.app.component(windowComponent.name, moduleComponent)

        // add module info to loaded modules
        this.windowsLoaded[windowComponent.name] = {
          window: windowComponent,
          module: moduleInstance
        }
      }
    })
  }
}