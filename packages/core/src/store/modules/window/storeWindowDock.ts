import {Action, Module, Mutation, RegisterOptions, VuexModule} from "vuex-class-modules";
import ModulesModule from "../storeModules";
import {OwdModuleAppWindowInstance} from "@owd-client/types";

@Module
export default class WindowDockModule extends VuexModule {
  private readonly modulesModule: ModulesModule

  private items: {[key: string]: any} = {}
  private itemsFavorite: {[key: string]: any} = {}

  constructor(
    modulesModule: ModulesModule,
    options: RegisterOptions
  ) {
    super(options);
    this.modulesModule = modulesModule
  }

  /**
   * Items for the docks
   */
  get modulesAppWindowDocks() {
    const itemsFavorite = {...this.itemsFavorite}

    for (const windowName of this.modulesAppWindowDocksNames) {
      if (Object.prototype.hasOwnProperty.call(itemsFavorite, windowName)) {
        delete itemsFavorite[windowName]
      }
    }

    return {
      ...itemsFavorite,
      ...this.items
    }
  }

  get modulesAppWindowDocksNames() {
    return Object.values(this.items).map((windowInstance: OwdModuleAppWindowInstance) => windowInstance.config.name)
  }

  @Mutation
  ADD_TO_DOCK(windowInstance: OwdModuleAppWindowInstance) {
    this.items[windowInstance.uniqueID] = windowInstance
  }

  @Mutation
  REMOVE_FROM_DOCK(windowInstance: OwdModuleAppWindowInstance) {
    delete this.items[windowInstance.uniqueID]
  }

  @Action
  initialize() {
    for (const owdModuleApp of this.modulesModule.modulesAppInstalled) {

      // does module contain any windows?
      if (owdModuleApp.moduleInfo.windows && owdModuleApp.moduleInfo.windows.length > 0) {

        // skip if module doesn't have any window
        if (!owdModuleApp.moduleInfo.windows) {
          continue
        }

        for (const owdModuleAppWindowConfig of owdModuleApp.moduleInfo.windows) {

          if (!owdModuleAppWindowConfig.favorite) {
            continue
          }

          this.itemsFavorite[owdModuleAppWindowConfig.name] = {
            config: owdModuleAppWindowConfig,
            storage: {
              opened: false,
              minimized: false
            },
            dummy: true
          }

        }

      }

    }
  }
}