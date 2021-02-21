import {Module, RegisterOptions, VuexModule} from "vuex-class-modules";
import ModulesModule from "../storeModules";
import {OwdModuleAppWindowConfig} from "../../../../../types";

@Module
export default class WindowCategoryModule extends VuexModule {
  private readonly modulesModule: ModulesModule

  constructor(
    modulesModule: ModulesModule,
    options: RegisterOptions
  ) {
    super(options);
    this.modulesModule = modulesModule
  }

  /**
   * App window categories (window categories of each installed module)
   * keymap by window category
   */
  get modulesAppWindowCategories() {
    let windowCategoriesTemp: { [key: string]: OwdModuleAppWindowConfig[] } = {}

    const windowCategoriesFavorite: OwdModuleAppWindowConfig[] = []
    const windowCategoriesOther: OwdModuleAppWindowConfig[] = []

    // for each loaded module
    for (const owdModuleApp of this.modulesModule.modulesAppInstalled) {

      // for each window config
      for (const owdModuleAppWindowConfig of owdModuleApp.moduleInfo.windows) {

        if (!owdModuleAppWindowConfig.category) {

          // assign to "other" category if windowConfig.category is missing
          owdModuleAppWindowConfig.category = 'other'

          // add to "other" special category list
          windowCategoriesOther.push(owdModuleAppWindowConfig)

          continue
        }

        // add to "favorite" special category list
        if (owdModuleAppWindowConfig.favorite) {
          windowCategoriesFavorite.push(owdModuleAppWindowConfig)
        }

        // map window categories
        if (!Object.prototype.hasOwnProperty.call(windowCategoriesTemp, owdModuleAppWindowConfig.category)) {
          windowCategoriesTemp[owdModuleAppWindowConfig.category] = []
        }

        windowCategoriesTemp[owdModuleAppWindowConfig.category].push(owdModuleAppWindowConfig)
      }

    }

    // reorder categories
    windowCategoriesTemp = Object.keys(windowCategoriesTemp)
      .sort()
      .reduce((obj: any, key: string) => {
        obj[key] = windowCategoriesTemp[key]

        return obj;
      }, {})

    // add favorites at start, if category exists
    if (windowCategoriesFavorite.length > 0) {
      windowCategoriesTemp = Object.assign({
        favorites: windowCategoriesFavorite
      }, windowCategoriesTemp)
    }

    // add other at the end, if category exists
    if (windowCategoriesOther.length > 0) {
      windowCategoriesTemp = Object.assign(windowCategoriesTemp, {
        other: windowCategoriesOther
      })
    }

    // reorder window list for each category
    for (const categoryName in windowCategoriesTemp) {
      windowCategoriesTemp[categoryName] = windowCategoriesTemp[categoryName].sort((a, b) => {
        if (a.titleShort < b.titleShort) {
          return -1;
        }
        if (a.titleShort > b.titleShort) {
          return 1;
        }

        return 0;
      })
    }

    // return ordered categories + favorite and other categories
    return windowCategoriesTemp
  }
}