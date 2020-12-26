import {VuexModule, Module, Mutation, Action, RegisterOptions} from "vuex-class-modules";

import {
  generateWindowUniqueId,
  findWindowInstanceByAttr,
  forEachWindowInstanceInWindowGroup,
  getWindowGroup,
  getWindowGroupWindowIndex,
  isWindowGroupExisting,
  isWindowGroupWindowIndexExisting, forEachWindowInstance
} from '../utils/windows/windows.utils'

//import store, {storeModules} from "./index";
import DebugModule from "./debug";
import ModulesModule from "./modules";
import FullScreenModule from "./fullscreen";
import {
  OwdModule,
  OwdModuleWindowConfig, OwdModuleWindowConfigPosition, OwdModuleWindowConfigSize,
  OwdModuleWindowCreateInstanceData,
  OwdModuleWindowInstance, OwdModuleWindowsStorage
} from "../../../types";
import * as windowsStorageUtils from "../utils/windows/windowsLocalStorage.utils";

const windowsLocalStorage = windowsStorageUtils.loadWindowsStorage()

@Module
export default class WindowsModule extends VuexModule {
  private readonly debugModule: DebugModule
  private readonly modulesModule: ModulesModule
  private readonly fullscreenModule: FullScreenModule

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
  get windowsInstances(): OwdModuleWindowInstance[] {
    let windowsInstances: OwdModuleWindowInstance[] = []

    // for each loaded module
    for (const module of Object.values(this.modulesModule.modulesLoaded)) {

      // cycle windowName in each module window instances (WindowSample)
      for (const windowName in module.windowsInstances) {
        if (Object.prototype.hasOwnProperty.call(module.windowsInstances, windowName)) {

          // cycle uniqueID in each module window instances name
          for (const uniqueID in module.windowsInstances[windowName]) {
            if (Object.prototype.hasOwnProperty.call(module.windowsInstances[windowName], uniqueID)) {

              windowsInstances.push(module.windowsInstances[windowName][uniqueID])

            }
          }

        }
      }

    }

    return windowsInstances
  }

  /**
   * Getter of windows instances grouped by window name (WindowsSample)
   */
  get windowGroups(): {[key: string]: OwdModuleWindowInstance[]} {
    let windowGroups: {[key: string]: OwdModuleWindowInstance[]} = {}

    // for each loaded module
    for (const module of Object.values(this.modulesModule.modulesLoaded)) {

      // cycle windowName in each module window instances (WindowSample)
      for (const windowName in module.windowsInstances) {
        if (Object.prototype.hasOwnProperty.call(module.windowsInstances, windowName)) {

          // cycle uniqueID in each module window instances name
          for (const uniqueID in module.windowsInstances[windowName]) {
            if (Object.prototype.hasOwnProperty.call(module.windowsInstances[windowName], uniqueID)) {

              const moduleWindow = module.windowsInstances[windowName][uniqueID]

              if (typeof windowGroups[moduleWindow.config.name] === 'undefined') {
                windowGroups[moduleWindow.config.name] = []
              }

              windowGroups[moduleWindow.config.name].push(moduleWindow)

            }
          }

        }
      }

    }

    return windowGroups
  }

  /**
   * Getter of windows instances grouped by category (productivity, etc)
   */
  get windowCategories(): {[key: string]: OwdModuleWindowInstance[]} {
    let windowCategories: {[key: string]: OwdModuleWindowInstance[]} = {}

    // for each loaded module
    for (const module of Object.values(this.modulesModule.modulesLoaded)) {

      // cycle windowName in each module window instances (WindowSample)
      for (const windowName in module.windowsInstances) {
        if (Object.prototype.hasOwnProperty.call(module.windowsInstances, windowName)) {

          // cycle uniqueID in each module window instances name
          for (const uniqueID in module.windowsInstances[windowName]) {
            if (Object.prototype.hasOwnProperty.call(module.windowsInstances[windowName], uniqueID)) {

              const moduleWindow = module.windowsInstances[windowName][uniqueID]

              if (typeof moduleWindow.config.category === 'undefined') {
                moduleWindow.config.category = 'other'
              }

              if (typeof windowCategories[moduleWindow.config.category] === 'undefined') {
                windowCategories[moduleWindow.config.category] = []
              }

              windowCategories[moduleWindow.config.category].push(moduleWindow)

            }
          }

        }
      }

    }

    return windowCategories
  }

  @Mutation
  REGISTER_WINDOW(data: any) {
    const moduleName = data.module.moduleInfo.name
    const moduleWindowsInstances = this.modulesModule.modulesLoaded[moduleName].windowsInstances

    // add window.config.name (WindowSample) to module windows
    if (typeof moduleWindowsInstances[data.config.name] === 'undefined') {
      moduleWindowsInstances[data.config.name] = {}
    }

    // add window unique ID with its data
    moduleWindowsInstances[data.config.name][data.uniqueID] = data
  }

  @Mutation
  UNREGISTER_WINDOW(data: any) {
    const moduleName = data.module.moduleInfo.name
    const moduleWindowsInstances = this.modulesModule.modulesLoaded[moduleName].windowsInstances

    // remove from module windows
    if (typeof moduleWindowsInstances[data.config.name] !== 'undefined') {
      const indexGroup = Object.keys(moduleWindowsInstances[data.config.name]).indexOf(data.uniqueID)

      if (indexGroup > -1) {
        delete moduleWindowsInstances[data.config.name][indexGroup]
      }
    }
  }

  @Mutation
  SET_WINDOW(data: any) {
    // console.log('SET WINDOW', data)
    // keep this mutation just for vuex logging cuz
    // window object properties are changed directly
  }

  /**
   * Initialize all windows instances and load positions from local storage
   */
  @Action
  async initialize() {
    const modules = Object.values(this.modulesModule.modulesLoaded);

    for (const module of modules) {

      // does module contain any windows?
      if (module.moduleInfo.windows && module.moduleInfo.windows.length > 0) {

        // for each window in moduleInfo.windows (for example WindowSample)
        for (const moduleWindowConfig of module.moduleInfo.windows) {

          console.log('[OWD] Load module component: ' + moduleWindowConfig.name)

          // const storageWindows = await dispatch('getInitialWindowsStorageByWindowName', windowName)

          const windowData: OwdModuleWindowCreateInstanceData = {
            module: module,
            config: moduleWindowConfig,
            storage: null
          }

          // check windows local storage for moduleWindowConfig.name
          if (windowsLocalStorage && Object.prototype.hasOwnProperty.call(windowsLocalStorage, moduleWindowConfig.name)) {
            const moduleWindowsInstancesLocalStorage = windowsLocalStorage[moduleWindowConfig.name]

            for (const uniqueID in moduleWindowsInstancesLocalStorage) {
              const moduleWindowInstanceLocalStorage = moduleWindowsInstancesLocalStorage[uniqueID]

              await this.windowCreateInstance({
                ...windowData,
                uniqueID: uniqueID,
                storage: moduleWindowInstanceLocalStorage,
              })
            }
          } else {

            // generate at least one window instance if .autostart is set to true
            if (module.moduleInfo.autostart) {
              await this.windowCreateInstance(windowData)
            }

          }

        }

      }
    }

    // check windows position on load
    this.windowsHandlePageResize()

    // for each module

      /*
      const module = this.modulesModule.modulesLoaded[moduleName]

      // does module contain any windows?
      if (
        module.moduleInfo &&
        module.moduleInfo.windows && Array.isArray(module.moduleInfo.windows) &&
        module.moduleInfo.windows.length > 0
      ) {

        // for each window in module
        for (const moduleWindowComponent of module.moduleInfo.windows) {
          // is component effectively a window?
          if (moduleWindowComponent.window) {

            // for example WindowSample
            const windowName = moduleWindowComponent.name

            console.log('[OWD] Load module component: ' + windowName)

            const storageWindows = await dispatch('getInitialWindowsStorageByWindowName', windowName)

            const windowData = {
              name: windowName,
              config: moduleWindowComponent,
              module
            }

            // has windowsStorage filtered by windowName (from local storage) some windows for us?
            if (Array.isArray(storageWindows) && storageWindows.length > 0) {

              // for each window storage
              for (const windowStorage of storageWindows) {

                windowInstancesRegistrationPool.push({
                  ...windowData,
                  storage: windowStorage
                })

              }

            } else {

              // there is no window stored in local storage so generate
              // at least one instance if .autostart is set to true
              if (module.moduleInfo.autostart) {
                windowInstancesRegistrationPool.push(windowData)
              }

            }

          }
        }

      }
       */

    /*
    if (windowInstancesRegistrationPool.length > 0) {
      for (const windowData of windowInstancesRegistrationPool) {
        const windowInstance = await dispatch('windowCreateInstance', windowData)

        // add unique id to windowFocuses list
        if (windowInstance) {
          windowFocuses.push(windowInstance.uniqueID)
        }
      }
    }

    // check windows position on load
    dispatch('windowsHandlePageResize')

    if (JSON.stringify(windowFocuses) !== JSON.stringify(getters['windowFocuses'])) {
      commit('SET_WINDOW_FOCUSES', windowFocuses)
    }
     */
  }

  /**
   * Save windows storage (position, size and more)
   */
  @Action
  async saveWindowsStorage() {
    const data: OwdModuleWindowsStorage = {}

    await forEachWindowInstance(window => {
      if (typeof data[window.config.name] === 'undefined') {
        data[window.config.name] = {}
      }

      if (window.uniqueID) {
        data[window.config.name][window.uniqueID] = {
          position: window.storage.position,
          size: window.storage.size,
          closed: !!window.storage.closed,
          minimized: !!window.storage.minimized,
          maximized: !!window.storage.maximized
        }
      }
    })

    // update local storage
    windowsStorageUtils.saveWindowsStorage(JSON.stringify(data))
  }

  /**
   * Reset entire windows storage
   */
  @Action
  resetWindowsStorage() {
    windowsStorageUtils.resetWindowsStorage()
  }

  /**
   * Get window by name or by name + id
   *
   * @param data
   * @returns {null|*}
   */
  @Action
  getWindow(data: string | { name?: string, uniqueID?: string }): OwdModuleWindowInstance|null {
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

    let windowInstance

    if (uniqueID) {
      windowInstance = findWindowInstanceByAttr('uniqueID', uniqueID)
    }

    if (groupName) {
      windowInstance = findWindowInstanceByAttr('name', groupName)
    }

    if (windowInstance) {
      return windowInstance
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
    }

    const module = this.modulesModule.getModuleFromWindowName(windowName)

    if (!module) {
      return console.log('[OWD] This module window doesn\'t exists')
    }

    // check if there is already one window created in this window group
    if (isWindowGroupExisting(windowName)) {
      if (module.moduleInfo.singleton && isWindowGroupWindowIndexExisting(windowName, 0)) {
        const owdWindow = getWindowGroupWindowIndex(windowName, 0)

        // just open it instead of creating a new one
        if (owdWindow.storage.closed) {
          return this.windowOpen(owdWindow)
        }
      }
    }

    // check if window is given or...
    if (!data) {
      data = await this.windowCreateInstance({
        name: data.name,
        config: module.moduleStoreConfig,
        module
      })
    }

    if (!data) {
      return console.log('[OWD] Unable to create new window')
    }

    data.storage.closed = false
    data.storage.minimized = false

    if (typeof data.config.menu === 'boolean') {
      data.storage.menu = true
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
  async windowCreateInstance(data: OwdModuleWindowCreateInstanceData) {
    // check if window is given or...
    // get a copy of the module window configuration
    const windowInstance: any = {...data}

    // assign unique id
    if (!windowInstance.uniqueID) {
      windowInstance.uniqueID = generateWindowUniqueId()
    }

    // add storage (clone from windowInstance.config)
    windowInstance.storage = {
      position: data.config.position,
      size: data.config.size,
      closed: data.config.closed,
      minimized: data.config.minimized,
      maximized: data.config.maximized
    }

    // overwrite .storage with history (local storage)
    if (data.storage) {

      // parse window positions and more
      windowInstance.storage = {
        position: data.storage.position,
        size: data.storage.size,
        closed: !!data.storage.closed,
        minimized: data.storage.minimized,
        maximized: data.storage.maximized
      }

      // show item in menu
      if (!windowInstance.config.menu) {
        windowInstance.storage.menu = !!data.storage.menu
      }

      // window is already opened, show item in menu
      if (!data.storage.closed) {
        windowInstance.storage.menu = true
      }
    }

    // initialize storeInstance if module isn't a singleton
    if (!windowInstance.module.moduleInfo.singleton) {
      windowInstance.module.registerModuleStoreInstance(
        `${windowInstance.module.moduleInfo.name}-${windowInstance.uniqueID}`
      )
    }

    // calculate pos x and y
    windowInstance.storage.position.x = await this.calcPositionX({window: windowInstance})
    windowInstance.storage.position.y = await this.calcPositionY({window: windowInstance})

    if (!windowInstance) {
      return console.log('[OWD] Unable to create new window')
    }

    await this.REGISTER_WINDOW(windowInstance)

    return windowInstance
  }

  /**
   * Open window
   *
   * @param data
   */
  @Action
  async windowOpen(data: any) {
    const owdWindow = await this.getWindow(data)

    if (!owdWindow || !owdWindow.storage) {
      // window instance doesnt exist, create a new one
      return this.windowCreate(data)
    }

    owdWindow.storage.closed = false
    owdWindow.storage.minimized = false
    owdWindow.storage.menu = true

    // recalculate pos x and y
    owdWindow.storage.x = await this.calcPositionX({window: owdWindow})
    owdWindow.storage.y = await this.calcPositionY({window: owdWindow})

    // update
    this.SET_WINDOW(owdWindow)

    // check windows position on load
    this.windowsHandlePageResize()

    // focus on window
    this.windowFocus(owdWindow)

    return owdWindow
  }

  /**
   * Minimize window
   *
   * @param data
   */
  @Action
  async windowMinimize(data: any) {
    const owdWindow = await this.getWindow(data)

    // is window in memory?
    if (!owdWindow || !owdWindow.storage) return console.log('[OWD] Window missing')

    owdWindow.storage.minimized = true

    // update
    this.SET_WINDOW(owdWindow)
  }

  /**
   * Maximize window
   *
   * @param data
   */
  @Action
  async windowMaximize(data: any) {
    const owdWindow = await this.getWindow(data)

    // is window in memory?
    if (!owdWindow || !owdWindow.storage) return console.log('[OWD] Window missing')

    if (owdWindow.config.maximizable) {
      owdWindow.storage.maximized = true
      this.fullscreenModule.SET_FULLSCREEN_MODE(true)
    }

    // update
    this.SET_WINDOW(owdWindow)
  }

  /**
   * Un-maximize window
   *
   * @param data
   */
  @Action
  async windowUnmaximize(data: any) {
    const owdWindow = await this.getWindow(data)

    // is window in memory?
    if (!owdWindow || !owdWindow.storage) return console.log('[OWD] Window missing')

    if (owdWindow.config.maximizable) {
      owdWindow.storage.maximized = false
    }

    // update
    this.SET_WINDOW(owdWindow)
  }

  /**
   * Invert maximize window status
   *
   * @param data
   */
  @Action
  async windowToggleMaximize(data: any) {
    const owdWindow = await this.getWindow(data)

    // is window in memory?
    if (!owdWindow || !owdWindow.storage) return console.log('[OWD] Window missing')

    if (owdWindow.config.maximizable) {
      owdWindow.storage.maximized = !owdWindow.storage.maximized

      if (owdWindow.storage.maximized) {
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
    if (!window || !window.storage) return console.log('[OWD] Window missing')

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
    const owdWindow = await this.getWindow(data)

    // is window in memory?
    if (!owdWindow || !owdWindow.storage) return console.log('[OWD] Window missing')

    owdWindow.storage.x = data.position.x
    owdWindow.storage.x = await this.calcPositionX({window: owdWindow})

    owdWindow.storage.y = data.position.y
    owdWindow.storage.y = await this.calcPositionY({window: owdWindow})

    // update
    this.SET_WINDOW(owdWindow)
  }

  /**
   * Set all windows hidden
   */
  @Action
  async windowMinimizeAll() {
    await forEachWindowInstance(owdWindow => {
      if (owdWindow.storage.maximized) {
        owdWindow.storage.closed = true
      }
    })
  }

  /**
   * Set all windows not maximized
   */
  @Action
  async windowUnmaximizeAll() {
    await forEachWindowInstance(async owdWindow => {
      if (owdWindow.storage.maximized) {
        await this.windowUnmaximize(owdWindow)
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
    const owdWindow = await this.getWindow(data)

    // is window in memory?
    if (!owdWindow || !owdWindow.storage) return console.log('[OWD] Window missing')

    return {
      x: owdWindow.storage.x,
      y: owdWindow.storage.y
    }
  }

  /**
   * Increment window focus
   * todo
   *
   * @param data
   */
  @Action
  async windowFocus(data: any) {
    /*
    const windowFocuses = [...state.windowFocuses]

    if (windowFocuses.length === 0) {
      // set first item null cuz index should start from 1
      windowFocuses.push(null)
    }

    if (windowFocuses.includes(data.uniqueID)) {
      windowFocuses.splice(windowFocuses.indexOf(data.uniqueID), 1)
    }

    windowFocuses.push(data.uniqueID)

    this.forEachWindowInstance((window: any) => {
      let index = windowFocuses.indexOf(window.uniqueID)

      if (index < 0) {
        index = 0
      }

      window.storage.z = index
    })

    if (JSON.stringify(windowFocuses) !== JSON.stringify(state.windowFocuses)) {
      commit('SET_WINDOW_FOCUSES', windowFocuses)
    }
     */
  }

  /**
   * Get window focus
   *
   * @param data
   */
  @Action
  async getWindowFocus(data: any) {
    const owdWindow = await this.getWindow(data)

    // is window in memory?
    if (!owdWindow || !owdWindow.storage) return console.log('[OWD] Window missing')

    return owdWindow.storage.z
  }

  /**
   * Update window position
   *
   * @param data
   */
  @Action
  async windowUpdatePosition(data: {data: any, position: OwdModuleWindowConfigPosition }) {
    const owdWindow = await this.getWindow(data.data)

    // is window in memory?
    if (!owdWindow || !owdWindow.storage) return console.log('[OWD] Window missing')

    owdWindow.storage.position = data.position

    // update
    this.SET_WINDOW(owdWindow)
  }

  /**
   * Update window size
   *
   * @param data
   */
  @Action
  async windowUpdateSize(data: {data: any, size: OwdModuleWindowConfigSize }) {
    const owdWindow = await this.getWindow(data.data)

    // is window in memory?
    if (!owdWindow || !owdWindow.storage) return console.log('[OWD] Window missing')

    owdWindow.storage.size = data.size

    // update
    this.SET_WINDOW(owdWindow)
  }

  /**
   * Destroy window
   *
   * @param data
   */
  @Action
  async windowDestroy(data: any) {
    const owdWindow = await this.getWindow(data)

    // is window in memory?
    if (!owdWindow || !owdWindow.storage) return console.log('[OWD] Window missing');

    if (
      (!!owdWindow.module.moduleInfo.autostart === false && !!owdWindow.config.menu === false) ||
      Object.keys(owdWindow.module.windowsInstances).length > 1
    ) {
      // destroy window if > 1
      this.UNREGISTER_WINDOW(owdWindow);

      const storeName = `${data.module.moduleInfo.name}-${data.uniqueID}`

      if (!data.module.moduleInfo.singleton) {
        if (typeof data.module.moduleInfo.storeInstance === 'function') {
          data.module.destroyModuleStoreInstance(storeName)
        }
      }
    } else {
      await this.windowClose(owdWindow)
    }

    this.saveWindowsStorage()
  }

  /**
   * Destroy all windows in this group
   *
   * @param windowGroup
   */
  @Action
  windowDestroyGroup(windowGroup: any) {
    if (isWindowGroupExisting(windowGroup)) {
      /*
      this.forEachWindowInstance(windowGroup, (windowInstance: any) => {
        this.windowDestroy(windowInstance)
      })
      */
    }
  }

  /**
   * Close window
   *
   * @param data
   */
  @Action
  async windowClose(data: any) {
    const owdWindow = await this.getWindow(data)

    // is window in memory?
    if (!owdWindow || !owdWindow.storage) return console.log('[OWD] Window missing')

    owdWindow.storage.closed = true

    if (typeof owdWindow.config.menu === 'boolean') {
      owdWindow.storage.menu = false
    }

    this.SET_WINDOW(owdWindow)
  }

  /**
   * Close all windows
   */
  @Action
  async windowCloseAll() {
    await forEachWindowInstance(owdWindow => {
      owdWindow.storage.closed = true
      this.SET_WINDOW(owdWindow)
    })
  }

  /**
   * Close all windows in this group
   *
   * @param windowGroup
   */
  @Action
  windowCloseGroup(windowGroup: string) {
    if (isWindowGroupExisting(windowGroup)) {
      forEachWindowInstanceInWindowGroup(windowGroup, async owdWindow => {
        await this.windowClose(owdWindow)
      })
    }
  }

  @Action
  async windowSetNavTitle(data: {data: any, title: string}) {
    const owdWindow = await this.getWindow(data.data)

    // is window in memory?
    if (!owdWindow || !owdWindow.storage) return console.log('[OWD] Window missing')

    // window.title = data.title

    // update
    this.SET_WINDOW(owdWindow)
  }

  /**
   * Calculate x position for new opened windows
   *
   * @param data
   * @returns {Promise<void>}
   */
  @Action
  async calcPositionX(data: any) {
    const pageWindow = window
    const owdWindow = data.window

    const owdConfigDesktopOffset = owdWindow.module.app.config.owd.desktop.offset

    if (typeof data.forceLeft === 'undefined') data.forceLeft = false
    if (typeof data.forceRight === 'undefined') data.forceRight = false

    // is window in memory?
    if (!data || !owdWindow.storage) return console.log('[OWD] Window missing')

    let x = owdWindow.storage.position.x

    // if > 0, window pos was loaded from local storage
    if (owdWindow.storage.position.x === 0 || data.forceLeft) {
      x = owdConfigDesktopOffset.left
    } else if (owdWindow.storage.position.x < 0 || data.forceRight) {
      x = pageWindow.innerWidth - owdWindow.config.size.width - owdConfigDesktopOffset.right // right
      if (owdWindow.storage.position.x < 0) x = x + owdWindow.storage.position.x
    }

    return x
  }

  /**
   * Calculate y position for new opened windows
   *
   * @param data
   * @returns {Promise<unknown>}
   */
  @Action
  async calcPositionY(data: any) {
    const pageWindow = window
    const owdWindow = data.window

    const owdConfigDesktopOffset = owdWindow.module.app.config.owd.desktop.offset

    if (typeof data.forceLeft === 'undefined') data.forceLeft = false
    if (typeof data.forceRight === 'undefined') data.forceRight = false

    // is window in memory?
    if (!data || !owdWindow.storage) return console.log('[OWD] Window missing')

    let y = owdWindow.storage.position.y

    // if > 0, window pos was loaded from local storage
    if (owdWindow.storage.position.y === 0 || data.forceLeft) {
      y = owdConfigDesktopOffset.top
    } else if (owdWindow.storage.position.y < 0 || data.forceRight) {
      if (owdWindow.config) {
        y = pageWindow.innerHeight - owdWindow.config.size.height - owdConfigDesktopOffset.bottom // bottom
        if (owdWindow.storage.position.y < 0) y = y + owdWindow.storage.position.y
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

    await forEachWindowInstance(async (owdWindow: any) => {
      let changed = false

      if (owdWindow.storage && !owdWindow.storage.closed) {
        const maxLeft = owdWindow.storage.position.x + owdWindow.storage.size.width
        const maxTop = owdWindow.storage.position.y + owdWindow.storage.size.height

        // calculate max top/left position allowed
        if (maxLeft < owdWindow.storage.size.width || maxLeft > pageWindow.innerWidth) {
          owdWindow.storage.position.x = await this.calcPositionX({window: owdWindow, forceRight: true})
          changed = true
        }
        if (maxTop < owdWindow.storage.size.height || maxTop > pageWindow.innerHeight) {
          owdWindow.storage.position.y = await this.calcPositionY({window: owdWindow, forceRight: true})
          changed = true
        }
      }

      if (changed) {
        this.SET_WINDOW(owdWindow)
      }
    })
  }
}
