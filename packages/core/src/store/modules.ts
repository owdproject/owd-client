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
    const modulesWindowsNameKeyMap: any = {}

    for (const moduleLoaded of Object.values(this.modules)) {
      for (const moduleWindows of Object.values(moduleLoaded.windowsInstances)) {
        for (const moduleWindow of Object.values(moduleWindows)) {
          modulesWindowsNameKeyMap[moduleWindow.config.name] = moduleLoaded
        }
      }
    }

    return modulesWindowsNameKeyMap
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