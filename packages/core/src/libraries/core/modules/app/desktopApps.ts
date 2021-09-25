import {
  OwdCoreModuleContext, OwdModuleApp,
  OwdModulesApp
} from "@owd-client/types";

export default class DesktopApps {
  private readonly context;
  private apps: OwdModulesApp = {}

  constructor(context: OwdCoreModuleContext) {
    this.context = context

    this.registerProvider()
  }

  /**
   * Register this class into modules app store
   */
  private registerProvider() {
    this.context.store.commit('core/modulesApp/REGISTER_MODULES_PROVIDER', this)
  }

  /**
   * Initialize app modules that have been defined in the client.extensions.ts
   */
  public initialize() {
    const desktopApps = this.getModulesAppFromConfig()

    for (const DesktopApp of desktopApps) {
      this.installModuleApp(DesktopApp)
    }
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
   * Install desktop app
   */
  public installModuleApp(ModuleApp: any): OwdModuleApp {
    const moduleAppInstance = new ModuleApp(this.context)

    if (moduleAppInstance) {
      this.apps[moduleAppInstance.moduleInfo.name] = moduleAppInstance

      return moduleAppInstance
    }

    throw Error('Error while creating a module app')
  }

  /**
   * Check if desktop app is installed
   *
   * @param moduleName
   */
  public isModuleAppInstalled(moduleName: string) {
    return Object.prototype.hasOwnProperty.call(this.apps, moduleName)
  }

  /**
   * Get desktop app by its name
   *
   * @param moduleName
   */
  public findModuleApp(moduleName: string) {
    return this.apps[moduleName]
  }
}