import {VuexModule, Module, Mutation, Action} from "vuex-class-modules";

@Module
export default class ModulesModule extends VuexModule {
  private modules: any = {}

  get modulesLoaded() {
    return this.modules
  }

  @Mutation
  SET_LOADED_MODULES(modulesLoaded: any) {
    this.modules = modulesLoaded
  }

  @Action
  isModuleLoaded(module: string) {
    return Object.keys(this.modulesLoaded).includes(module)
  }

  @Action
  getLoadedModuleWindowInfo(windowName: string) {
    if (typeof this.modulesLoaded[windowName] !== 'undefined') {
      return this.modulesLoaded[windowName]
    }

    return null
  }
}