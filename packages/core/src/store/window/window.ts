import {VuexModule, Module, Mutation, Action, RegisterOptions} from "vuex-class-modules";

import * as WindowUtils from '../../utils/windows/windows.utils'

import DebugModule from "../debug";
import ModulesModule from "../modules";
import FullScreenModule from "../fullscreen";
import {
  OwdModuleAppWindowConfig,
  OwdModuleAppWindowConfigPosition, OwdModuleAppWindowConfigSize,
  OwdModuleAppWindowCreateInstanceData, OwdModuleAppWindowDetail,
  OwdModuleAppWindowInstance, OwdModuleAppWindowsStorage
} from "../../../../types";
import * as owdModuleAppWindowsStorageUtils from "../../utils/windows/windowsLocalStorage.utils";
import WindowFocusModule from "./windowFocus";

const owdModuleAppWindowsLocalStorage = owdModuleAppWindowsStorageUtils.loadWindowsStorage()

@Module
export default class WindowModule extends VuexModule {
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
  }

  /**
   * App window categories (window categories of each installed module)
   * keymap by window category
   */
  get modulesAppWindowCategories() {
    const windowCategories: { [key: string]: OwdModuleAppWindowConfig[] } = {}

    // for each loaded module
    for (const owdModuleApp of this.modulesModule.modulesAppInstalled) {

      // for each window config
      for (const owdModuleAppWindowConfig of owdModuleApp.moduleInfo.windows) {

        // map window categories
        if (!Object.prototype.hasOwnProperty.call(windowCategories, owdModuleAppWindowConfig.category)) {
          windowCategories[owdModuleAppWindowConfig.category] = []
        }

        windowCategories[owdModuleAppWindowConfig.category].push(owdModuleAppWindowConfig)
      }

    }

    return windowCategories
  }

  /**
   * App window details keymap by window name (module config + window config)
   */
  get modulesAppWindowDetails() {
    const windowDetailsKeyMap: { [key: string]: OwdModuleAppWindowDetail } = {};

    // for each loaded module
    for (const owdModuleApp of this.modulesModule.modulesAppInstalled) {

      // for each window config
      for (const owdModuleAppWindowConfig of owdModuleApp.moduleInfo.windows) {

        // map window details
        windowDetailsKeyMap[owdModuleAppWindowConfig.name] = {
          module: owdModuleApp,
          window: owdModuleAppWindowConfig
        }
      }

    }

    return windowDetailsKeyMap
  }

  /**
   * App window instances (array of window instances)
   */
  get modulesAppWindowInstancesList() {
    const owdModuleAppWindowInstances: OwdModuleAppWindowInstance[] = []

    // for each loaded module
    for (const owdModuleApp of this.modulesModule.modulesAppInstalled) {

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
   * App window instances (array of window instances)
   */
  get modulesAppWindowGroupInstances() {
    const owdModuleAppWindowInstances: {
      [key: string]: {
        config: OwdModuleAppWindowConfig | undefined,
        list: OwdModuleAppWindowInstance[]
      }
    } = {}

    // for each loaded module
    for (const owdModuleApp of this.modulesModule.modulesAppInstalled) {

      // for each window config
      for (const owdModuleAppWindowConfig of owdModuleApp.moduleInfo.windows) {
        const windowName: string = owdModuleAppWindowConfig.name

        // add to instances groups
        owdModuleAppWindowInstances[windowName] = {
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

  /**
   * Items for the docks
   */
  get modulesAppWindowDocks() {
    let items: any[] = []

    for (const owdModuleApp of this.modulesModule.modulesAppInstalled) {

      // does module contain any windows?
      if (owdModuleApp.moduleInfo.windows && owdModuleApp.moduleInfo.windows.length > 0) {

        for (const owdModuleAppWindowConfig of owdModuleApp.moduleInfo.windows) {

          let windowInstances: any[] = []

          if (owdModuleApp.windowInstances[owdModuleAppWindowConfig.name]) {
            windowInstances = Object.values(owdModuleApp.windowInstances[owdModuleAppWindowConfig.name])
          }

          if (windowInstances.length === 0) {

            // add dummy item to dock
            items.push({
              config: owdModuleAppWindowConfig,
              storage: {
                opened: false,
                minimized: false
              },
              dummy: true
            })

          } else {
            if (windowInstances.length > 0) {
              items = items.concat(windowInstances)
            }
          }

        }

      }

    }

    return items
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
  REGISTER_WINDOW(windowInstance: OwdModuleAppWindowInstance) {
    const moduleName = windowInstance.module.moduleInfo.name
    const windowName = windowInstance.config.name
    const uniqueID = windowInstance.uniqueID

    const owdModuleAppWindowInstances = this.modulesModule.modulesAppKeyMap[moduleName].windowInstances

    // register window instance
    owdModuleAppWindowInstances[windowName][uniqueID] = windowInstance
  }

  @Mutation
  UNREGISTER_WINDOW(windowInstance: OwdModuleAppWindowInstance) {
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

        // for each window config in moduleInfo.windows (for example WindowSample)
        for (const owdModuleAppWindowConfig of owdModuleApp.moduleInfo.windows) {

          console.log('[OWD] Initialize module window: ' + owdModuleAppWindowConfig.name)

          this.REGISTER_WINDOW_NAMESPACE({
            moduleName: owdModuleApp.moduleInfo.name,
            windowName: owdModuleAppWindowConfig.name
          })

          const owdModuleAppWindowInstanceData: OwdModuleAppWindowCreateInstanceData = {
            module: owdModuleApp,
            config: owdModuleAppWindowConfig,
            storage: null
          }

          // create owdModuleApp window instances restoring previous local storage

          if (
            owdModuleAppWindowsLocalStorage &&
            Object.prototype.hasOwnProperty.call(owdModuleAppWindowsLocalStorage, owdModuleAppWindowConfig.name)
          ) {

            const owdModuleAppWindowInstancesLocalStorage = owdModuleAppWindowsLocalStorage[owdModuleAppWindowConfig.name]

            for (const uniqueID in owdModuleAppWindowInstancesLocalStorage) {
              if (Object.prototype.hasOwnProperty.call(owdModuleAppWindowInstancesLocalStorage, uniqueID)) {
                const owdModuleAppWindowInstanceLocalStorage = owdModuleAppWindowInstancesLocalStorage[uniqueID]

                owdModuleAppWindowInstanceData.uniqueID = uniqueID
                owdModuleAppWindowInstanceData.storage = owdModuleAppWindowInstanceLocalStorage

                await this.windowCreateInstance(owdModuleAppWindowInstanceData)
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

    await WindowUtils.forEachWindowInstance(windowInstance => {
      if (typeof data[windowInstance.config.name] === 'undefined') {
        data[windowInstance.config.name] = {}
      }

      if (windowInstance.uniqueID) {
        data[windowInstance.config.name][windowInstance.uniqueID] = {
          position: windowInstance.storage.position,
          size: windowInstance.storage.size,
          opened: !!windowInstance.storage.opened,
          minimized: !!windowInstance.storage.minimized,
          maximized: !!windowInstance.storage.maximized
        }
      }
    })

    // update local storage
    owdModuleAppWindowsStorageUtils.saveWindowsStorage(JSON.stringify(data))
  }

  /**
   * Reset entire windows storage
   */
  @Action
  resetWindowsStorage() {
    owdModuleAppWindowsStorageUtils.resetWindowsStorage()
    owdModuleAppWindowsStorageUtils.resetWindowsStorageFocuses()
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
      if ((<OwdModuleAppWindowInstance>data) !== undefined) {
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
          if (data.name) {
            windowName = data.name
          }

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
        windowInstance = WindowUtils.findWindowInstanceByAttr('name', windowName)
      }

      if (uniqueID) {
        windowInstance = WindowUtils.findWindowInstanceByAttr('uniqueID', uniqueID)
      }

      if (uniqueName) {
        windowInstance = WindowUtils.findWindowInstanceByAttr('uniqueName', uniqueName)
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
      const owdModuleAppWindowDetail = WindowUtils.getWindowDetailsFromWindowName(windowName)

      if (!owdModuleAppWindowDetail) {
        return console.error(`[OWD] Unable to create new window because "${windowName}" window doesn\'t exist`)
      }

      // check if module is a singleton so it doesn't have to create a new window
      if (owdModuleAppWindowDetail && owdModuleAppWindowDetail.module.moduleInfo.singleton) {
        const countInstances = WindowUtils.getWindowGroupInstancesCount(windowName)

        if (countInstances > 0) {
          const windowInstance = WindowUtils.getWindowGroupFirstInstance(windowName)

          if (windowInstance) {
            console.log('CREATE OPEN MA QUI 1')
            return this.windowOpen(windowInstance)
          }
        }
      }

      // data was a string, create a new window instance
      this.windowCreateInstance({
        config: owdModuleAppWindowDetail.window,
        module: owdModuleAppWindowDetail.module
      }).then(windowInstance => {
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
    // check if window is given or...
    // get a copy of the module window configuration
    const windowInstance: any = {...data}

    const moduleName = windowInstance.module.moduleInfo.name

    // assign unique instance id
    if (!windowInstance.uniqueID) {
      windowInstance.uniqueID = WindowUtils.generateWindowInstanceUniqueId()
    }

    // assign unique instance name
    windowInstance.uniqueName = `${moduleName}-${windowInstance.uniqueID}`

    // add storage (clone from owdModuleAppWindow.config)
    windowInstance.storage = {
      position: data.config.position,
      size: data.config.size,
      minimized: !!data.config.minimized,
      maximized: !!data.config.maximized,
      opened: false,
      focused: false
    }

    // overwrite .storage with history (local storage)
    if (data.storage) {

      if (typeof data.storage.position !== 'undefined') {
        windowInstance.storage.position = data.storage.position
      }

      if (typeof data.storage.size !== 'undefined') {
        windowInstance.storage.size = data.storage.size
      }

      if (typeof data.storage.opened !== 'undefined') {
        windowInstance.storage.opened = !!data.storage.opened
      }

      if (typeof data.storage.minimized !== 'undefined') {
        windowInstance.storage.minimized = !!data.storage.minimized
      }

      if (typeof data.storage.maximized !== 'undefined') {
        windowInstance.storage.maximized = !!data.storage.maximized
      }

      windowInstance.storage.focused = (windowInstance.uniqueID === this.windowFocusModule.windowFocusActiveUniqueID)
    }

    // initialize storeInstance if module isn't a singleton
    if (windowInstance.module.isSingleton === false) {
      windowInstance.module.registerModuleStoreInstance(windowInstance.uniqueName)
    }

    // calculate pos x and y
    /*
    const newPositionX = WindowUtils.calcPositionX({window: owdModuleAppWindow})
    if (typeof newPositionX === 'number') owdModuleAppWindow.storage.position.x = newPositionX

    const newPositionY = WindowUtils.calcPositionY({window: owdModuleAppWindow})
    if (typeof newPositionY === 'number') owdModuleAppWindow.storage.position.y = newPositionY
    */

    this.REGISTER_WINDOW(windowInstance)

    return WindowUtils.getWindowInstance(moduleName, windowInstance.config.name, windowInstance.uniqueID)
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
        windowInstance.storage.opened = true
        windowInstance.storage.minimized = false

        // recalculate pos x and y
        /*
        const newPositionX = WindowUtils.calcPositionX({window: owdModuleAppWindow})
        if (typeof newPositionX === 'number') owdModuleAppWindow.storage.position.x = newPositionX

        const newPositionY = WindowUtils.calcPositionY({window: owdModuleAppWindow})
        if (typeof newPositionY === 'number') owdModuleAppWindow.storage.position.y = newPositionY
        */

        // check windows position on load
        await this.windowsHandlePageResize()

        // focus on window
        await this.windowFocus(windowInstance)

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
      .then((windowInstance: OwdModuleAppWindowInstance) => {
        windowInstance.storage.minimized = true

        return true
      })
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
        windowInstance.storage.minimized = true

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
          windowInstance.storage.maximized = false
          this.fullscreenModule.SET_FULLSCREEN_MODE(false)

          return true
        }
      })
      .catch(() => false)
  }

  /**
   * Invert maximize window status
   *
   * @param data
   */
  @Action
  windowToggleMaximize(data: any): boolean {
    return this
      .getWindow(data)
      .then((windowInstance: OwdModuleAppWindowInstance) => {
        if (windowInstance.config.maximizable) {
          windowInstance.storage.maximized = !windowInstance.storage.maximized
          this.fullscreenModule.SET_FULLSCREEN_MODE(windowInstance.storage.maximized)

          return true
        }
      })
      .catch(() => false)
  }

  /**
   * Set window position
   *
   * @param data
   */
  @Action
  windowSetPosition(data: any): boolean {
    return this
      .getWindow(data)
      .then((windowInstance: OwdModuleAppWindowInstance) => {
        windowInstance.storage.position.x = data.position.x
        windowInstance.storage.position.y = data.position.y

        /*
        const newPositionX = WindowUtils.calcPositionX({window: owdModuleAppWindow})
        if (typeof newPositionX === 'number') owdModuleAppWindow.storage.position.x = newPositionX

        const newPositionY = WindowUtils.calcPositionY({window: owdModuleAppWindow})
        if (typeof newPositionY === 'number') owdModuleAppWindow.storage.position.y = newPositionY
        */

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
      .then((windowInstance: OwdModuleAppWindowInstance) => {
        windowInstance.storage.position = windowInstance.config.position

        return true
      })
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
      .then((windowInstance: OwdModuleAppWindowInstance) => {
        windowInstance.storage.size = windowInstance.config.size

        return true
      })
      .catch(() => false)
  }

  /**
   * Set all windows hidden
   */
  @Action
  async windowMinimizeAll(): Promise<void> {
    await WindowUtils.forEachWindowInstance(windowInstance => {
      if (windowInstance.storage.maximized) {
        windowInstance.storage.opened = false
      }
    })
  }

  /**
   * Set all windows not maximized
   */
  @Action
  async windowUnmaximizeAll(): Promise<void> {
    await WindowUtils.forEachWindowInstance(async windowInstance => {
      if (windowInstance.storage.maximized) {
        await this.windowUnmaximize(windowInstance)
      }
    })

    this.fullscreenModule.SET_FULLSCREEN_MODE(false)
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
      .then((windowInstance: OwdModuleAppWindowInstance) => {
        return {
          x: windowInstance.storage.x,
          y: windowInstance.storage.y
        }
      })
      .catch(() => null)
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

        await WindowUtils.forEachWindowInstance(windowInstance => {
          windowInstance.storage.position.z = owdWindowFocuses.indexOf(windowInstance.uniqueID)

          // set focused if window has just been focused
          windowInstance.storage.focused = (focusedWindowInstance.uniqueID === windowInstance.uniqueID)
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
      .then((windowInstance: OwdModuleAppWindowInstance) => {
        return windowInstance.storage.position.z
      })
      .catch(() => false)
  }

  /**
   * Update window position
   *
   * @param data
   */
  @Action
  windowUpdatePosition(data: {window: any, position: OwdModuleAppWindowConfigPosition }): boolean {
    return this
      .getWindow(data.window)
      .then((windowInstance: OwdModuleAppWindowInstance) => {
        windowInstance.storage.position = data.position

        return true
      })
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
      .then((windowInstance: OwdModuleAppWindowInstance) => {
        windowInstance.storage.size = data.size

        return true
      })
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
        // destroy module window instance
        this.UNREGISTER_WINDOW(windowInstance);
        this.windowFocusModule.UNSET_WINDOW_FOCUS(windowInstance.uniqueID);

        // unregister owdModuleApp window vuex store
        if (!windowInstance.module.moduleInfo.singleton) {
          if (windowInstance.module.hasModuleStoreInstance()) {
            windowInstance.module.unregisterModuleStoreInstance(windowInstance.uniqueName)
          }
        }

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
    if (WindowUtils.isWindowNameExisting(windowGroup)) {
      await WindowUtils.forEachWindowGroupInstance(windowGroup, (windowInstance: OwdModuleAppWindowInstance) => {
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
    await WindowUtils.forEachWindowInstance(async windowInstance => {
      await this.windowClose(windowInstance)
    })
  }

  /**
   * Close all windows in this group
   *
   * @param windowGroup
   */
  @Action
  async windowCloseGroup(windowGroup: string): Promise<void> {
    if (WindowUtils.isWindowNameExisting(windowGroup)) {
      await WindowUtils.forEachWindowGroupInstance(windowGroup, async owdModuleAppWindow => {
        await this.windowClose(owdModuleAppWindow)
      })
    }
  }

  /**
   * todo
   * @param data
   */
  @Action
  windowSetNavTitle(data: {window: any, title: string}): boolean {
    return this
      .getWindow(data.window)
      .then((windowInstance: OwdModuleAppWindowInstance) => {
        // window.title = data.title

        return true
      })
      .catch(() => false)
  }

  /**
   * Reset windows position on page resize
   */
  @Action
  async windowsHandlePageResize(): Promise<void> {
    const pageWindow = window

    await WindowUtils.forEachWindowInstance(async (windowInstance: any) => {
      if (windowInstance.storage && windowInstance.storage.opened) {
        const maxLeft = windowInstance.storage.position.x + windowInstance.storage.size.width
        const maxTop = windowInstance.storage.position.y + windowInstance.storage.size.height

        // calculate max top/left position allowed
        if (maxLeft < windowInstance.storage.size.width || maxLeft > pageWindow.innerWidth) {
          const newPositionX = WindowUtils.calcPositionX({
            window: windowInstance,
            forceRight: true
          })

          if (typeof newPositionX === 'number') windowInstance.storage.position.x = newPositionX
        }
        if (maxTop < windowInstance.storage.size.height || maxTop > pageWindow.innerHeight) {
          const newPositionY = WindowUtils.calcPositionY({
            window: windowInstance,
            forceRight: true
          })
          if (typeof newPositionY === 'number') windowInstance.storage.position.y = newPositionY
        }
      }
    })
  }
}
