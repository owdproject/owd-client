import {Module, Mutation, VuexModule} from "vuex-class-modules";
import * as owdModuleAppWindowsStorageUtils from "../../utils/windows/windowsLocalStorage.utils";

@Module
export default class WindowFocusModule extends VuexModule {
  public windowFocusIds: string[] = owdModuleAppWindowsStorageUtils.loadWindowStorageFocuses()

  get windowFocusList() {
    return this.windowFocusIds
  }

  @Mutation
  SET_WINDOW_FOCUS(uniqueID: string) {
    const windowFocusIndex = this.windowFocusIds.indexOf(uniqueID)

    if (windowFocusIndex > -1) {
      this.windowFocusIds.splice(windowFocusIndex, 1)
    }

    this.windowFocusIds.push(uniqueID)
  }
}