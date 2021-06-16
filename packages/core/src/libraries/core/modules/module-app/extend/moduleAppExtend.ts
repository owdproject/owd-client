import {
  OwdCoreModuleContext,
  OwdModulesApp
} from "@owd-client/types";

export default class ModuleAppExtend {
  private readonly context;
  private modules: OwdModulesApp = {}

  constructor(context: OwdCoreModuleContext) {
    this.context = context

    this.loadModulesApp()
    this.registerModulesAppProvider()
  }

  /**
   * Register this class into modules app store
   */
  private registerModulesAppProvider() {
    this.context.store.commit('core/modulesApp/REGISTER_MODULES_PROVIDER', this)
  }

  /**
   * Initialize app modules that have been defined in the client.extensions.ts
   */
  private loadModulesApp() {
    if (typeof this.context.extensions.app.modules !== 'undefined') {
      for (const ModuleApp of this.context.extensions.app.modules) {
        this.installModuleApp(ModuleApp)
      }
    }
  }

  /**
   * Install module app
   */
  public installModuleApp(ModuleApp: any) {
    const moduleAppInstance = new ModuleApp(this.context)

    if (moduleAppInstance) {
      this.modules[moduleAppInstance.moduleInfo.name] = moduleAppInstance
    }
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