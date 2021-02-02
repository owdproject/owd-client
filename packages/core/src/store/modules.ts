import {VuexModule, Module, Mutation, Action} from "vuex-class-modules";
import {
  OwdModuleApp,
  OwdModuleAppWindowConfig, OwdModuleAppWindowDetail, OwdModuleAppWindowInstance
} from "../../../types";

@Module
export default class ModulesVuexModule extends VuexModule {
  private modules: { [moduleName: string]: OwdModuleApp } = {}

  /**
   * App installed
   */
  get modulesAppInstalled() {
    return Object.values(this.modules)
  }

  /**
   * App installed (keymap)
   */
  get modulesAppKeyMap() {
    return this.modules
  }

  /**
   * App window categories (window categories of each installed module)
   * keymap by window category
   */
  get modulesAppWindowCategories() {
    const windowCategories: { [key: string]: OwdModuleAppWindowConfig[] } = {}

    // for each loaded module
    for (const owdModuleApp of this.modulesAppInstalled) {

      // for each window config
      for (const owdModuleAppWindowConfig of owdModuleApp.moduleInfo.windows) {

        // map window categories
        if (!Object.prototype.hasOwnProperty.call(windowCategories, owdModuleAppWindowConfig.category)) {
          windowCategories[owdModuleAppWindowConfig.category] = []
        }

        windowCategories[owdModuleAppWindowConfig.category].push(owdModuleAppWindowConfig)
      }

    }

    return windowCategories
  }

  /**
   * App window details keymap by window name (module config + window config)
   */
  get modulesAppWindowDetails() {
    const windowDetailsKeyMap: { [key: string]: OwdModuleAppWindowDetail } = {};

    // for each loaded module
    for (const owdModuleApp of this.modulesAppInstalled) {

      // for each window config
      for (const owdModuleAppWindowConfig of owdModuleApp.moduleInfo.windows) {

        // map window details
        windowDetailsKeyMap[owdModuleAppWindowConfig.name] = {
          module: owdModuleApp,
          window: owdModuleAppWindowConfig
        }
      }

    }

    return windowDetailsKeyMap
  }

  /**
   * App window instances (array of window instances)
   */
  get modulesAppWindowInstances() {
    const owdModuleAppWindowInstances: {
      list: OwdModuleAppWindowInstance[],
      groups: {
        [key: string]: {
          config: OwdModuleAppWindowConfig | undefined,
          list: OwdModuleAppWindowInstance[]
        }
      }
    } = {
      list: [],
      groups: {}
    }

    // for each loaded module
    for (const owdModuleApp of this.modulesAppInstalled) {

      // for each window config
      for (const owdModuleAppWindowConfig of owdModuleApp.moduleInfo.windows) {
        const windowName: string = owdModuleAppWindowConfig.name

        // add to instances groups
        owdModuleAppWindowInstances.groups[windowName] = {
          config: owdModuleAppWindowConfig,
          list: []
        }

        for (const uniqueID in owdModuleApp.windowInstances[windowName]) {
          const windowInstance = owdModuleApp.windowInstances[windowName][uniqueID]

          // add to instances list
          owdModuleAppWindowInstances.list.push(windowInstance)
          owdModuleAppWindowInstances.groups[windowName].list.push(windowInstance)

        }
      }

    }

    return owdModuleAppWindowInstances
  }

  /**
   * Items for the docks
   */
  get modulesAppWindowDocks() {
    let items: any[] = []

    for (const owdModuleApp of this.modulesAppInstalled) {

      // does module contain any windows?
      if (owdModuleApp.moduleInfo.windows && owdModuleApp.moduleInfo.windows.length > 0) {

        for (const owdModuleAppWindowConfig of owdModuleApp.moduleInfo.windows) {

          let windowInstances: any[] = []

          if (owdModuleApp.windowInstances[owdModuleAppWindowConfig.name]) {
            windowInstances = Object.values(owdModuleApp.windowInstances[owdModuleAppWindowConfig.name])
          }

          if (windowInstances.length === 0) {

            // add dummy item to dock
            items.push({
              config: owdModuleAppWindowConfig,
              storage: {
                opened: false,
                minimized: false
              },
              dummy: true
            })

          } else {
            if (windowInstances.length > 0) {
              items = items.concat(windowInstances)
            }
          }

        }

      }

    }

    return items
  }

  @Mutation
  SET_MODULES_LOADED(modulesLoaded: any) {
    this.modules = modulesLoaded
  }

  @Action
  isModuleLoaded(moduleName: string): boolean {
    return Object.keys(this.modulesAppInstalled).includes(moduleName)
  }
}