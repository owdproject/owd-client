import {reactive,markRaw} from 'vue'
import {
  OwdCoreModuleContext, OwdModuleApp, OwdModuleDesktop,
  OwdModulesDesktop
} from "@owd-client/types";

export default class ModuleDesktopExtend {
  private readonly context;
  private modules: OwdModulesDesktop = {}

  constructor(context: OwdCoreModuleContext) {
    this.context = context

    this.initializeModulesDesktop()
    this.registerDesktopEnvironment()
  }

  /**
   * Get desktop modules from client.extensions.ts
   *
   * @private
   */
  private getModulesDesktopFromConfig() {
    let modules = []

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
  private initializeModulesDesktop() {
    const modulesDesktop = this.getModulesDesktopFromConfig()

    for (const moduleDesktop of modulesDesktop) {
      this.createModuleDesktop(moduleDesktop)
    }
  }

  /**
   * Load desktop modules that have been defined in the client.extensions.ts
   */
  public createModuleDesktop(moduleDesktop: OwdModuleDesktop) {
    if (!this.modules[moduleDesktop.config.area]) {
      this.modules[moduleDesktop.config.area] = {}
    }

    if (!moduleDesktop.config.position) {
      moduleDesktop.config.position = 'default'
    }

    if (!this.modules[moduleDesktop.config.area][moduleDesktop.config.position]) {
      this.modules[moduleDesktop.config.area][moduleDesktop.config.position] = []
    }

    this.modules[moduleDesktop.config.area][moduleDesktop.config.position].push({
      config: moduleDesktop.config,
      components: markRaw(moduleDesktop.components)
    })
  }

  /**
   * Register desktop modules to global property $owd,
   * then register a global vue component called <Desktop> and provide desktop options
   */
  registerDesktopEnvironment() {
    // assign desktop modules to $owd.desktopModules
    this.context.app.config.globalProperties.$owd.desktopModules = {
      list: reactive(this.modules),
      get: function(area?: string, position?: string) {
        if (area && position && this.list[area]) {
          return this.list[area][position]
        } else if (area) {
          return this.list[area]
        }

        return {}
      }
    }

    const desktopComponent = this.context.extensions.desktop.component

    // register desktop vue component
    this.context.app.component('Desktop', desktopComponent)

    // provide desktop options
    this.context.app.provide('desktopOptions', this.context.extensions.desktop.options)
  }
}