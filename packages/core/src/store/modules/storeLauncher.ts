import {VuexModule, Module, Mutation} from "vuex-class-modules";
import {OwdLauncher, OwdLauncherEntry} from "@owd-client/types";

@Module
export default class StoreLauncher extends VuexModule {
  private launcher: OwdLauncher = {}

  /**
   * Get launcher sorted categories
   */
  get categories(): string[] {
    const categories: string[] = Object.keys(this.launcher).sort()

    const indexFavorites = categories.indexOf('favorites')
    const indexOther = categories.indexOf('other')

    // reorder favorites category
    if (indexFavorites > 0) {
      categories.splice(indexFavorites, 1)
      categories.unshift('favorites')
    }

    // reorder other category
    if (indexOther > 0) {
      categories.splice(indexOther, 1)
      categories.push('other')
    }

    return categories
  }

  /**
   * Get launcher categories
   */
  get items(): OwdLauncher {
    return this.launcher
  }

  @Mutation
  ADD(item: OwdLauncherEntry) {
    if (!item.category) {
      item.category = 'other'
    }

    // define this new launcher category
    if (!Object.prototype.hasOwnProperty.call(this.launcher, item.category)) {
        this.launcher[item.category] = []
    }

    // push launcherEntry into launcher categorized list
    this.launcher[item.category].push(item)

    // is a favorite launcherEntry? add to launcher favorites list
    if (typeof item.favorite === 'boolean' && item.favorite) {
      if (!Object.prototype.hasOwnProperty.call(this.launcher, 'favorite')) {
        this.launcher['favorites'] = []
      }

      this.launcher['favorites'].push(item)
    }
  }

  @Mutation
  REMOVE(item: OwdLauncherEntry) {
    if (!item.category) {
      item.category = 'other'
    }

    // is a known launcher category?
    if (Object.prototype.hasOwnProperty.call(this.launcher, item.category)) {
      const index = this.launcher[item.category].indexOf(item)

      if (index > -1) {
        // remove launcherEntry from launcher categorized list
        this.launcher[item.category].splice(index, 1)

        // delete launcherEntry category name if its list is empty
        if (this.launcher[item.category].length === 0) {
          delete this.launcher[item.category]
        }
      }
    }

    // was a favorite launcherEntry? remove from launcher favorites list
    if (Object.prototype.hasOwnProperty.call(this.launcher, 'favorite')) {
      const indexFavorite = this.launcher['favorite'].indexOf(item)

      if (indexFavorite > -1) {
        // remove launcherEntry from launcher categorized list
        this.launcher['favorites'].splice(indexFavorite, 1)

        // delete launcherEntry category name if its list is empty
        if (this.launcher['favorites'].length === 0) {
          delete this.launcher['favorites']
        }
      }
    }
  }
}
