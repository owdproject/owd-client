import {VuexModule, Module, Mutation} from "vuex-class-modules";
import {OwdLauncherEntry} from "@owd-client/types";

@Module
export default class StoreLauncher extends VuexModule {
  private launcher: {
    [category: string]: OwdLauncherEntry[]
  } = {}

  get categories() {
    const categories = Object.keys(this.launcher).sort()

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

  get items() {
    return this.launcher
  }

  @Mutation
  ADD(item: OwdLauncherEntry) {
    if (!item.category) {
      item.category = 'other'
    }

    if (!Object.prototype.hasOwnProperty.call(this.launcher, item.category)) {
        this.launcher[item.category] = []
    }

    this.launcher[item.category].push(item)

    // is favorite
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

    if (Object.prototype.hasOwnProperty.call(this.launcher, item.category)) {
      const index = this.launcher[item.category].indexOf(item)

      if (index > -1) {
        this.launcher[item.category].splice(index, 1)
      }

      if (this.launcher[item.category].length === 0) {
        delete this.launcher[item.category]
      }
    }

    // is favorite
    if (Object.prototype.hasOwnProperty.call(this.launcher, 'favorite')) {
      const indexFavorite = this.launcher['favorite'].indexOf(item)

      if (indexFavorite > -1) {
        this.launcher['favorites'].splice(indexFavorite, 1)
      }

      if (this.launcher['favorites'].length === 0) {
        delete this.launcher['favorites']
      }
    }
  }
}
