import {VuexModule, Module, Mutation, Action, RegisterOptions} from "vuex-class-modules";

import ModuleAppWindow from "@owd-client/core/src/libraries/moduleApp/moduleAppWindow.class";

import DebugModule from "../storeDebug";
import ModulesModule from "../storeModules";
import FullScreenModule from "../storeFullscreen";
import WindowFocusModule from "./storeWindowFocus";

import * as helperWindow from '@owd-client/core/src/helpers/helperWindow'
import * as helperStorage from "@owd-client/core/src/helpers/helperStorage";

import {
  OwdModuleApp,
  OwdModuleAppWindowConfig,
  OwdModuleAppWindowConfigPosition, OwdModuleAppWindowConfigSize,
  OwdModuleAppWindowCreateInstanceData,
  OwdModuleAppWindowInstance, OwdModuleAppWindowsStorage
} from "@owd-client/types";

@Module
export default class WindowModule extends VuexModule {
  private readonly storage: any

  private readonly debugModule: DebugModule
  private readonly modulesModule: ModulesModule
  private readonly fullscreenModule: FullScreenModule
  private readonly windowFocusModule: WindowFocusModule

  constructor(
    debugModule: DebugModule,
    modulesModule: ModulesModule,
    fullscreenModule: FullScreenModule,
    windowFocusModule: WindowFocusModule,
    options: RegisterOptions
  ) {
    super(options);
    this.debugModule = debugModule
    this.modulesModule = modulesModule
    this.fullscreenModule = fullscreenModule
    this.windowFocusModule = windowFocusModule

    this.storage = helperStorage.loadStorage('window') || []
  }

  /**
   * Window instances list (array of window instances)
   */
  get modulesAppWindowInstancesList() {
    const owdModuleAppWindowInstances: OwdModuleAppWindowInstance[] = []

    // for each loaded module
    for (const owdModuleApp of this.modulesModule.modulesAppInstalled) {

      // skip if module doesn't have any window
      if (!owdModuleApp.moduleInfo.windows) continue

      // for each window config
      for (const owdModuleAppWindowConfig of owdModuleApp.moduleInfo.windows) {
        const windowName: string = owdModuleAppWindowConfig.name

        for (const uniqueID in owdModuleApp.windowInstances[windowName]) {
          const windowInstance = owdModuleApp.windowInstances[windowName][uniqueID]

          // add to instances list
          owdModuleAppWindowInstances.push(windowInstance)

        }
      }

    }

    return owdModuleAppWindowInstances
  }

  /**
   * Window instances grouped by windowName (array of window instances)
   */
  get modulesAppWindowInstancesGroup() {
    const owdModuleAppWindowInstances: {
      [key: string]: {
        module: OwdModuleApp | undefined,
        config: OwdModuleAppWindowConfig | undefined,
        list: OwdModuleAppWindowInstance[]
      }
    } = {}

    // for each loaded module
    for (const owdModuleApp of this.modulesModule.modulesAppInstalled) {

      // skip if module doesn't have any window
      if (!owdModuleApp.moduleInfo.windows) continue

      // for each window config
      for (const owdModuleAppWindowConfig of owdModuleApp.moduleInfo.windows) {
        const windowName: string = owdModuleAppWindowConfig.name

        // add to instances groups
        owdModuleAppWindowInstances[windowName] = {
          module: owdModuleApp,
          config: owdModuleAppWindowConfig,
          list: []
        }

        for (const uniqueID in owdModuleApp.windowInstances[windowName]) {
          const windowInstance = owdModuleApp.windowInstances[windowName][uniqueID]

          // add to instances list
          owdModuleAppWindowInstances[windowName].list.push(windowInstance)

        }
      }

    }

    return owdModuleAppWindowInstances
  }

  @Mutation
  REGISTER_WINDOW_NAMESPACE({ moduleName, windowName }: { moduleName: string, windowName: string }) {
    const owdModuleAppWindowInstances = this.modulesModule.modulesAppKeyMap[moduleName].windowInstances

    // add windowName (WindowSample) to module window instances
    if (typeof owdModuleAppWindowInstances[windowName] === 'undefined') {
      owdModuleAppWindowInstances[windowName] = {}
    }
  }

  @Mutation
  REGISTER_WINDOW_INSTANCE(windowInstance: OwdModuleAppWindowInstance) {
    const moduleName = windowInstance.module.moduleInfo.name
    const windowName = windowInstance.config.name
    const uniqueID = windowInstance.uniqueID

    const owdModuleAppWindowInstances = this.modulesModule.modulesAppKeyMap[moduleName].windowInstances

    // register window instance
    owdModuleAppWindowInstances[windowName][uniqueID] = windowInstance
  }

  @Mutation
  UNREGISTER_WINDOW_INSTANCE(windowInstance: OwdModuleAppWindowInstance) {
    const moduleName = windowInstance.module.moduleInfo.name
    const windowName = windowInstance.config.name
    const uniqueID = windowInstance.uniqueID

    const owdModuleAppWindowInstances = this.modulesModule.modulesAppKeyMap[moduleName].windowInstances

    // unregister window instance
    if (typeof owdModuleAppWindowInstances[windowName] !== 'undefined') {
      delete owdModuleAppWindowInstances[windowName][uniqueID]
    }
  }

  /**
   * Initialize all windows instances and load positions from local storage
   */
  @Action
  async initialize() {
    for (const owdModuleApp of this.modulesModule.modulesAppInstalled) {

      // does module contain any windows?
      if (owdModuleApp.moduleInfo.windows && owdModuleApp.moduleInfo.windows.length > 0) {

        // skip if module doesn't have any window
        if (!owdModuleApp.moduleInfo.windows) continue

        // for each window config in moduleInfo.windows (for example WindowSample)
        for (const owdModuleAppWindowConfig of owdModuleApp.moduleInfo.windows) {

          console.log('[OWD] Window initialized: ' + owdModuleAppWindowConfig.name)

          this.REGISTER_WINDOW_NAMESPACE({
            moduleName: owdModuleApp.moduleInfo.name,
            windowName: owdModuleAppWindowConfig.name
          })

          const owdModuleAppWindowInstanceData: OwdModuleAppWindowCreateInstanceData = {
            module: owdModuleApp,
            config: owdModuleAppWindowConfig,
            storage: undefined
          }

          // create owdModuleApp window instances restoring previous local storage

          if (
            this.storage &&
            Object.prototype.hasOwnProperty.call(this.storage, owdModuleAppWindowConfig.name)
          ) {

            const owdModuleAppWindowInstancesLocalStorage = this.storage[owdModuleAppWindowConfig.name]

            for (const uniqueID in owdModuleAppWindowInstancesLocalStorage) {
              if (Object.prototype.hasOwnProperty.call(owdModuleAppWindowInstancesLocalStorage, uniqueID)) {
                const owdModuleAppWindowInstanceLocalStorage = owdModuleAppWindowInstancesLocalStorage[uniqueID]

                // restore window unique id from storage
                owdModuleAppWindowInstanceData.uniqueID = uniqueID

                // restore storage
                owdModuleAppWindowInstanceData.storage = owdModuleAppWindowInstanceLocalStorage

                // trigger window opening event
                // check if window was open
                const toOpen = owdModuleAppWindowInstanceData.storage && (owdModuleAppWindowInstanceData.storage.opened && !owdModuleAppWindowInstanceData.storage.minimized)

                // set it closed, open it later
                if (owdModuleAppWindowInstanceData.storage && owdModuleAppWindowInstanceData.storage.opened) {
                  owdModuleAppWindowInstanceData.storage.opened = false
                }

                const windowInstance = await this.windowCreateInstance(owdModuleAppWindowInstanceData)

                // run windowOpen method just for "opened" event triggering
                if (windowInstance && toOpen) {

                  // open window
                  windowInstance.open()

                  // recalculate window position
                  windowInstance.adjustPosition()

                }
              }
            }

          } else {

            // generate at least one window instance if .autoOpen is set to true

            if (owdModuleAppWindowConfig.autoOpen) {
              const windowInstance = await this.windowCreateInstance(owdModuleAppWindowInstanceData)

              if (windowInstance) {
                await this.windowOpen(windowInstance)
              }
            }
          }

        }

      }
    }

    // restore previous window focus
    const focusedWindowUniqueID = this.windowFocusModule.windowFocusActiveUniqueID

    if (focusedWindowUniqueID) {
      const windowInstance = helperWindow.findWindowInstanceByAttr('uniqueID', focusedWindowUniqueID)

      if (windowInstance) {
        windowInstance.storage.focused = true
      }
    }

    // check windows position on load
    await this.windowsHandlePageResize()
    await this.saveWindowsStorage()
  }

  /**
   * Save windows storage (position, size and more)
   */
  @Action
  async saveWindowsStorage() {
    const data: OwdModuleAppWindowsStorage = {}

    await helperWindow.forEachWindowInstance(windowInstance => {
      if (typeof data[windowInstance.config.name] === 'undefined') {
        data[windowInstance.config.name] = {}
      }

      if (windowInstance.uniqueID) {
        data[windowInstance.config.name][windowInstance.uniqueID] = {
          position: windowInstance.storage.position,
          size: windowInstance.storage.size,
          opened: !!windowInstance.storage.opened,
          minimized: !!windowInstance.storage.minimized,
          maximized: !!windowInstance.storage.maximized,
          focused: !!windowInstance.storage.focused
        }
      }
    })

    // update local storage
    helperStorage.saveStorage('window', data)
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
   * Get window by name or by name + id
   *
   * @param data
   * @returns {null|*}
   */
  @Action
  getWindow(
    data: string | OwdModuleAppWindowInstance | {
      name?: string,
      uniqueID?: string,
      uniqueName?: string
    }
  ): OwdModuleAppWindowInstance|any|null {
    return new Promise((resolve, reject) => {
      if (data instanceof ModuleAppWindow) {
        return resolve(data)
      }

      let windowName
      let uniqueID
      let uniqueName

      switch (typeof data) {
        case 'string':
          windowName = data
          break
        case 'object':
          if (data.uniqueID) {
            uniqueID = data.uniqueID
          }

          if (data.uniqueName) {
            uniqueName = data.uniqueName
          }
          break
      }

      let windowInstance

      if (windowName) {
        windowInstance = helperWindow.findWindowInstanceByAttr('name', windowName)
      }

      if (uniqueID) {
        windowInstance = helperWindow.findWindowInstanceByAttr('uniqueID', uniqueID)
      }

      if (uniqueName) {
        windowInstance = helperWindow.findWindowInstanceByAttr('uniqueName', uniqueName)
      }

      if (windowInstance) {
        return resolve(windowInstance)
      }

      return reject(`[OWD] Window "${windowName}" not found`)
    })
  }

  /**
   * Create new window
   *
   * @param data
   */
  @Action
  windowCreate(data: string | OwdModuleAppWindowInstance): OwdModuleAppWindowInstance | void {
    if (typeof data === 'string') {
      const windowName = data

      if (!helperWindow.isWindowNameExisting(windowName)) {
        return console.error(`[OWD] Unable to create new window because "${windowName}" window doesn\'t exist`)
      }

      const owdModuleAppWindow = helperWindow.getWindowDetailsFromWindowName(windowName)

      // check if module is a singleton so it doesn't have to create a new window
      if (owdModuleAppWindow && owdModuleAppWindow.module.moduleInfo.singleton) {
        const countInstances = helperWindow.getWindowGroupInstancesCount(windowName)

        if (countInstances > 0) {
          const windowInstance = helperWindow.getWindowGroupFirstInstance(windowName)

          if (windowInstance) {
            // open window
            this.windowOpen(windowInstance)

            // focus on window
            this.windowFocus(windowInstance)

            return windowInstance
          }
        }
      }

      // data was a string, create a new window instance
      this.windowCreateInstance(owdModuleAppWindow).then(windowInstance => {
        // open window
        this.windowOpen(windowInstance)

        return windowInstance
      })

    } else {
      this.windowOpen(data)
    }
  }

  /**
   * Initialize window
   *
   * @param data
   */
  @Action
  async windowCreateInstance(data: OwdModuleAppWindowCreateInstanceData): Promise<OwdModuleAppWindowInstance> {
    // initialize window using ModuleAppWindow
    let windowInstance: OwdModuleAppWindowInstance = new ModuleAppWindow(data)

    // register window instance
    this.REGISTER_WINDOW_INSTANCE(windowInstance)

    // get window instance once set
    // todo improve, dunno why have to do this
    windowInstance = helperWindow.getWindowInstance(
      windowInstance.moduleName,
      windowInstance.config.name,
      windowInstance.uniqueID
    )

    // validate window position and reset it if needed
    // windowInstance.adjustPosition()

    return windowInstance
  }

  /**
   * Open window
   *
   * @param data
   */
  @Action
  windowOpen(data: any): OwdModuleAppWindowInstance {
    return this
      .getWindow(data)
      .then(async (windowInstance: OwdModuleAppWindowInstance) => {
        // open window
        windowInstance.open()

        // recalculate window position
        windowInstance.adjustPosition()

        // focus window
        this.windowFocus(windowInstance)

        return windowInstance
      })
      .catch(() => {
        // window instance doesnt exist, create a new one
        return this.windowCreate(data)
      })
  }

  /**
   * Minimize window
   *
   * @param data
   */
  @Action
  windowMinimize(data: any): boolean {
    return this
      .getWindow(data)
      .then((windowInstance: OwdModuleAppWindowInstance) => windowInstance.minimize())
      .catch(() => false)
  }

  /**
   * Maximize window
   *
   * @param data
   */
  @Action
  windowMaximize(data: any): boolean {
    return this
      .getWindow(data)
      .then((windowInstance: OwdModuleAppWindowInstance) => {
        // maximize window
        windowInstance.maximize()

        this.fullscreenModule.SET_FULLSCREEN_MODE(true)

        return true
      })
      .catch(() => false)
  }

  /**
   * Unmaximize window
   *
   * @param data
   */
  @Action
  windowUnmaximize(data: any): boolean {
    return this
      .getWindow(data)
      .then((windowInstance: OwdModuleAppWindowInstance) => {
        if (windowInstance.config.maximizable) {
          // unmaximize window
          windowInstance.unmaximize()

          this.fullscreenModule.SET_FULLSCREEN_MODE(false)

          return true
        }
      })
      .catch(() => false)
  }

  /**
   * Get window position
   *
   * @param data
   */
  @Action
  getWindowPosition(data: any): OwdModuleAppWindowConfigPosition | null {
    return this
      .getWindow(data)
      .then((windowInstance: OwdModuleAppWindowInstance) => windowInstance.getSize())
      .catch(() => null)
  }

  /**
   * Set window position
   *
   * @param data
   */
  @Action
  windowSetPosition(data: { window: OwdModuleAppWindowInstance, position: OwdModuleAppWindowConfigPosition}): boolean {
    return this
      .getWindow(data.window)
      .then(async (windowInstance: OwdModuleAppWindowInstance) => {
        // set window position
        windowInstance.setPosition(data.position)

        // recalculate pos x and y
        windowInstance.adjustPosition()

        await this.saveWindowsStorage()

        return true
      })
      .catch(() => false)
  }

  /**
   * Reset window position
   *
   * @param data
   */
  @Action
  windowResetPosition(data: any): boolean {
    return this
      .getWindow(data)
      .then((windowInstance: OwdModuleAppWindowInstance) => windowInstance.resetPosition())
      .catch(() => false)
  }

  /**
   * Update window size
   *
   * @param data
   */
  @Action
  windowUpdateSize(data: {window: any, size: OwdModuleAppWindowConfigSize }): boolean {
    return this
      .getWindow(data.window)
      .then((windowInstance: OwdModuleAppWindowInstance) => windowInstance.setSize(data.size))
      .catch(() => false)
  }

  /**
   * Reset window size
   *
   * @param data
   */
  @Action
  windowResetSize(data: any): boolean {
    return this
      .getWindow(data)
      .then((windowInstance: OwdModuleAppWindowInstance) => windowInstance.resetSize())
      .catch(() => false)
  }

  /**
   * Set all windows hidden
   */
  @Action
  async windowMinimizeAll(): Promise<void> {
    await helperWindow.forEachWindowInstance(windowInstance => windowInstance.minimize())
  }

  /**
   * Set all windows not maximized
   */
  @Action
  async windowUnmaximizeAll(): Promise<void> {
    await helperWindow.forEachWindowInstance(async windowInstance => windowInstance.unmaximize())

    this.fullscreenModule.SET_FULLSCREEN_MODE(false)
  }

  /**
   * Increment window focus
   *
   * @param data
   */
  @Action
  windowFocus(data: any): boolean {
    return this
      .getWindow(data)
      .then(async (focusedWindowInstance: OwdModuleAppWindowInstance) => {
        // focus window
        this.windowFocusModule.SET_WINDOW_FOCUS(focusedWindowInstance.uniqueID)

        // handle windowFocuses positions
        const owdWindowFocuses = this.windowFocusModule.windowFocusList

        await helperWindow.forEachWindowInstance(windowInstance => {
          // set window z-index
          windowInstance.setFocusIndex(owdWindowFocuses.indexOf(windowInstance.uniqueID))

          // set focused if window has just been focused
          windowInstance.setFocusActive(focusedWindowInstance.uniqueID === windowInstance.uniqueID)
        })

        return true
      })
      .catch(() => false)
  }

  /**
   * Get window focus
   *
   * @param data
   */
  @Action
  getWindowFocus(data: any): number | boolean {
    return this
      .getWindow(data)
      .then((windowInstance: OwdModuleAppWindowInstance) => windowInstance.getFocusIndex())
      .catch(() => false)
  }

  /**
   * Destroy window
   *
   * @param data
   */
  @Action
  windowDestroy(data: any): boolean {
    return this
      .getWindow(data)
      .then(async (windowInstance: OwdModuleAppWindowInstance) => {
        windowInstance.setFocusActive(false)
        windowInstance.close()

        // destroy module window instance
        this.UNREGISTER_WINDOW_INSTANCE(windowInstance);
        this.windowFocusModule.UNSET_WINDOW_FOCUS(windowInstance.uniqueID);

        // unregister owdModuleApp window vuex store instance
        windowInstance.destroy()

        // force window save because watch event isn't triggered on component destroy
        await this.saveWindowsStorage()

        return true
      })
      .catch(() => false)
  }

  /**
   * Destroy all windows in this group
   *
   * @param windowGroup
   */
  @Action
  async windowDestroyGroup(windowGroup: any): Promise<boolean> {
    if (helperWindow.isWindowNameExisting(windowGroup)) {
      await helperWindow.forEachWindowGroupInstance(windowGroup, async windowInstance => {
        this.windowDestroy(windowInstance)
      })

      return true
    }

    return false
  }

  /**
   * Close window
   *
   * @param data
   */
  @Action
  windowClose(data: any): boolean {
    return this.windowDestroy(data)
  }

  /**
   * Close all windows
   */
  @Action
  async windowCloseAll(): Promise<void> {
    await helperWindow.forEachWindowInstance(windowInstance => this.windowClose(windowInstance))
  }

  /**
   * Close all windows of this group
   *
   * @param windowGroup
   */
  @Action
  async windowCloseGroup(windowGroup: string): Promise<void> {
    if (helperWindow.isWindowNameExisting(windowGroup)) {
      await helperWindow.forEachWindowGroupInstance(windowGroup, async windowInstance => {
        await this.windowClose(windowInstance)
      })
    }
  }

  /**
   * Set custom nav title
   * @param data
   */
  @Action
  windowSetNavTitle(data: {window: any, title: string, exclusive: boolean}): boolean {
    return this
      .getWindow(data.window)
      .then((windowInstance: OwdModuleAppWindowInstance) => windowInstance.setNavTitle(data.title, data.exclusive))
      .catch(() => false)
  }

  @Action
  windowCalcPosition(data: any): OwdModuleAppWindowConfigPosition {
    return this
      .getWindow(data)
      .then(async (windowInstance: OwdModuleAppWindowInstance) => windowInstance.adjustPosition())
      .catch(() => false)
  }

  /**
   * Reset windows position on page resize
   */
  @Action
  async windowsHandlePageResize(): Promise<void> {
    await helperWindow.forEachWindowInstance((windowInstance: any) => {
      if (windowInstance.storage && windowInstance.storage.opened) {
        windowInstance.adjustPosition()
      }
    })
  }
}
