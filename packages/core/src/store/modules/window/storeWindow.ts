import {VuexModule, Module, Action, RegisterOptions, Mutation} from "vuex-class-modules";

import WindowFocusModule from "./storeWindowFocus";

import * as helperStorage from "@owd-client/core/src/helpers/helperStorage";

import {
  OwdModuleAppWindowInstance, OwdModuleAppWindowsStorage
} from "@owd-client/types";

@Module
export default class StoreWindow extends VuexModule {
  private readonly windowFocusModule: WindowFocusModule

  // all window instances
  private readonly windows: {[uniqueID: string]: OwdModuleAppWindowInstance} = {}

  // get owd windows storage from local storage
  private readonly storage: {
    value: OwdModuleAppWindowsStorage,
    saveTimeout: any
  } = {
    value: helperStorage.loadStorage('window') || {},
    saveTimeout: null
  }

  constructor(
    windowFocusModule: WindowFocusModule,
    options: RegisterOptions
  ) {
    super(options);
    this.windowFocusModule = windowFocusModule
  }

  /**
   * Window instances list (array of window instances)
   */
  get modulesAppWindowInstances() {
    return Object.values(this.windows)
  }

  @Mutation
  REGISTER_WINDOW_INSTANCE(windowInstance: OwdModuleAppWindowInstance) {
    this.windows[windowInstance.uniqueID] = windowInstance
  }

  @Mutation
  UNREGISTER_WINDOW_INSTANCE(windowInstance: OwdModuleAppWindowInstance) {
    delete this.windows[windowInstance.uniqueID]
  }

  /**
   * Initialize window behaviours
   */
  @Action
  initialize() {
    // restore previous window focus
    this.windowFocusModule.restorePreviousWindowFocus()
  }

  /**
   * Reset entire windows storage
   */
  @Action
  resetWindowsStorage() {
    helperStorage.resetStorage('window')
    helperStorage.resetStorage('window-focus')
  }

  /**
   * Set all windows hidden
   */
  @Action
  async windowMinimizeAll(): Promise<void> {
    for (const windowInstance of this.modulesAppWindowInstances) {
      windowInstance.minimize()
    }
  }

  /**
   * Set all windows not maximized
   */
  @Action
  async windowUnmaximizeAll(): Promise<void> {
    for (const windowInstance of this.modulesAppWindowInstances) {
      windowInstance.maximize(false)
    }
  }

  /**
   * Set all windows not maximized
   */
  @Action
  async windowUnfullscreenAll(): Promise<void> {
    for (const windowInstance of this.modulesAppWindowInstances) {
      windowInstance.fullscreen(false)
    }
  }

  /**
   * Close all windows
   */
  @Action
  async windowCloseAll(): Promise<void> {
    for (const windowInstance of this.modulesAppWindowInstances) {
      windowInstance.destroy()
    }
  }

  /**
   * Run adjustPosition() on all window instances
   */
  @Action
  async windowsAdjustPosition(): Promise<void> {
    for (const windowInstance of this.modulesAppWindowInstances) {
      windowInstance.adjustPosition()
    }
  }
}
