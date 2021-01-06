// @ts-ignore
import {markRaw} from 'vue'
import {OwdCoreModulesContext, OwdModuleDesktopConfig, OwdModulesDesktop} from "../../../../../types";

const modulesDesktop: OwdModulesDesktop = {
  'system-bar': {}
}

export default class ModulesDesktop {
  constructor(context: OwdCoreModulesContext) {
    this.loadDesktopSystemModules(context)
  }

  /**
   * Load desktop system modules
   *
   * @param context
   */
  loadDesktopSystemModules(context: OwdCoreModulesContext) {
    // @ts-ignore
    const owdModulesDesktopSystemBar = context.app.config.owd.desktop.systemBar.modules

    for (const module of Object.keys(owdModulesDesktopSystemBar)) {
      if (owdModulesDesktopSystemBar[module]) {
        require(`../../../modules/desktop/system-bar/${module}`)
      }
    }
  }

  /**
   * Get desktop modules
   *
   * @param area
   * @param position
   */
  static getModules(area?: string, position?: string) {
    if (area && position && modulesDesktop[area]) {
      return modulesDesktop[area][position]
    } else if (area) {
      return modulesDesktop[area]
    }

    return modulesDesktop
  }

  /**
   * Register desktop module
   *
   * @param config
   * @param components
   */
  static registerModule(config: OwdModuleDesktopConfig, components: any) {
    if (!modulesDesktop[config.area]) {
      modulesDesktop[config.area] = {}
    }

    if (!modulesDesktop[config.area][config.position]) {
      modulesDesktop[config.area][config.position] = []
    }

    modulesDesktop[config.area][config.position].push({
      config,
      components: markRaw(components)
    })
  }
}