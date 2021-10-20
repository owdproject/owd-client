import {reactive,markRaw} from 'vue'
import {
  OwdCoreContext, OwdModuleDesktop,
  OwdModulesDesktop
} from "@owd-client/types";

export default class DesktopModules {
  private readonly context;
  private modules: OwdModulesDesktop = {}

  constructor(context: OwdCoreContext) {
    this.context = context

    this.registerDesktopEnvironment()
    this.initializeDesktopModules()
  }

  /**
   * Register desktop modules to global property $owd,
   * then register a global vue component called <Desktop> and provide desktop options
   */
  registerDesktopEnvironment() {
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
      this.registerDesktopModule(desktopModule)
    }
  }

  /**
   * Register a new desktop module
   */
  public registerDesktopModule(desktopModule: OwdModuleDesktop) {
    // define module area
    if (!Object.prototype.hasOwnProperty.call(this.modules, desktopModule.config.area)) {
      this.modules[desktopModule.config.area] = {}
    }

    // set default position if missing
    if (!desktopModule.config.position) {
      desktopModule.config.position = 'default'
    }

    if (!Object.prototype.hasOwnProperty.call(this.modules[desktopModule.config.area], desktopModule.config.position)) {
      this.modules[desktopModule.config.area][desktopModule.config.position] = []
    }

    this.modules[desktopModule.config.area][desktopModule.config.position].push({
      config: desktopModule.config,
      components: markRaw(desktopModule.components)
    })
  }
}