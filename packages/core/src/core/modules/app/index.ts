import {
  OwdCoreContext,
  OwdModuleApp,
  OwdModulesApp
} from "@owd-client/types";
import CoreModule from "../../core.module";

export default class CoreModulesApp extends CoreModule {
  private _modules: OwdModulesApp = {}

  constructor(ctx: OwdCoreContext) {
    super(ctx)
  }

  /**
   * Initialize desktop apps that have been defined in the client.extensions.ts
   */
  public async initialize() {
    this.registerApps()
  }

  /**
   * Terminate desktop apps
   */
  public async terminate() {
    // remove "on desktop components ready" event listener
    this.unregisterApps()
  }

  private registerApps() {
    const desktopApps = this.getModulesAppFromConfig()

    // install apps
    for (const DesktopApp of desktopApps) {
      this.installApp(DesktopApp)
    }
  }

  private unregisterApps() {
    if (this.app._instance) {
      const moduleNames = Object.keys(this._modules)

      if (moduleNames.length > 0) {
        for (const moduleName of moduleNames) {
          const moduleWindows = this._modules[moduleName].moduleInfo.windows

          if (moduleWindows) {
            for (const moduleWindow of moduleWindows) {
              this.uninstallApp(moduleWindow.name)
            }
          }
        }
      }

      this._modules = {}
    }
  }

  /**
   * Get app modules from client.extensions.ts
   *
   * @private
   */
  private getModulesAppFromConfig() {
    if (!Object.prototype.hasOwnProperty.call(this.extensions, 'modules')) {
      return []
    }

    if (!Object.prototype.hasOwnProperty.call(this.extensions.modules, 'app')) {
      return []
    }

    return this.extensions.modules.app
  }

  /**
   * Install desktop app
   */
  public installApp(ModuleApp: any): OwdModuleApp {
    const moduleAppInstance = new ModuleApp(this)

    if (moduleAppInstance) {
      this._modules[moduleAppInstance.moduleInfo.name] = moduleAppInstance

      return moduleAppInstance
    }

    throw Error('[owd] error while creating a module app')
  }

  /**
   * Uninstall desktop app
   */
  public uninstallApp(name: string) {
    delete this.app._instance.appContext.components[name]
  }

  /**
   * Check if desktop app is installed
   *
   * @param moduleName
   */
  public isAppInstalled(moduleName: string) {
    return Object.prototype.hasOwnProperty.call(this._modules, moduleName)
  }

  /**
   * Get desktop app by its name
   *
   * @param moduleName
   */
  public findApp(moduleName: string) {
    return this._modules[moduleName]
  }
}