import {reactive,markRaw} from 'vue'
import {
  OwdCoreModuleContext, OwdModuleDesktop,
  OwdModulesDesktop
} from "@owd-client/types";

export default class DesktopModules {
  private readonly context;
  private modules: OwdModulesDesktop = {}

  constructor(context: OwdCoreModuleContext) {
    this.context = context

    this.registerDesktopEnvironment()
    this.initializeDesktopModules()
  }

  /**
   * Register desktop modules to global property $owd,
   * then register a global vue component called <Desktop> and provide desktop options
   */
  registerDesktopEnvironment() {
    // register desktop vue component
    this.context.app.component('Desktop', this.context.extensions.desktop.component)

    // provide desktop options
    this.context.app.provide('desktopOptions', this.context.extensions.desktop.options)

    // provide desktop modules
    this.context.app.provide('desktopModules', {
      list: reactive(this.modules),
      get: function(area?: string, position?: string) {
        if (area && position && this.list[area]) {
          return this.list[area][position]
        } else if (area) {
          return this.list[area]
        }

        return {}
      }
    })
  }

  /**
   * Get desktop modules from client.extensions.ts
   *
   * @private
   */
  private getDesktopModulesFromConfig() {
    let modules: any[] = []

    if (this.context.extensions.desktop.modules) {
      modules = modules.concat(this.context.extensions.desktop.modules)
    }

    if (
      typeof this.context.extensions.modules !== 'undefined' &&
      typeof this.context.extensions.modules.desktop !== 'undefined'
    ) {
      modules = modules.concat(this.context.extensions.modules.desktop)
    }

    return modules
  }

  /**
   * Initialize desktop modules
   *
   * @private
   */
  private initializeDesktopModules() {
    const desktopModules = this.getDesktopModulesFromConfig()

    for (const desktopModule of desktopModules) {
      this.createDesktopModule(desktopModule)
    }
  }

  /**
   * Load desktop modules that have been defined in the client.extensions.ts
   */
  public createDesktopModule(desktopModule: OwdModuleDesktop) {
    if (!this.modules[desktopModule.config.area]) {
      this.modules[desktopModule.config.area] = {}
    }

    if (!desktopModule.config.position) {
      desktopModule.config.position = 'default'
    }

    if (!this.modules[desktopModule.config.area][desktopModule.config.position]) {
      this.modules[desktopModule.config.area][desktopModule.config.position] = []
    }

    this.modules[desktopModule.config.area][desktopModule.config.position].push({
      config: desktopModule.config,
      components: markRaw(desktopModule.components)
    })
  }
}