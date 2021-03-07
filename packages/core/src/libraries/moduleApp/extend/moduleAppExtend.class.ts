import {OwdCoreModulesContext, OwdModuleApp, OwdModuleAppInfo} from "@owd-client/types";
import ModuleApp from "../moduleApp.class";

const modulesApps: {[key: string]: OwdModuleApp} = {};

export default class ModuleAppExtend {
  config: any
  app: any
  terminal = null
  store: any = null

  constructor(context: OwdCoreModulesContext) {
    this.config = context.config
    this.app = context.app
    this.terminal = context.terminal
    this.store = context.store

    this.loadModulesApp()
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
  loadModulesApp() {
    // get names of the modules
    const modulesEnabled: {
      name: string,
      version: string,
      url: string,
      git?: boolean
    }[] = Object.values(this.app.config.owd.modules.modulesEnabled)

    for (const module of modulesEnabled) {
      try {
        ModuleAppExtend.registerModule(module, {
          app: this.app,
          store: this.store,
          terminal: this.terminal
        })
      } catch(e) {
        console.error(e)
      }
    }

    this.store.commit('core/modules/SET_MODULES_LOADED', modulesApps)
  }

  /**
   * Register app module
   *
   * @param module
   * @param context
   */
  static registerModule(module: any, context: any) {
    // load module info
    const moduleInfo = ModuleAppExtend.loadModuleInfo(module)

    if (!ModuleAppExtend.isModuleInfoValid(module.name, moduleInfo)) {
      return false;
    }

    const moduleAppClass = ModuleAppExtend.getModuleFile(module, 'index')

    if (moduleAppClass.default && typeof moduleAppClass.default === 'function') {
      const moduleAppLoaded = new moduleAppClass.default({ ...context, moduleInfo })

      if (moduleAppLoaded) {

        // assign loaded owd module to modulesApp
        modulesApps[moduleInfo.name] = moduleAppLoaded

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
   * @param module
   * @returns {any}
   */
  static loadModuleInfo(module: any) {
    return ModuleAppExtend.getModuleFile(module, 'module.json')
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

  static getModuleFile(module: any, moduleFile: string) {
    try {
      if (ModuleApp.isGitModule(module.name)) {
        try {
          return require(`@/../node_modules/${module.name}/client/${moduleFile}`)
        } catch(e) {
          return require(`@/../node_modules/${module.name}/client/dist/${moduleFile}`)
        }
      } else {
        return require(`@/../src/modules/${module.name}/${moduleFile}`)
      }
    } catch(e) {
      return null
    }
  }
}