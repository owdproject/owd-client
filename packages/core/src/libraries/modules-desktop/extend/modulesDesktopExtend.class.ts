// @ts-ignore
import {markRaw} from 'vue'
import {OwdCoreModulesContext, OwdModuleDesktopConfig, OwdModulesDesktop} from "../../../../../types";

const desktopModules: OwdModulesDesktop = {
  'system-bar': {}
}

export default class ModulesDesktop {
  constructor(context: OwdCoreModulesContext) {
    this.loadSystemDesktopModules(context)
  }

  /**
   * Load OWD desktop system modules
   *
   * @param context
   */
  loadSystemDesktopModules(context: OwdCoreModulesContext) {
    // @ts-ignore
    const owdModulesDesktopSystemBar = context.app.config.owd.desktop.SystemBar.modules

    for (const moduleName of owdModulesDesktopSystemBar) {
      try {
        // todo require only if system-bar is enabled
        require(`../../../modules/desktop/SystemBar/${moduleName}/index.ts`)
      } catch(e) {
        console.error(`[OWD] Error while loading "${moduleName}" desktop module`)
      }
    }
  }

  /**
   * Get desktop modules
   *
   * @param area
   * @param position
   */
  static getDesktopModules(area?: string, position?: string) {
    if (area && position && desktopModules[area]) {
      return desktopModules[area][position]
    } else if (area) {
      return desktopModules[area]
    }

    return desktopModules
  }

  /**
   * Register desktop module
   *
   * @param config
   * @param components
   */
  static registerDesktopModule(config: OwdModuleDesktopConfig, components: any) {
    if (!desktopModules[config.area]) {
      desktopModules[config.area] = {}
    }

    if (!desktopModules[config.area][config.position]) {
      desktopModules[config.area][config.position] = []
    }

    desktopModules[config.area][config.position].push({
      config,
      components: markRaw(components)
    })
  }
}