import {VuexModule, Module, Mutation, Action} from "vuex-class-modules";
import {
  OwdModuleApp
} from "@owd-client/types";

@Module
export default class ModuleAppVuexModule extends VuexModule {
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

  @Mutation
  SET_MODULES_LOADED(modulesLoaded: any) {
    this.modules = modulesLoaded
  }

  @Action
  isModuleLoaded(moduleName: string): boolean {
    return Object.keys(this.modulesAppInstalled).includes(moduleName)
  }
}