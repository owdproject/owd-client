import {VuexModule, Module, Mutation, Action} from "vuex-class-modules";
import {OwdModuleApp, OwdModuleAppWindowConfig, OwdModuleAppWindowInstance} from "../../../types";

@Module
export default class ModulesModule extends VuexModule {
  private modules: {[key: string]: OwdModuleApp} = {}
  private categories: any = {}

  get modulesLoaded() {
    return this.modules
  }


  /**
   * Getter of windows instances grouped by category (productivity, etc)
   */
  get moduleApps(): {[key: string]: OwdModuleAppWindowConfig[]} {
    let owdWindowCategories: {[key: string]: OwdModuleAppWindowConfig[]} = {}

    // for each loaded module
    for (const owdModuleApp of Object.values(this.modulesLoaded)) {

      // cycle windowName in each module window instances (WindowSample)
      for (const owdModuleAppWindow of owdModuleApp.moduleInfo.windows) {
        if (typeof owdWindowCategories[owdModuleAppWindow.category] === 'undefined') {
          owdWindowCategories[owdModuleAppWindow.category] = []
        }

        owdWindowCategories[owdModuleAppWindow.category].push(owdModuleAppWindow)
      }

    }

    return owdWindowCategories
  }

  get infoWindowNameKeyMap() {
    const owdModuleAppWindowNameKeyMap: any = {}

    for (const owdModuleApp of Object.values(this.modules)) {
      for (const owdModuleAppWindow of owdModuleApp.moduleInfo.windows) {
        owdModuleAppWindowNameKeyMap[owdModuleAppWindow.name] = {
          module: owdModuleApp,
          window: owdModuleAppWindow
        }
      }
    }

    return owdModuleAppWindowNameKeyMap
  }

  get modulesCategories() {
    return this.categories
  }

  @Mutation
  SET_MODULES_LOADED(modulesLoaded: any) {
    this.modules = modulesLoaded
  }

  @Mutation
  SET_MODULES_CATEGORIES(modulesCategories: any) {
    this.categories = modulesCategories
  }

  @Action
  isModuleLoaded(module: string): boolean {
    return Object.keys(this.modulesLoaded).includes(module)
  }

  @Action
  getDetailFromWindowName(windowName: string): { window: OwdModuleAppWindowConfig, module: OwdModuleApp } | undefined {
    if (typeof this.infoWindowNameKeyMap[windowName] !== 'undefined') {
      return this.infoWindowNameKeyMap[windowName]
    }
  }
}