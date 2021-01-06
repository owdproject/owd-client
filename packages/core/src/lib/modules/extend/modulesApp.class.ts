import {OwdCoreModulesContext, OwdModuleApp, OwdModuleAppInfo} from "../../../../../types";

const modulesApp: {[key: string]: OwdModuleApp} = {};
const modulesAppCategories: {[key: string]: any} = {};

export default class ModulesApp {
  config: any
  app: any
  terminal = null
  store: any = null

  constructor(context: OwdCoreModulesContext) {
    this.config = context.config
    this.app = context.app
    this.terminal = context.terminal
    this.store = context.store

    this.loadAppModules()
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
   * Load OWD app modules from owd config
   */
  loadAppModules() {
    // get names of the modules
    const modulesNames = Object.keys(this.app.config.owd.modules.modulesEnabled)

    for (const moduleName of modulesNames) {
      // load module info
      const moduleInfo = ModulesApp.loadModuleInfo(moduleName)

      if (!ModulesApp.isModuleInfoValid(moduleName, moduleInfo)) {
        continue;
      }

      try {
        ModulesApp.registerModule( {
          moduleInfo,
          app: this.app,
          store: this.store,
          terminal: this.terminal
        })
      } catch(e) {
        console.error(e)
      }
    }

    this.store.commit('core/modules/SET_MODULES_LOADED', modulesApp)
  }

  /**
   * Register app module
   *
   * @param context
   */
  static registerModule(context: any) {
    const moduleInfo = context.moduleInfo;
    const moduleAppClass = require('@/../src/modules/' + moduleInfo.name + '/index').default

    if (moduleAppClass && typeof moduleAppClass === 'function') {
      const moduleAppLoaded = new moduleAppClass(context)

      if (moduleAppLoaded) {

        // assign loaded owd module to modulesApp
        modulesApp[moduleInfo.name] = moduleAppLoaded

        // add loaded module name to modulesAppCategories
        if (moduleInfo.category) {
          if (!Object.prototype.hasOwnProperty.call(modulesAppCategories, moduleInfo.category)) {
            modulesAppCategories[moduleInfo.category] = []
          }

          modulesAppCategories[moduleInfo.category].push(moduleInfo.name)
        }

      }
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
   * Load module app info
   *
   * @param moduleFolder
   * @returns {any}
   */
  static loadModuleInfo(moduleFolder: string) {
    try {
      return require('@/../src/modules/' + moduleFolder + '/module.json')
    } catch(e) {
      console.error(`[OWD] Unable to load "/modules/${moduleFolder}/module.json"`, e)
    }
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
      console.error(`[OWD] Config "${moduleName}/modules.json" is not valid`)
      return false;
    }

    return true;
  }
}