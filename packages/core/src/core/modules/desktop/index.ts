import {reactive,markRaw} from 'vue'
import {
  OwdModuleDesktop,
  OwdModulesDesktop
} from "@owd-client/types";
import CoreModule from "../../core.module";

export default class CoreModulesDesktop extends CoreModule {
  private _modules: OwdModulesDesktop = {}

  constructor(ctx) {
    super(ctx)
  }

  public initialize() {
    this.registerDesktopEnvironment()
    this.initializeDesktopModules()
  }

  public terminate() {
    this._modules = {}
  }

  /**
   * Register desktop modules to global property $owd,
   * then register a global vue component called <Desktop> and provide desktop options
   */
  registerDesktopEnvironment() {
    // provide desktop options
    this.app.provide('desktopConfig', this.theme)

    // provide desktop modules
    this.app.provide('desktopModules', {
      list: reactive(this._modules),
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

    if (Object.prototype.hasOwnProperty.call(this.theme, 'modules')) {
      modules = modules.concat(this.theme.modules)
    }

    if (
        Object.prototype.hasOwnProperty.call(this.extensions, 'modules') &&
        Object.prototype.hasOwnProperty.call(this.extensions.modules, 'desktop')
    ) {
      modules = modules.concat(this.extensions.modules.desktop)
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
    if (!Object.prototype.hasOwnProperty.call(this._modules, desktopModule.config.area)) {
      this._modules[desktopModule.config.area] = {}
    }

    // set default position if missing
    if (!desktopModule.config.position) {
      desktopModule.config.position = 'default'
    }

    if (!Object.prototype.hasOwnProperty.call(this._modules[desktopModule.config.area], desktopModule.config.position)) {
      this._modules[desktopModule.config.area][desktopModule.config.position] = []
    }

    this._modules[desktopModule.config.area][desktopModule.config.position].push({
      config: desktopModule.config,
      components: markRaw(desktopModule.components)
    })
  }
}