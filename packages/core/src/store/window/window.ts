import {VuexModule, Module, Mutation, Action, RegisterOptions} from "vuex-class-modules";

import * as WindowUtils from '../../utils/windows/windows.utils'

import DebugModule from "../debug";
import ModulesModule from "../modules";
import FullScreenModule from "../fullscreen";
import {
  OwdModuleAppWindowConfigPosition, OwdModuleAppWindowConfigSize,
  OwdModuleAppWindowCreateInstanceData,
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

        // for each window in moduleInfo.windows (for example WindowSample)
        for (const owdModuleAppWindowConfig of owdModuleApp.moduleInfo.windows) {

          console.log('[OWD] Load module window: ' + owdModuleAppWindowConfig.name)

          this.REGISTER_WINDOW_NAMESPACE({
            moduleName: owdModuleApp.moduleInfo.name,
            windowName: owdModuleAppWindowConfig.name
          })

          const owdModuleAppWindowInstanceData: OwdModuleAppWindowCreateInstanceData = {
            module: owdModuleApp,
            config: owdModuleAppWindowConfig,
            storage: null
          }

          // create module app window instances restoring previous local storage

          if (
            owdModuleApp.hasAutostart &&
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

            // generate at least one window instance if .autostart is set to true
            if (owdModuleApp.moduleInfo.autostart) {
              const owdModuleAppInstance = await this.windowCreateInstance(owdModuleAppWindowInstanceData)

              if (owdModuleAppWindowConfig.autoOpen) {
                await this.windowOpen(owdModuleAppInstance)
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

    await WindowUtils.forEachWindowInstance(owdWindow => {
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
  getWindow(data: string | { name?: string, uniqueID?: string } | OwdModuleAppWindowInstance): OwdModuleAppWindowInstance|any|null {
    return new Promise((resolve, reject) => {
      if ((<OwdModuleAppWindowInstance>data) !== undefined) {
        return resolve(data)
      }

      let windowName
      let uniqueID

      switch (typeof data) {
        case 'string':
          windowName = data
          break
        case 'object':
          if (data.uniqueID) {
            uniqueID = data.uniqueID
          }

          if (data.name) {
            windowName = data.name
          }
          break
      }

      let owdModuleAppWindow

      if (uniqueID) {
        owdModuleAppWindow = WindowUtils.findWindowInstanceByAttr('uniqueID', uniqueID)
      } else if (windowName) {
        owdModuleAppWindow = WindowUtils.findWindowInstanceByAttr('name', windowName)
      }

      if (owdModuleAppWindow) {
        return resolve(owdModuleAppWindow)
      }

      console.error(`[OWD] Module app Window "${windowName}" not found`)

      return reject()
    })
  }

  /**
   * Create new window
   *
   * @param data
   */
  @Action
  async windowCreate(data: string|OwdModuleAppWindowInstance): Promise<any> {
    let owdModuleAppWindow

    if (typeof data === 'string') {
      const windowName = data
      const owdModuleAppWindowDetail = await WindowUtils.getWindowDetailsFromWindowName(windowName)

      if (!owdModuleAppWindowDetail) {
        return console.error(`[OWD] Unable to create new window because "${windowName}" window doesn\'t exist`)
      }

      // check if module is a singleton so it doesn't have to create a new window
      if (owdModuleAppWindowDetail && owdModuleAppWindowDetail.module.moduleInfo.singleton) {
        const windowInstance = WindowUtils.getWindowGroupFirstInstance(windowName)

        if (typeof windowInstance !== 'undefined') {
          return this.windowOpen(windowInstance)
        }
      }

      // data was a string, create a new window instance
      owdModuleAppWindow = await this.windowCreateInstance({
        config: owdModuleAppWindowDetail.window,
        module: owdModuleAppWindowDetail.module,
        storage: null
      })
    } else {
      owdModuleAppWindow = data
    }

    if (owdModuleAppWindow.storage) {
      owdModuleAppWindow.storage.closed = false
      owdModuleAppWindow.storage.minimized = false
    }

    // focus on window
    await this.windowFocus(owdModuleAppWindow)

    return owdModuleAppWindow
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
      owdModuleAppWindow.uniqueID = WindowUtils.generateWindowUniqueId()
    }

    owdModuleAppWindow.storeUniqueName = `${owdModuleAppWindow.module.moduleInfo.name}-${owdModuleAppWindow.uniqueID}`

    // add storage (clone from windowInstance.config)
    owdModuleAppWindow.storage = {
      position: data.config.position,
      size: data.config.size,
      closed: data.config.closed,
      minimized: data.config.minimized,
      maximized: data.config.maximized,
      focused: false
    }

    // overwrite .storage with history (local storage)
    if (data.storage) {

      // parse window positions and more
      owdModuleAppWindow.storage = {
        position: data.storage.position,
        size: data.storage.size,
        closed: !!data.storage.closed,
        minimized: !!data.storage.minimized,
        maximized: !!data.storage.maximized,
        focused: (owdModuleAppWindow.uniqueID === this.windowFocusModule.windowFocusActiveUniqueID)
      }
    }

    // initialize storeInstance if module isn't a singleton
    if (!owdModuleAppWindow.module.isSingleton) {
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

    // recalculate pos x and y
    const newPositionX = await this.calcPositionX({window: owdModuleAppWindow})
    if (typeof newPositionX === 'number') owdModuleAppWindow.storage.position.x = newPositionX

    const newPositionY = await this.calcPositionY({window: owdModuleAppWindow})
    if (typeof newPositionY === 'number') owdModuleAppWindow.storage.position.y = newPositionY

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
  }

  /**
   * Reset window position
   *
   * @param data
   */
  @Action
  async windowResetPosition(data: any) {
    const owdModuleAppWindow = await this.getWindow(data)

    // is window in memory?
    if (!owdModuleAppWindow || !owdModuleAppWindow.storage) return console.log('[OWD] Window not found')

    owdModuleAppWindow.storage.position = owdModuleAppWindow.config.position
  }

  /**
   * Reset window size
   *
   * @param data
   */
  @Action
  async windowResetSize(data: any) {
    const owdModuleAppWindow = await this.getWindow(data)

    // is window in memory?
    if (!owdModuleAppWindow || !owdModuleAppWindow.storage) return console.log('[OWD] Window not found')

    owdModuleAppWindow.storage.size = owdModuleAppWindow.config.size
  }

  /**
   * Set all windows hidden
   */
  @Action
  async windowMinimizeAll() {
    await WindowUtils.forEachWindowInstance(owdModuleAppWindow => {
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
    await WindowUtils.forEachWindowInstance(async owdModuleAppWindow => {
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

    // focus window
    this.windowFocusModule.SET_WINDOW_FOCUS(owdModuleAppWindow.uniqueID)

    // handle windowFocuses positions
    const owdWindowFocuses = this.windowFocusModule.windowFocusList;

    await WindowUtils.forEachWindowInstance(owdWindow => {
      owdWindow.storage.position.z = owdWindowFocuses.indexOf(owdWindow.uniqueID)

      // set focused if window has just been focused
      owdWindow.storage.focused = (owdModuleAppWindow.uniqueID === owdWindow.uniqueID)
    })
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

    return owdModuleAppWindow.storage.position.z
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
  }

  /**
   * Destroy window
   *
   * @param data
   */
  @Action
  async windowDestroy(data: any) {
    const owdModuleAppWindow = await this.getWindow(data)

    // with config.menu === true, one instance should always stay alive
    if (
      owdModuleAppWindow.config.menu && await WindowUtils.getWindowGroupInstancesCount(owdModuleAppWindow.config.name) > 1
    ) {
      // destroy module window instance
      this.UNREGISTER_WINDOW(owdModuleAppWindow);
      this.windowFocusModule.UNSET_WINDOW_FOCUS(owdModuleAppWindow.uniqueID);

      // unregister module window vuex store
      const storeName = `${owdModuleAppWindow.module.moduleInfo.name}-${owdModuleAppWindow.uniqueID}`

      if (!owdModuleAppWindow.module.moduleInfo.singleton) {
        if (owdModuleAppWindow.module.hasModuleStoreInstance()) {
          owdModuleAppWindow.module.unregisterModuleStoreInstance(storeName)

          // force window save because watch event isn't triggered on component destroy
          await this.saveWindowsStorage()
        }
      }

      return true
    }

    // otherwise, just close the window and reset it
    await this.windowClose(owdModuleAppWindow)
    await this.windowResetPosition(owdModuleAppWindow)
    await this.windowResetSize(owdModuleAppWindow)
  }

  /**
   * Destroy all windows in this group
   *
   * @param windowGroup
   */
  @Action
  async windowDestroyGroup(windowGroup: any) {
    if (WindowUtils.isWindowNameExisting(windowGroup)) {
      await WindowUtils.forEachWindowGroupInstance(windowGroup, (windowInstance: any) => {
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
  }

  /**
   * Close all windows
   */
  @Action
  async windowCloseAll() {
    await WindowUtils.forEachWindowInstance(owdModuleAppWindow => {
      owdModuleAppWindow.storage.closed = true
    })
  }

  /**
   * Close all windows in this group
   *
   * @param windowGroup
   */
  @Action
  async windowCloseGroup(windowGroup: string) {
    if (WindowUtils.isWindowNameExisting(windowGroup)) {
      await WindowUtils.forEachWindowGroupInstance(windowGroup, async owdModuleAppWindow => {
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

    await WindowUtils.forEachWindowInstance(async (owdModuleAppWindow: any) => {
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
        }
        if (maxTop < owdModuleAppWindow.storage.size.height || maxTop > pageWindow.innerHeight) {
          const newPositionY = await this.calcPositionY({
            window: owdModuleAppWindow,
            forceRight: true
          })
          if (typeof newPositionY === 'number') owdModuleAppWindow.storage.position.y = newPositionY
        }
      }
    })
  }
}
