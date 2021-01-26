// @ts-ignore
import {markRaw} from 'vue'
import {OwdCoreModulesContext, OwdModuleDesktopConfig, OwdModulesDesktop} from "../../../../../types";

const modulesDesktopExtendClass: OwdModulesDesktop = {
  'system-bar': {}
}

export default class ModulesDesktop {
  constructor(context: OwdCoreModulesContext) {
    this.loadModulesDesktopSystem(context)
  }

  /**
   * Load OWD desktop system modules
   *
   * @param context
   */
  loadModulesDesktopSystem(context: OwdCoreModulesContext) {
    // @ts-ignore
    const owdModulesDesktopSystemBar = context.app.config.owd.desktop.systemBar.modules

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
  static getModules(area?: string, position?: string) {
    if (area && position && modulesDesktopExtendClass[area]) {
      return modulesDesktopExtendClass[area][position]
    } else if (area) {
      return modulesDesktopExtendClass[area]
    }

    return modulesDesktopExtendClass
  }

  /**
   * Register desktop module
   *
   * @param config
   * @param components
   */
  static registerModule(config: OwdModuleDesktopConfig, components: any) {
    if (!modulesDesktopExtendClass[config.area]) {
      modulesDesktopExtendClass[config.area] = {}
    }

    if (!modulesDesktopExtendClass[config.area][config.position]) {
      modulesDesktopExtendClass[config.area][config.position] = []
    }

    modulesDesktopExtendClass[config.area][config.position].push({
      config,
      components: markRaw(components)
    })
  }
}