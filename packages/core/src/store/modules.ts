import {VuexModule, Module, Mutation, Action} from "vuex-class-modules";
import {
  OwdModuleApp,
  OwdModuleAppWindowConfig, OwdModuleAppWindowDetail, OwdModuleAppWindowInstance
} from "../../../types";

@Module
export default class ModulesVuexModule extends VuexModule {
  private modules: { [key: string]: OwdModuleApp } = {}

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
   * App window details (module config + window config)
   * keymap by window name
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
      groups: { [key: string]: OwdModuleAppWindowInstance[] }
    } = {
      list: [],
      groups: {}
    }

    // for each loaded module
    for (const owdModuleApp of this.modulesAppInstalled) {

      // for each window config
      for (const owdModuleAppWindowConfig of owdModuleApp.moduleInfo.windows) {
        const windowName = owdModuleAppWindowConfig.name

        for (const uniqueID in owdModuleApp.windowInstances[windowName]) {
          const windowInstance = owdModuleApp.windowInstances[windowName][uniqueID]

          // add to instances list
          owdModuleAppWindowInstances.list.push(windowInstance)

          // add to instances groups
          if (!Object.prototype.hasOwnProperty.call(owdModuleAppWindowInstances.groups, windowName)) {
            owdModuleAppWindowInstances.groups[windowName] = []
          }

          owdModuleAppWindowInstances.groups[windowName].push(windowInstance)
        }

      }
    }

    return owdModuleAppWindowInstances
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