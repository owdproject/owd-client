import {VuexModule, Module, Mutation} from "vuex-class-modules";
import {OwdModuleApp} from "@owd-client/types";

@Module
export default class ModuleAppVuexModule extends VuexModule {
  private modulesAppProvider: any = null

  /**
   * Array of installed modules app
   */
  get modulesAppList(): OwdModuleApp[] {
    return Object.values(this.modulesAppProvider.modules)
  }

  /**
   * KeyMap of installed modules app
   */
  get modulesAppKeyMap(): { [moduleName: string]: OwdModuleApp } {
    return this.modulesAppProvider.modules
  }

  @Mutation
  REGISTER_MODULES_PROVIDER(modulesAppProvider: any) {
    this.modulesAppProvider = modulesAppProvider
  }
}