import {reactive,markRaw} from 'vue'
import {
  OwdCoreModulesContext,
  OwdModulesDesktop
} from "@owd-client/types";

export default class ModuleDesktopExtend {
  private readonly app
  private readonly config
  private readonly extensions
  private readonly store

  private desktopModules: OwdModulesDesktop = {}

  constructor(context: OwdCoreModulesContext) {
    this.app = context.app
    this.config = context.config
    this.extensions = context.extensions
    this.store = context.store

    this.loadDesktopModules()
    this.registerDesktopEnvironment()
  }

  registerDesktopEnvironment() {
    const desktopComponent = this.extensions.desktop.component

    // vue component sync registration
    this.app.component('Desktop', desktopComponent)

    // vue provide desktop options
    this.app.provide('desktopOptions', this.extensions.desktop.options)
  }

  /**
   * Load OWD desktop modules from owd config
   */
  loadDesktopModules() {
    const desktopModules = this.extensions.desktop.modules

    if (desktopModules) {
      for (const desktopModule of desktopModules) {
        this.registerDesktopModule(desktopModule)
      }
    }

    // assign desktop modules to $owd.desktopModules
    this.app.config.globalProperties.$owd.desktopModules = {
      list: reactive(this.desktopModules),
      get: function(area?: string, position?: string) {
        if (area && position && this.list[area]) {
          return this.list[area][position]
        } else if (area) {
          return this.list[area]
        }

        return {}
      }
    }
  }

  /**
   * Register desktop module
   *
   * @param desktopModule
   */
  registerDesktopModule(desktopModule: any) {
    if (!this.desktopModules[desktopModule.config.area]) {
      this.desktopModules[desktopModule.config.area] = {}
    }

    if (!desktopModule.config.position) {
      desktopModule.config.position = 'default'
    }

    if (!this.desktopModules[desktopModule.config.area][desktopModule.config.position]) {
      this.desktopModules[desktopModule.config.area][desktopModule.config.position] = []
    }

    this.desktopModules[desktopModule.config.area][desktopModule.config.position].push({
      config: desktopModule.config,
      components: markRaw(desktopModule.components)
    })
  }
}