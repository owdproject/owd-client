import {Action, Module, Mutation, VuexModule} from "vuex-class-modules";
import * as helperStorage from "@owd-client/core/src/helpers/helperStorage";
import * as helperWindow from "../../../helpers/helperWindow";

@Module
export default class StoreWindowFocus extends VuexModule {
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

    helperStorage.saveStorage('window-focus', this.windowFocusIds)
  }

  @Action
  getWindowFocusIndex(uniqueID: string) {
    return this.windowFocusIds.indexOf(uniqueID)
  }

  @Action
  restorePreviousWindowFocus() {
    const focusedWindowUniqueID = this.windowFocusActiveUniqueID

    if (focusedWindowUniqueID) {
      const windowInstance = helperWindow.findWindowInstanceByAttr('uniqueID', focusedWindowUniqueID)

      if (windowInstance) {
        windowInstance.storage.focused = true
      }
    }
  }
}