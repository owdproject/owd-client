import {
  OwdCoreModuleContext, OwdModuleApp,
  OwdModulesApp
} from "@owd-client/types";

export default class ModuleAppExtend {
  private readonly context;
  private modules: OwdModulesApp = {}

  constructor(context: OwdCoreModuleContext) {
    this.context = context

    this.initializeModulesApp()
    this.registerModulesAppProvider()
  }

  /**
   * Register this class into modules app store
   */
  private registerModulesAppProvider() {
    this.context.store.commit('core/modulesApp/REGISTER_MODULES_PROVIDER', this)
  }

  /**
   * Get app modules from client.extensions.ts
   *
   * @private
   */
  private getModulesAppFromConfig() {
    if (
      typeof this.context.extensions.modules !== 'undefined' &&
      typeof this.context.extensions.modules.app !== 'undefined'
    ) {
      return this.context.extensions.modules.app
    }

    return []
  }

  /**
   * Initialize app modules that have been defined in the client.extensions.ts
   */
  private initializeModulesApp() {
    const modulesApp = this.getModulesAppFromConfig()

    for (const ModuleApp of modulesApp) {
      this.createModuleApp(ModuleApp)
    }
  }

  /**
   * Install module app
   */
  public createModuleApp(ModuleApp: any): OwdModuleApp {
    const moduleAppInstance = new ModuleApp(this.context)

    if (moduleAppInstance) {
      this.modules[moduleAppInstance.moduleInfo.name] = moduleAppInstance

      return moduleAppInstance
    }

    throw Error('Error while creating a module app')
  }

  /**
   * Check if module app is installed
   *
   * @param moduleName
   */
  public isModuleAppInstalled(moduleName: string) {
    return Object.prototype.hasOwnProperty.call(this.modules, moduleName)
  }

  /**
   * Get module app by module name
   *
   * @param moduleName
   */
  public findModuleApp(moduleName: string) {
    return this.modules[moduleName]
  }
}