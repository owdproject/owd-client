import {VuexModule, Module, Mutation, Action} from "vuex-class-modules";
import {OwdModule} from "../../../types";

@Module
export default class ModulesModule extends VuexModule {
  private modules: {[key: string]: OwdModule} = {}
  private categories: any = {}

  get modulesLoaded() {
    return this.modules
  }

  get modulesWindowsNameKeyMap() {
    const owdModuleWindowNameKeyMap: any = {}

    for (const owdModule of Object.values(this.modules)) {
      for (const owdWindows of Object.values(owdModule.windowInstances)) {
        for (const owdWindow of Object.values(owdWindows)) {
          owdModuleWindowNameKeyMap[owdWindow.config.name] = owdWindow
        }
      }
    }

    return owdModuleWindowNameKeyMap
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
  getModuleFromWindowName(windowName: string): OwdModule|undefined {
    if (typeof this.modulesWindowsNameKeyMap[windowName] !== 'undefined') {
      return this.modulesWindowsNameKeyMap[windowName]
    }
  }
}