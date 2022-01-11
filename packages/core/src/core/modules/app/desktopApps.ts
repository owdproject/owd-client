import {
  OwdCoreContext,
  OwdModuleApp,
  OwdModulesApp
} from "@owd-client/types";

export default class DesktopApps {
  private readonly context;
  private modules: OwdModulesApp = {}

  constructor(context: OwdCoreContext) {
    this.context = context
  }

  /**
   * Initialize desktop apps that have been defined in the client.extensions.ts
   */
  public async initialize() {
    const desktopApps = this.getModulesAppFromConfig()

    // install apps
    for (const DesktopApp of desktopApps) {
      this.installApp(DesktopApp)
    }
  }

  /**
   * Terminate desktop apps
   */
  public async terminate() {
    if (this.context.app._instance) {
      const moduleNames = Object.keys(this.modules)

      if (moduleNames.length > 0) {
        for (const moduleName of moduleNames) {
          const moduleWindows = this.modules[moduleName].moduleInfo.windows

          if (moduleWindows) {
            for (const moduleWindow of moduleWindows) {
              delete this.context.app._instance.appContext.components[moduleWindow.name]
            }
          }
        }
      }

      this.modules = {}
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
  public installApp(ModuleApp: any): OwdModuleApp {
    const moduleAppInstance = new ModuleApp(this.context)

    if (moduleAppInstance) {
      this.modules[moduleAppInstance.moduleInfo.name] = moduleAppInstance

      return moduleAppInstance
    }

    throw Error('Error while creating a module app')
  }

  /**
   * Check if desktop app is installed
   *
   * @param moduleName
   */
  public isAppInstalled(moduleName: string) {
    return Object.prototype.hasOwnProperty.call(this.modules, moduleName)
  }

  /**
   * Get desktop app by its name
   *
   * @param moduleName
   */
  public findApp(moduleName: string) {
    return this.modules[moduleName]
  }
}