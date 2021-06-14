import {
  OwdCoreModulesContext,
  OwdModuleApp
} from "@owd-client/types";
import ModuleApp from "../moduleApp.class";

const modulesApps: {[key: string]: OwdModuleApp} = {};

export default class ModuleAppExtend {
  private readonly app
  private readonly config
  private readonly extensions
  private readonly terminal
  private readonly store

  constructor(context: OwdCoreModulesContext) {
    this.app = context.app
    this.config = context.config
    this.extensions = context.extensions
    this.terminal = context.terminal
    this.store = context.store

    this.loadAppModules()
  }

  /**
   * Load OWD app modules from owd config
   */
  loadAppModules() {
    const appModules = this.extensions.app.modules

    if (appModules) {
      for (const appModule of appModules) {
        ModuleAppExtend.registerModuleApp({
          app: this.app,
          store: this.store,
          terminal: this.terminal
        }, appModule)
      }
    }

    this.store.commit('core/modules/SET_MODULES_LOADED', modulesApps)
  }

  /**
   * Register app module
   *
   * @param context
   * @param appModule
   */
  static async registerModuleApp(context: any, appModule: any) {
    const moduleAppInstance = new appModule({ ...context })

    if (moduleAppInstance) {

      // assign loaded owd module to modulesApp
      modulesApps[moduleAppInstance.moduleInfo.name] = moduleAppInstance

    }
  }
}