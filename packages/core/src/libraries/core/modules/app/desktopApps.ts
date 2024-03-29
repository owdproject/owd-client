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

    // on desktop components ready
    this.context.on('owd/desktop:mounted', () => {
      this.initialize()
    })
  }

  /**
   * Initialize app modules that have been defined in the client.extensions.ts
   */
  public async initialize() {
    const desktopApps = this.getModulesAppFromConfig()

    // initialize client
    await this.context.store.dispatch('core/client/initialize')

    // install apps
    for (const DesktopApp of desktopApps) {
      this.installApp(DesktopApp)
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