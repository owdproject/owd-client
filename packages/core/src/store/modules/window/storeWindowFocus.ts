import {Action, Module, Mutation, VuexModule} from "vuex-class-modules";
import * as helperStorage from "../../../helpers/helperStorage";

@Module
export default class WindowFocusModule extends VuexModule {
  public windowFocusIds: string[] = helperStorage.loadStorage('window-focus') || []

  get windowFocusList() {
    return this.windowFocusIds
  }

  get windowFocusActiveUniqueID() {
    if (this.windowFocusIds.length > 0) {
      return this.windowFocusIds[this.windowFocusIds.length - 1]
    }

    return null
  }

  get windowFocusNewIndex() {
    return this.windowFocusIds.length - 1
  }

  @Mutation
  SET_WINDOW_FOCUS(uniqueID: string) {
    const windowFocusIndex = this.windowFocusIds.indexOf(uniqueID)

    if (windowFocusIndex > -1) {
      this.windowFocusIds.splice(windowFocusIndex, 1)
    }

    this.windowFocusIds.push(uniqueID)

    helperStorage.saveStorage('window-focus', this.windowFocusIds)
  }

  @Mutation
  UNSET_WINDOW_FOCUS(uniqueID: string) {
    const windowFocusIndex = this.windowFocusIds.indexOf(uniqueID)

    if (windowFocusIndex > -1) {
      this.windowFocusIds.splice(windowFocusIndex, 1)
    }
  }

  @Action
  getWindowFocusIndex(uniqueID: string) {
    return this.windowFocusIds.indexOf(uniqueID)
  }
}