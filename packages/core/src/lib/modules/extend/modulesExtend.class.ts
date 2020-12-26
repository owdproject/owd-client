import {OwdCoreModulesContext, OwdModule, OwdModuleInfo} from "../../../../../types";

export default class {
  config: any
  app: any
  terminal = null
  store: any = null

  modulesLoaded: {[key: string]: OwdModule}
  modulesCategories: {[key: string]: any}

  constructor(context: OwdCoreModulesContext) {
    this.config = context.config
    this.app = context.app
    this.terminal = context.terminal
    this.store = context.store

    this.modulesLoaded = {}
    this.modulesCategories = {}

    this.initialize()
  }

  /**
   * Check client/config/modules.json
   */
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

      if (!this.isModuleInfoValid(moduleName, moduleInfo)) {
        continue;
      }
      console.log('MODULE INFO', moduleInfo)

      try {
        // add module info to loaded modules
        this.modulesLoaded[moduleInfo.name] = this.loadModule( {
          moduleInfo,
          app: this.app,
          store: this.store,
          terminal: this.terminal
        })

        if (moduleInfo.category) {
          if (!Object.prototype.hasOwnProperty.call(this.modulesCategories, moduleInfo.category)) {
            this.modulesCategories[moduleInfo.category] = []
          }

          this.modulesCategories[moduleInfo.category].push(moduleInfo.name)
        }
      } catch(e) {
        console.error(e)
      }
    }

    this.store.commit('core/modules/SET_MODULES_LOADED', this.modulesLoaded)
  }

  /**
   * Load module class initializer
   *
   * @param context
   */
  loadModule(context: any) {
    const moduleClass = require('@/../src/modules/' + context.moduleInfo.name + '/index').default

    if (moduleClass && typeof moduleClass === 'function') {
      return new moduleClass(context)
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
   * Check if this module info is valid
   *
   * @param moduleName
   * @param moduleInfo
   * @returns {any}
   */
  isModuleInfoValid(moduleName: string, moduleInfo: OwdModuleInfo) {
    if (!moduleInfo) {
      console.error(`[OWD] Config "${moduleName}/modules.json" is not valid`)
      return false;
    }

    return true;
  }

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