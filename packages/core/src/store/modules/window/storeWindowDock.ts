import {Module, RegisterOptions, VuexModule} from "vuex-class-modules";
import ModulesModule from "../storeModules";

@Module
export default class WindowDockModule extends VuexModule {
  private readonly modulesModule: ModulesModule

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
    let items: any[] = []

    for (const owdModuleApp of this.modulesModule.modulesAppInstalled) {

      // does module contain any windows?
      if (owdModuleApp.moduleInfo.windows && owdModuleApp.moduleInfo.windows.length > 0) {

        // skip if module doesn't have any window
        if (!owdModuleApp.moduleInfo.windows) continue

        for (const owdModuleAppWindowConfig of owdModuleApp.moduleInfo.windows) {

          let windowInstances: any[] = []

          if (owdModuleApp.windowInstances[owdModuleAppWindowConfig.name]) {
            windowInstances = Object.values(owdModuleApp.windowInstances[owdModuleAppWindowConfig.name])
          }

          if (windowInstances.length === 0) {

            if (!owdModuleAppWindowConfig.favorite) {
              continue
            }

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
            items = items.concat(windowInstances)
          }

        }

      }

    }

    return items
  }
}