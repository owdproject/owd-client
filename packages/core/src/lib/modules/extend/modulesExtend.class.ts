import {OwdCoreModulesContext, OwdModuleInfo} from "../../../../../types";

export default class {
  config: any
  app: any
  terminal = null
  store: any = null

  modulesLoaded: any

  constructor(context: OwdCoreModulesContext) {
    this.config = context.config
    this.app = context.app
    this.terminal = context.terminal
    this.store = context.store

    this.modulesLoaded = {}

    this.initialize()
  }

  isModuleConfigValid() {
    let failed = true

    if (this.config && typeof this.config.modules !== 'undefined') {
      if (this.config.modules.type !== 'client') {
        return console.error('[OWD] Config modules.json is not valid.')
      }

      if (!this.config.modules.modulesEnabled || Object.keys(this.config.modules.modulesEnabled).length === 0) {
        return console.error("[OWD] There are no modules to load.")
      }

      failed = false
    }

    return failed
  }

  /**
   * Load OWD modules
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
  }

  /**
   * Load module class initializer
   *
   * @param moduleInfo
   */
  loadModule(moduleInfo: OwdModuleInfo) {
    const moduleClass = require('@/../src/modules/' + moduleInfo.name + '/index').default

    if (moduleClass && typeof moduleClass === 'function') {

      const moduleInstance = new moduleClass({
        // context
        moduleInfo,
        app: this.app,
        store: this.store,
        terminal: this.terminal
      })

      if (moduleInstance) {
        return moduleInstance
      }

      return false
    }
  }

  /**
   * Check if dependencies are satisfied todo
   *
   * @param dependencies
   * @returns {boolean}
   */
  /*
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
   */

  /**
   * Load module info
   *
   * @param moduleFolder
   * @returns {any}
   */
  loadModuleInfo(moduleFolder: string) {
    try {
      return require('@/../src/modules/' + moduleFolder + '/module.json')
    } catch(e) {
      if (this.config.debug) console.error(`[OWD] Unable to load "/modules/${moduleFolder}/module.json"`, e)
    }
  }
}