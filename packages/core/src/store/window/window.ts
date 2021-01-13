import {VuexModule, Module, Mutation, Action, RegisterOptions} from "vuex-class-modules";

import {
  generateWindowUniqueId,
  findWindowInstanceByAttr,
  forEachWindowInstanceInWindowGroup,
  getWindowGroupWindowIndex,
  isWindowGroupExisting,
  isWindowGroupWindowIndexExisting, forEachWindowInstance
} from '../../utils/windows/windows.utils'

import DebugModule from "../debug";
import ModulesModule from "../modules";
import FullScreenModule from "../fullscreen";
import {
  OwdModuleAppWindowConfigPosition, OwdModuleAppWindowConfigSize,
  OwdModuleAppWindowCreateInstanceData,
  OwdModuleAppWindowInstance, OwdModuleAppWindowsStorage, OwdWindowFocuses
} from "../../../../types";
import * as owdModuleAppWindowsStorageUtils from "../../utils/windows/windowsLocalStorage.utils";

const owdModuleAppWindowsLocalStorage = owdModuleAppWindowsStorageUtils.loadWindowsStorage()

@Module
export default class WindowModule extends VuexModule {
  private readonly debugModule: DebugModule
  private readonly modulesModule: ModulesModule
  private readonly fullscreenModule: FullScreenModule

  private windowFocuses: OwdWindowFocuses = owdModuleAppWindowsStorageUtils.loadWindowStorageFocuses()

  constructor(
    debugModule: DebugModule,
    modulesModule: ModulesModule,
    fullscreenModule: FullScreenModule,
    options: RegisterOptions
  ) {
    super(options);
    this.debugModule = debugModule
    this.modulesModule = modulesModule
    this.fullscreenModule = fullscreenModule
  }

  /**
   * Getter array of windows instances
   */
  get windowInstances(): OwdModuleAppWindowInstance[] {
    let owdModuleAppWindowInstances: OwdModuleAppWindowInstance[] = []

    // for each loaded module
    for (const owdModuleApp of Object.values(this.modulesModule.modulesLoaded)) {

      // cycle windowName in each module window instances (WindowSample)
      for (const windowName in owdModuleApp.windowInstances) {
        if (Object.prototype.hasOwnProperty.call(owdModuleApp.windowInstances, windowName)) {

          // cycle uniqueID in each module window instances name
          for (const uniqueID in owdModuleApp.windowInstances[windowName]) {
            if (Object.prototype.hasOwnProperty.call(owdModuleApp.windowInstances[windowName], uniqueID)) {

              owdModuleAppWindowInstances.push(owdModuleApp.windowInstances[windowName][uniqueID])

            }
          }

        }
      }

    }

    return owdModuleAppWindowInstances
  }

  /**
   * Getter of windows instances grouped by window name (WindowsSample)
   */
  get windowGroups(): {[key: string]: OwdModuleAppWindowInstance[]} {
    let owdModuleAppWindowGroups: {[key: string]: OwdModuleAppWindowInstance[]} = {}

    // for each loaded module
    for (const owdModuleApp of Object.values(this.modulesModule.modulesLoaded)) {

      // cycle windowName in each module window instances (WindowSample)
      for (const windowName in owdModuleApp.windowInstances) {
        if (Object.prototype.hasOwnProperty.call(owdModuleApp.windowInstances, windowName)) {

          // cycle uniqueID in each module window instances name
          for (const uniqueID in owdModuleApp.windowInstances[windowName]) {
            if (Object.prototype.hasOwnProperty.call(owdModuleApp.windowInstances[windowName], uniqueID)) {

              const owdModuleAppWindow = owdModuleApp.windowInstances[windowName][uniqueID]

              if (typeof owdModuleAppWindowGroups[owdModuleAppWindow.config.name] === 'undefined') {
                owdModuleAppWindowGroups[owdModuleAppWindow.config.name] = []
              }

              owdModuleAppWindowGroups[owdModuleAppWindow.config.name].push(owdModuleAppWindow)

            }
          }

        }
      }

    }

    return owdModuleAppWindowGroups
  }

  @Mutation
  REGISTER_MODULE_WINDOW(data: any) {
    const moduleName = data.module.moduleInfo.name
    const owdModuleAppWindowInstances = this.modulesModule.modulesLoaded[moduleName].windowInstances

    // add window.config.name (WindowSample) to module windows
    if (typeof owdModuleAppWindowInstances[data.config.name] === 'undefined') {
      owdModuleAppWindowInstances[data.config.name] = {}
    }
  }

  @Mutation
  REGISTER_WINDOW(data: any) {
    const moduleName = data.module.moduleInfo.name
    const owdModuleAppWindowInstances = this.modulesModule.modulesLoaded[moduleName].windowInstances

    // add window unique ID with its data
    owdModuleAppWindowInstances[data.config.name][data.uniqueID] = data
  }

  @Mutation
  UNREGISTER_WINDOW(data: any) {
    const moduleName = data.module.moduleInfo.name
    const owdModuleAppWindowInstances = this.modulesModule.modulesLoaded[moduleName].windowInstances

    // remove from module windows
    if (typeof owdModuleAppWindowInstances[data.config.name] !== 'undefined') {
      delete owdModuleAppWindowInstances[data.config.name][data.uniqueID]
    }
  }

  @Mutation
  SET_WINDOW(data: any) {
    // console.log('SET WINDOW', data)
    // keep this mutation just for vuex logging cuz
    // window object properties are changed directly
  }

  @Mutation
  SET_WINDOW_FOCUSES(windowFocuses: any) {
    this.windowFocuses = windowFocuses

    // save
    owdModuleAppWindowsStorageUtils.saveWindowStorageFocuses(this.windowFocuses)
  }

  /**
   * Initialize all windows instances and load positions from local storage
   */
  @Action
  async initialize() {
    const owdModuleApps = Object.values(this.modulesModule.modulesLoaded);

    for (const owdModuleApp of owdModuleApps) {

      // does module contain any windows?
      if (owdModuleApp.moduleInfo.windows && owdModuleApp.moduleInfo.windows.length > 0) {

        // for each window in moduleInfo.windows (for example WindowSample)
        for (const owdModuleAppWindowConfig of owdModuleApp.moduleInfo.windows) {

          console.log('[OWD] Load module component: ' + owdModuleAppWindowConfig.name)

          // const storageWindows = await dispatch('getInitialWindowsStorageByWindowName', windowName)

          const owdModuleAppWindowData: OwdModuleAppWindowCreateInstanceData = {
            module: owdModuleApp,
            config: owdModuleAppWindowConfig,
            storage: null
          }

          this.REGISTER_MODULE_WINDOW(owdModuleAppWindowData)

          // check windows local storage for moduleWindowConfig.name
          if (
            owdModuleAppWindowsLocalStorage &&
            Object.prototype.hasOwnProperty.call(owdModuleAppWindowsLocalStorage, owdModuleAppWindowConfig.name)
          ) {
            const owdModuleAppWindowInstancesLocalStorage = owdModuleAppWindowsLocalStorage[owdModuleAppWindowConfig.name]

            for (const uniqueID in owdModuleAppWindowInstancesLocalStorage) {
              const owdModuleAppWindowInstanceLocalStorage = owdModuleAppWindowInstancesLocalStorage[uniqueID]

              await this.windowCreateInstance({
                ...owdModuleAppWindowData,
                uniqueID: uniqueID,
                storage: owdModuleAppWindowInstanceLocalStorage,
              })
            }
          } else {

            // generate at least one window instance if .autostart is set to true
            if (owdModuleApp.moduleInfo.autostart) {
              await this.windowCreateInstance(owdModuleAppWindowData)
            }

          }

        }

      }
    }

    // check windows position on load
    await this.windowsHandlePageResize()
  }

  /**
   * Save windows storage (position, size and more)
   */
  @Action
  async saveWindowsStorage() {
    const data: OwdModuleAppWindowsStorage = {}

    await forEachWindowInstance(owdWindow => {
      if (typeof data[owdWindow.config.name] === 'undefined') {
        data[owdWindow.config.name] = {}
      }

      if (owdWindow.uniqueID) {
        data[owdWindow.config.name][owdWindow.uniqueID] = {
          position: owdWindow.storage.position,
          size: owdWindow.storage.size,
          closed: !!owdWindow.storage.closed,
          minimized: !!owdWindow.storage.minimized,
          maximized: !!owdWindow.storage.maximized
        }
      }
    })

    // update local storage
    await owdModuleAppWindowsStorageUtils.saveWindowsStorage(JSON.stringify(data))
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
  getWindow(data: string | { name?: string, uniqueID?: string }): OwdModuleAppWindowInstance|null {
    let groupName
    let uniqueID

    switch (typeof data) {
      case 'string':
        groupName = data
        break
      case 'object':
        if (data.uniqueID) {
          uniqueID = data.uniqueID
        }

        if (data.name) {
          groupName = data.name
        }
        break
    }

    let owdModuleAppWindow

    if (uniqueID) {
      owdModuleAppWindow = findWindowInstanceByAttr('uniqueID', uniqueID)
    }

    if (groupName) {
      owdModuleAppWindow = findWindowInstanceByAttr('name', groupName)
    }

    if (owdModuleAppWindow) {
      return owdModuleAppWindow
    }

    return null
  }

  /**
   * Create new window
   *
   * @param data
   */
  @Action
  async windowCreate(data: any): Promise<any> {
    let windowName = ''

    // it accepts strings and objects. when it's a string, converts to object
    if (typeof data === 'string') {
      windowName = data
      data = null
    }

    const owdModuleAppWindowNameDetail = await this.modulesModule.getDetailFromWindowName(windowName)

    if (!owdModuleAppWindowNameDetail) {
      return console.error(`[OWD] Unable to create new window because "${windowName}" module doesn\'t exists`)
    }

    // check if there is already one window created in this window group
    if (isWindowGroupExisting(windowName)) {
      if (owdModuleAppWindowNameDetail.module.moduleInfo.singleton && isWindowGroupWindowIndexExisting(windowName, 0)) {
        const owdModuleAppWindow = getWindowGroupWindowIndex(windowName, 0)

        // just open it instead of creating a new one
        if (owdModuleAppWindow.storage.closed) {
          return this.windowOpen(owdModuleAppWindow)
        }
      }
    }

    // check if window is given or...
    if (!data) {
      data = await this.windowCreateInstance({
        name: windowName,
        config: owdModuleAppWindowNameDetail.window,
        module: owdModuleAppWindowNameDetail.module
      })
    }

    if (!data) {
      return console.error(`[OWD] Unable to create "${windowName}" window`)
    }

    if (data.storage) {
      data.storage.closed = false
      data.storage.minimized = false

      if (typeof data.config.menu === 'boolean') {
        data.storage.menu = true
      }
    }

    // update
    this.SET_WINDOW(data)

    // focus on window
    await this.windowFocus(data)

    return data
  }

  /**
   * Initialize window
   *
   * @param data
   */
  @Action
  async windowCreateInstance(data: OwdModuleAppWindowCreateInstanceData) {
    // check if window is given or...
    // get a copy of the module window configuration
    const owdModuleAppWindow: any = {...data}

    // assign unique id
    if (!owdModuleAppWindow.uniqueID) {
      owdModuleAppWindow.uniqueID = generateWindowUniqueId()
    }

    // add storage (clone from windowInstance.config)
    owdModuleAppWindow.storage = {
      position: data.config.position,
      size: data.config.size,
      closed: data.config.closed,
      minimized: data.config.minimized,
      maximized: data.config.maximized
    }

    // overwrite .storage with history (local storage)
    if (data.storage) {

      // parse window positions and more
      owdModuleAppWindow.storage = {
        position: data.storage.position,
        size: data.storage.size,
        closed: !!data.storage.closed,
        minimized: data.storage.minimized,
        maximized: data.storage.maximized
      }

      // show item in menu
      if (!owdModuleAppWindow.config.menu) {
        owdModuleAppWindow.storage.menu = !!data.storage.menu
      }

      // window is already opened, show item in menu
      if (!data.storage.closed) {
        owdModuleAppWindow.storage.menu = true
      }
    }

    // initialize storeInstance if module isn't a singleton
    if (!owdModuleAppWindow.module.moduleInfo.singleton) {
      owdModuleAppWindow.module.registerModuleStoreInstance(
        `${owdModuleAppWindow.module.moduleInfo.name}-${owdModuleAppWindow.uniqueID}`
      )
    }

    // calculate pos x and y
    if (owdModuleAppWindow.storage) {
      const newPositionX = await this.calcPositionX({window: owdModuleAppWindow})
      if (typeof newPositionX === 'number') owdModuleAppWindow.storage.position.x = newPositionX

      const newPositionY = await this.calcPositionY({window: owdModuleAppWindow})
      if (typeof newPositionY === 'number') owdModuleAppWindow.storage.position.y = newPositionY
    }

    if (!owdModuleAppWindow) {
      return console.log('[OWD] Unable to create new window')
    }

    await this.REGISTER_WINDOW(owdModuleAppWindow)

    return owdModuleAppWindow
  }

  /**
   * Open window
   *
   * @param data
   */
  @Action
  async windowOpen(data: any) {
    const owdModuleAppWindow = await this.getWindow(data)

    if (!owdModuleAppWindow || !owdModuleAppWindow.storage) {
      // window instance doesnt exist, create a new one
      return this.windowCreate(data)
    }

    owdModuleAppWindow.storage.closed = false
    owdModuleAppWindow.storage.minimized = false
    owdModuleAppWindow.storage.menu = true

    // recalculate pos x and y
    const newPositionX = await this.calcPositionX({window: owdModuleAppWindow})
    if (typeof newPositionX === 'number') owdModuleAppWindow.storage.position.x = newPositionX

    const newPositionY = await this.calcPositionY({window: owdModuleAppWindow})
    if (typeof newPositionY === 'number') owdModuleAppWindow.storage.position.y = newPositionY

    // update
    this.SET_WINDOW(owdModuleAppWindow)

    // check windows position on load
    await this.windowsHandlePageResize()

    // focus on window
    await this.windowFocus(owdModuleAppWindow)

    return owdModuleAppWindow
  }

  /**
   * Minimize window
   *
   * @param data
   */
  @Action
  async windowMinimize(data: any) {
    const owdModuleAppWindow = await this.getWindow(data)

    // is window in memory?
    if (!owdModuleAppWindow || !owdModuleAppWindow.storage) return console.log('[OWD] Window not found')

    owdModuleAppWindow.storage.minimized = true

    // update
    this.SET_WINDOW(owdModuleAppWindow)
  }

  /**
   * Maximize window
   *
   * @param data
   */
  @Action
  async windowMaximize(data: any) {
    const owdModuleAppWindow = await this.getWindow(data)

    // is window in memory?
    if (!owdModuleAppWindow || !owdModuleAppWindow.storage) return console.log('[OWD] Window not found')

    if (owdModuleAppWindow.config.maximizable) {
      owdModuleAppWindow.storage.maximized = true
      this.fullscreenModule.SET_FULLSCREEN_MODE(true)
    }

    // update
    this.SET_WINDOW(owdModuleAppWindow)
  }

  /**
   * Un-maximize window
   *
   * @param data
   */
  @Action
  async windowUnmaximize(data: any) {
    const owdModuleAppWindow = await this.getWindow(data)

    // is window in memory?
    if (!owdModuleAppWindow || !owdModuleAppWindow.storage) return console.log('[OWD] Window not found')

    if (owdModuleAppWindow.config.maximizable) {
      owdModuleAppWindow.storage.maximized = false
    }

    // update
    this.SET_WINDOW(owdModuleAppWindow)
  }

  /**
   * Invert maximize window status
   *
   * @param data
   */
  @Action
  async windowToggleMaximize(data: any) {
    const owdModuleAppWindow = await this.getWindow(data)

    // is window in memory?
    if (!owdModuleAppWindow || !owdModuleAppWindow.storage) return console.log('[OWD] Window not found')

    if (owdModuleAppWindow.config.maximizable) {
      owdModuleAppWindow.storage.maximized = !owdModuleAppWindow.storage.maximized

      if (owdModuleAppWindow.storage.maximized) {
        this.fullscreenModule.SET_FULLSCREEN_MODE(true)
      }
    }

    // update
    this.SET_WINDOW(window)
  }

  /**
   * Expand window
   * todo check if is the same as maximize
   *
   * @param data
   */
  /*
  @Action
  async windowExpand(data: any) {
    const window = await this.getWindow(data)

    // is window in memory?
    if (!window || !window.storage) return console.log('[OWD] Window not found')

    if (window.config.expandable) {
      window.storage.expanded = !window.storage.expanded

      // update
      this.SET_WINDOW(window)
    }
  }
   */

  /**
   * Set window position
   *
   * @param data
   */
  @Action
  async windowSetPosition(data: any) {
    const owdModuleAppWindow = await this.getWindow(data)

    // is window in memory?
    if (!owdModuleAppWindow || !owdModuleAppWindow.storage) return console.log('[OWD] Window not found')

    owdModuleAppWindow.storage.position.x = data.position.x
    owdModuleAppWindow.storage.position.y = data.position.y

    const newPositionX = await this.calcPositionX({window: owdModuleAppWindow})
    if (typeof newPositionX === 'number') owdModuleAppWindow.storage.position.x = newPositionX

    const newPositionY = await this.calcPositionY({window: owdModuleAppWindow})
    if (typeof newPositionY === 'number') owdModuleAppWindow.storage.position.y = newPositionY

    // update
    this.SET_WINDOW(owdModuleAppWindow)
  }

  /**
   * Set all windows hidden
   */
  @Action
  async windowMinimizeAll() {
    await forEachWindowInstance(owdModuleAppWindow => {
      if (owdModuleAppWindow.storage.maximized) {
        owdModuleAppWindow.storage.closed = true
      }
    })
  }

  /**
   * Set all windows not maximized
   */
  @Action
  async windowUnmaximizeAll() {
    await forEachWindowInstance(async owdModuleAppWindow => {
      if (owdModuleAppWindow.storage.maximized) {
        await this.windowUnmaximize(owdModuleAppWindow)
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
  async getWindowPosition(data: any) {
    const owdModuleAppWindow = await this.getWindow(data)

    // is window in memory?
    if (!owdModuleAppWindow || !owdModuleAppWindow.storage) return console.log('[OWD] Window not found')

    return {
      x: owdModuleAppWindow.storage.x,
      y: owdModuleAppWindow.storage.y
    }
  }

  /**
   * Increment window focus
   *
   * @param data
   */
  @Action
  async windowFocus(data: any) {
    const owdModuleAppWindow = await this.getWindow(data)

    // is window in memory?
    if (!owdModuleAppWindow || !owdModuleAppWindow.storage) return console.log('[OWD] Window not found')

    // handle windowFocuses positions
    const owdWindowFocuses = { ...this.windowFocuses };
    const owdWindowFocusIndex = owdWindowFocuses.list.indexOf(owdModuleAppWindow.uniqueID)

    if (owdWindowFocuses.list[0] == owdModuleAppWindow.uniqueID) {
      return false
    }

    if (owdWindowFocusIndex > -1) {
      owdWindowFocuses.list.splice(owdWindowFocusIndex, 1)
    }

    const tsFirstDayOfTheMonth = (+new Date(new Date().getFullYear(), 0, 1)) / 100;
    const ts = +new Date() / 100
    const counterString = (ts - tsFirstDayOfTheMonth).toString()
    const counter = parseInt(counterString)

    owdWindowFocuses.list.unshift(owdModuleAppWindow.uniqueID)
    owdWindowFocuses.counter = counter

    if (owdWindowFocuses.counter > counter) {
      await forEachWindowInstance(owdWindow => {
        owdWindow.storage.position.z = 0
      })
    }

    this.SET_WINDOW_FOCUSES(owdWindowFocuses)

    // handle storage position
    owdModuleAppWindow.storage.position.z = counter

    // update
    this.SET_WINDOW(owdModuleAppWindow)
  }

  /**
   * Get window focus
   *
   * @param data
   */
  @Action
  async getWindowFocus(data: any) {
    const owdModuleAppWindow = await this.getWindow(data)

    // is window in memory?
    if (!owdModuleAppWindow || !owdModuleAppWindow.storage) return console.log('[OWD] Window not found')

    return owdModuleAppWindow.storage.z
  }

  /**
   * Update window position
   *
   * @param data
   */
  @Action
  async windowUpdatePosition(data: {data: any, position: OwdModuleAppWindowConfigPosition }) {
    const owdModuleAppWindow = await this.getWindow(data.data)

    // is window in memory?
    if (!owdModuleAppWindow || !owdModuleAppWindow.storage) return console.log('[OWD] Window not found')

    owdModuleAppWindow.storage.position = data.position

    // update
    this.SET_WINDOW(owdModuleAppWindow)
  }

  /**
   * Update window size
   *
   * @param data
   */
  @Action
  async windowUpdateSize(data: {data: any, size: OwdModuleAppWindowConfigSize }) {
    const owdModuleAppWindow = await this.getWindow(data.data)

    // is window in memory?
    if (!owdModuleAppWindow || !owdModuleAppWindow.storage) return console.log('[OWD] Window not found')

    owdModuleAppWindow.storage.size = data.size

    // update
    this.SET_WINDOW(owdModuleAppWindow)
  }

  /**
   * Destroy window
   *
   * @param data
   */
  @Action
  async windowDestroy(data: any) {
    const owdModuleAppWindow = await this.getWindow(data)

    // is window in memory?
    if (!owdModuleAppWindow || !owdModuleAppWindow.storage) return console.log('[OWD] Window not found');

    // destroy window if > 1
    if (
      (!!owdModuleAppWindow.module.moduleInfo.autostart === false && !!owdModuleAppWindow.config.menu === false) ||
      await this.getWindowInstancesCount(owdModuleAppWindow) > 1
    ) {
      // destroy module window instance
      this.UNREGISTER_WINDOW(owdModuleAppWindow);

      // unregister module window vuex store
      const storeName = `${owdModuleAppWindow.module.moduleInfo.name}-${owdModuleAppWindow.uniqueID}`

      if (!owdModuleAppWindow.module.moduleInfo.singleton) {
        if (owdModuleAppWindow.module.hasModuleStoreInstance()) {
          owdModuleAppWindow.module.unregisterModuleStoreInstance(storeName)

          // force window save because watch event isn't triggered on component destroy
          await this.saveWindowsStorage()

          return true
        }
      }
    }

    // otherwise, just close the window
    await this.windowClose(owdModuleAppWindow)
  }

  /**
   * Get window instances count
   *
   * @param data
   */
  @Action
  async getWindowInstancesCount(data: any) {
    const owdModuleAppWindow = await this.getWindow(data)

    // is window in memory?
    if (!owdModuleAppWindow || !owdModuleAppWindow.storage) return console.log('[OWD] Window not found');

    const windowInstances = owdModuleAppWindow.module.windowInstances[owdModuleAppWindow.config.name]

    if (windowInstances) {
      return Object.keys(windowInstances).length
    }

    return 0
  }

  /**
   * Destroy all windows in this group
   *
   * @param windowGroup
   */
  @Action
  async windowDestroyGroup(windowGroup: any) {
    if (isWindowGroupExisting(windowGroup)) {
      await forEachWindowInstanceInWindowGroup(windowGroup, (windowInstance: any) => {
        this.windowDestroy(windowInstance)
      })
    }
  }

  /**
   * Close window
   *
   * @param data
   */
  @Action
  async windowClose(data: any) {
    const owdModuleAppWindow = await this.getWindow(data)

    // is window in memory?
    if (!owdModuleAppWindow || !owdModuleAppWindow.storage) return console.log('[OWD] Window not found')

    owdModuleAppWindow.storage.closed = true

    if (typeof owdModuleAppWindow.config.menu === 'boolean') {
      owdModuleAppWindow.storage.menu = false
    }

    this.SET_WINDOW(owdModuleAppWindow)
  }

  /**
   * Close all windows
   */
  @Action
  async windowCloseAll() {
    await forEachWindowInstance(owdModuleAppWindow => {
      owdModuleAppWindow.storage.closed = true
      this.SET_WINDOW(owdModuleAppWindow)
    })
  }

  /**
   * Close all windows in this group
   *
   * @param windowGroup
   */
  @Action
  async windowCloseGroup(windowGroup: string) {
    if (isWindowGroupExisting(windowGroup)) {
      await forEachWindowInstanceInWindowGroup(windowGroup, async owdModuleAppWindow => {
        await this.windowClose(owdModuleAppWindow)
      })
    }
  }

  @Action
  async windowSetNavTitle(data: {data: any, title: string}) {
    const owdModuleAppWindow = await this.getWindow(data.data)

    // is window in memory?
    if (!owdModuleAppWindow || !owdModuleAppWindow.storage) return console.log('[OWD] Window not found')

    // window.title = data.title

    // update
    this.SET_WINDOW(owdModuleAppWindow)
  }

  /**
   * Calculate x position for new opened windows
   * todo method move in a helper
   *
   * @param data
   * @returns {Promise<void>}
   */
  @Action
  async calcPositionX(data: any) {
    const desktopElement = document.getElementById('desktop')

    if (!desktopElement) {
      return false;
    }

    const desktopElementContent = desktopElement.getElementsByClassName('desktop-content')[0]
    const owdModuleAppWindow = data.window

    const owdConfigDesktopOffset = owdModuleAppWindow.module.app.config.owd.desktop.offset

    if (typeof data.forceLeft === 'undefined') data.forceLeft = false
    if (typeof data.forceRight === 'undefined') data.forceRight = false

    // is window in memory?
    if (!data || !owdModuleAppWindow.storage) return console.log('[OWD] Window not found')

    let x = owdModuleAppWindow.storage ? owdModuleAppWindow.storage.position.x : owdConfigDesktopOffset.left

    // if > 0, window pos was loaded from local storage
    if (owdModuleAppWindow.storage.position.x === 0 || data.forceLeft) {
      x = owdConfigDesktopOffset.left
    } else if (owdModuleAppWindow.storage.position.x < 0 || data.forceRight) {
      x = desktopElementContent.clientWidth - owdModuleAppWindow.config.size.width - owdConfigDesktopOffset.right // right
      if (owdModuleAppWindow.storage.position.x < 0) x = x + owdModuleAppWindow.storage.position.x
    }

    return x
  }

  /**
   * Calculate y position for new opened windows
   * todo method move in a helper
   *
   * @param data
   * @returns {Promise<unknown>}
   */
  @Action
  async calcPositionY(data: any) {
    const desktopElement = document.getElementById('desktop')

    if (!desktopElement) {
      return false;
    }

    const desktopElementContent = desktopElement.getElementsByClassName('desktop-content')[0]
    const owdModuleAppWindow = data.window

    const owdConfigDesktopOffset = owdModuleAppWindow.module.app.config.owd.desktop.offset

    if (typeof data.forceLeft === 'undefined') data.forceLeft = false
    if (typeof data.forceRight === 'undefined') data.forceRight = false

    // is window in memory?
    if (!data || !owdModuleAppWindow.storage) return console.log('[OWD] Window not found')

    let y = owdModuleAppWindow.storage.position.y || owdConfigDesktopOffset.top

    // if > 0, window pos was loaded from local storage
    if (owdModuleAppWindow.storage.position.y === 0 || data.forceLeft) {
      y = owdConfigDesktopOffset.top
    } else if (owdModuleAppWindow.storage.position.y < 0 || data.forceRight) {
      if (owdModuleAppWindow.config) {
        y = desktopElementContent.clientHeight - owdModuleAppWindow.config.size.height - owdConfigDesktopOffset.bottom
        if (owdModuleAppWindow.storage.position.y < 0) y = y + owdModuleAppWindow.storage.position.y
      }
    }

    return y
  }

  /**
   * Reset windows position on page resize
   */
  @Action
  async windowsHandlePageResize() {
    const pageWindow = window

    await forEachWindowInstance(async (owdModuleAppWindow: any) => {
      let changed = false

      if (owdModuleAppWindow.storage && !owdModuleAppWindow.storage.closed) {
        const maxLeft = owdModuleAppWindow.storage.position.x + owdModuleAppWindow.storage.size.width
        const maxTop = owdModuleAppWindow.storage.position.y + owdModuleAppWindow.storage.size.height

        // calculate max top/left position allowed
        if (maxLeft < owdModuleAppWindow.storage.size.width || maxLeft > pageWindow.innerWidth) {
          const newPositionX = await this.calcPositionX({
            window: owdModuleAppWindow,
            forceRight: true
          })
          if (typeof newPositionX === 'number') owdModuleAppWindow.storage.position.x = newPositionX
          changed = true
        }
        if (maxTop < owdModuleAppWindow.storage.size.height || maxTop > pageWindow.innerHeight) {
          const newPositionY = await this.calcPositionY({
            window: owdModuleAppWindow,
            forceRight: true
          })
          if (typeof newPositionY === 'number') owdModuleAppWindow.storage.position.y = newPositionY
          changed = true
        }
      }

      if (changed) {
        this.SET_WINDOW(owdModuleAppWindow)
      }
    })
  }
}
