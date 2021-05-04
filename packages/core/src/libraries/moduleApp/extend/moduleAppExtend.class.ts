import {OwdCoreModulesContext, OwdModuleApp, OwdModuleAppInfo, OwdClientConfigurationModules, OwdClientConfigurationModule} from "@owd-client/types";
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
    if (!this.config || typeof this.config.modules !== 'undefined' || this.config.modules.type !== 'client') {
      console.error('[OWD] Config modules.json is not valid')
      return false
    }

    if (!this.config.modules.modulesEnabled) {
      console.error("[OWD] There are no modulesEnabled defined")
      return false
    }

    return true
  }

  /**
   * Load OWD app modules from owd config
   */
  loadModulesApp() {
    const modulesEnabled: OwdClientConfigurationModule[] = Object.values(this.app.config.owd.modules.modulesEnabled)

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
    const moduleInfo = ModuleApp.loadModuleInfo(module)

    if (!ModuleApp.isModuleInfoValid(module.name, moduleInfo)) {
      return false;
    }

    const moduleAppClass = ModuleApp.getModuleFile(module, 'index')

    if (moduleAppClass && moduleAppClass.default && typeof moduleAppClass.default === 'function') {
      const moduleAppLoaded = new moduleAppClass.default({ ...context, moduleInfo })

      if (moduleAppLoaded) {

        // assign loaded owd module to modulesApp
        modulesApps[moduleInfo.name] = moduleAppLoaded

      }
    }
  }

  /**
   * Check if dependencies are satisfied todo
   */
  /*
  private checkDependencies(dependencies: any[]) {
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
}