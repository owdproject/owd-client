import {Module, Mutation, VuexModule} from "vuex-class-modules";
import * as owdModuleAppWindowsStorageUtils from "../../utils/windows/windowsLocalStorage.utils";

@Module
export default class WindowFocusModule extends VuexModule {
  public windowFocusIds: string[] = owdModuleAppWindowsStorageUtils.loadWindowStorageFocuses()

  get windowFocusList() {
    return this.windowFocusIds
  }

  get windowFocusActiveUniqueID() {
    if (this.windowFocusIds.length > 0) {
      return this.windowFocusIds[this.windowFocusIds.length - 1]
    }

    return null
  }

  @Mutation
  SET_WINDOW_FOCUS(uniqueID: string) {
    const windowFocusIndex = this.windowFocusIds.indexOf(uniqueID)

    if (windowFocusIndex > -1) {
      this.windowFocusIds.splice(windowFocusIndex, 1)
    }

    this.windowFocusIds.push(uniqueID)

    owdModuleAppWindowsStorageUtils.saveWindowStorageFocuses(this.windowFocusIds)
  }

  @Mutation
  UNSET_WINDOW_FOCUS(uniqueID: string) {
    const windowFocusIndex = this.windowFocusIds.indexOf(uniqueID)

    if (windowFocusIndex > -1) {
      this.windowFocusIds.splice(windowFocusIndex, 1)
    }
  }
}