import {Module, RegisterOptions, VuexModule} from "vuex-class-modules";
import ModulesAppModule from "../storeModulesApp";
import {OwdModuleAppWindowConfig} from "@owd-client/types";

@Module
export default class WindowCategoryModule extends VuexModule {
  private readonly modulesAppModule: ModulesAppModule

  constructor(
    modulesAppModule: ModulesAppModule,
    options: RegisterOptions
  ) {
    super(options);
    this.modulesAppModule = modulesAppModule
  }

  /**
   * App window categories (window categories of each installed module)
   * keymap by window category
   */
  get modulesAppWindowCategories() {
    let windowCategories: { [key: string]: OwdModuleAppWindowConfig[] } = {}

    const windowCategoriesFavorite: OwdModuleAppWindowConfig[] = []
    const windowCategoriesOther: OwdModuleAppWindowConfig[] = []

    // for each loaded module
    for (const owdModuleApp of this.modulesAppModule.modulesAppList) {

      // skip if module doesn't have any window
      if (!owdModuleApp.moduleInfo.windows) continue

      // for each window config
      for (const owdModuleAppWindowConfig of owdModuleApp.moduleInfo.windows) {
        if (
          typeof owdModuleAppWindowConfig.hostname !== 'undefined' &&
          owdModuleAppWindowConfig.hostname !== window.location.hostname
        ) {
          continue
        }

        if (owdModuleAppWindowConfig.menuApp === false) {
          continue
        }

        if (!owdModuleAppWindowConfig.category || owdModuleAppWindowConfig.category === 'other') {

          owdModuleAppWindowConfig.category = 'other'

          // add to special category list "other"
          windowCategoriesOther.push(owdModuleAppWindowConfig)

          continue
        }

        // add to special category list "favorite"
        if (owdModuleAppWindowConfig.favorite) {
          windowCategoriesFavorite.push(owdModuleAppWindowConfig)
        }

        // map window categories
        if (!Object.prototype.hasOwnProperty.call(windowCategories, owdModuleAppWindowConfig.category)) {
          windowCategories[owdModuleAppWindowConfig.category] = []
        }

        windowCategories[owdModuleAppWindowConfig.category].push(owdModuleAppWindowConfig)
      }

    }

    // reorder categories
    windowCategories = Object.keys(windowCategories)
      .sort()
      .reduce((obj: any, key: string) => {
        obj[key] = windowCategories[key]

        return obj;
      }, {})

    // add "favorite" category at start, if category exists
    if (windowCategoriesFavorite.length > 0) {
      windowCategories = Object.assign({
        favorites: windowCategoriesFavorite
      }, windowCategories)
    }

    // add "other" category at the end, if category exists
    if (windowCategoriesOther.length > 0) {
      windowCategories = Object.assign(windowCategories, {
        other: windowCategoriesOther
      })
    }

    // reorder window list for each category
    for (const categoryName in windowCategories) {
      windowCategories[categoryName] = windowCategories[categoryName].sort((a, b) => {
        a.titleApp = a.titleApp || a.title
        b.titleApp = b.titleApp || b.title

        if (a.titleApp < b.titleApp) {
          return -1;
        }
        if (a.titleApp > b.titleApp) {
          return 1;
        }

        return 0;
      })
    }

    // return ordered categories + favorite and other categories
    return windowCategories
  }
}