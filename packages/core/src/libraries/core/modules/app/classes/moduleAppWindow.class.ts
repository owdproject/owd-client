import * as helperWindow from "@owd-client/core/src/helpers/helperWindow";
import * as helperStorage from "@owd-client/core/src/helpers/helperStorage";
import {generateUniqueID} from "@owd-client/core/src/helpers/helperStrings";

import {
  OwdModuleAppWindowInstance,
  OwdModuleAppWindowCreateInstanceData,
  OwdModuleAppWindowConfigPosition,
  OwdModuleAppWindowConfigSize,
  OwdModuleApp,
  OwdModuleAppWindowStorage, OwdModuleAppWindowConfig, OwdModuleAppWindowsStorage
} from "@owd-client/types";

export default class ModuleAppWindow implements OwdModuleAppWindowInstance {
  private instance: OwdModuleAppWindowInstance
  private mounted: boolean = false

  private events: { [eventName: string]: any[] } = {
    onMounted: []
  }

  constructor(data: OwdModuleAppWindowCreateInstanceData) {
    this.instance = {
      module: data.module,
      config: {...data.config},
      // @ts-ignore todo fix types error
      storage: {...data.storage},
    }

    this.loadStorage(data.storage)

    if (data.storage && typeof data.storage.uniqueID !== 'undefined') {
      this.instance.storage.uniqueID = data.storage.uniqueID
    } else {
      this.instance.storage.uniqueID = generateUniqueID()
    }

    // initialize Vue store for this window instance
    if (!this.instance.module.isSingleton) {
      this.instance.module.registerStoreInstance(this.instance.config.name+'-'+this.instance.storage.uniqueID)
    }

    // register instance
    this.instance.module.windowInstances[this.instance.config.name][this.instance.storage.uniqueID] = this
    this.instance.module.store.commit('core/window/REGISTER_WINDOW_INSTANCE', this)

    // add to dock
    if (this.instance.config.dock === true) {
      this.instance.module.store.commit('core/dock/ADD', this)
    }

    this.setWorkspace(this.storage.workspace)
  }

  public onMounted(cb: any) {
    this.events.onMounted.push(cb)
  }

  public async eventsExecute(eventName: string) {
    for (const e of this.events[eventName]) {

      // execute event callback
      if (typeof e === 'function') {
        await e(this)
      }
    }

    this.events[eventName] = []
  }

  get config(): OwdModuleAppWindowConfig {
    return this.instance.config
  }

  get storage(): OwdModuleAppWindowStorage {
    return this.instance.storage
  }

  get module(): OwdModuleApp {
    return this.instance.module
  }

  get moduleName(): string {
    return this.module.moduleInfo.name
  }

  get windowName(): string {
    return this.config.name
  }

  get uniqueID(): string {
    return this.storage.uniqueID
  }

  get uniqueName(): string {
    return `${this.config.name}-${this.uniqueID}`
  }

  static configValidate(config: OwdModuleAppWindowConfig) {
    if (!config.theme) {
      config.theme = {}
    }

    if (typeof config.dock === 'undefined') {
      config.dock = true
    }

    if (typeof config.launcher === 'undefined') {
      config.launcher = true
    }

    // theme dense check
    if (typeof config.theme.dense === 'undefined') {
      config.theme.dense = true
    }

    // theme nav check
    if (typeof config.theme.nav === 'undefined') {
      config.theme.nav = {}
    }

    if (typeof config.theme.nav.title === 'undefined') {
      config.theme.nav.title = true
    }

    return config
  }

  static register(data: OwdModuleAppWindowCreateInstanceData) {
    // validate config
    data.config = ModuleAppWindow.configValidate(data.config)

    ModuleAppWindow.registerComponent(data)
    ModuleAppWindow.registerLauncher(data)
    ModuleAppWindow.registerDock(data)

    // if it's a new windowConfig name
    if (!Object.prototype.hasOwnProperty.call(data.module.windowInstances, data.config.name)) {
      // define windowName (WindowSample) to module window instances
      data.module.windowInstances[data.config.name] = {}

      // if window is generated dynamically, populate window config definition under moduleInfo.windows
      if (data.module.moduleInfo.windows && !data.module.moduleInfo.windows.find((window: OwdModuleAppWindowConfig) => window.name === data.config.name)) {
        data.module.moduleInfo.windows.push(data.config)
      }
    }
  }

  private static registerComponent(data: OwdModuleAppWindowCreateInstanceData) {
    if (!data.config.component) {
      throw Error(`No window component provided for ${data.config.name} in OWD`)
    }

    // register vue component
    data.module.app.component(data.config.name, data.config.component)

    // i don't need it anymore in the config
    delete data.config.component
  }

  private static registerDock(data: OwdModuleAppWindowCreateInstanceData) {
    // add window to store dock
    data.module.store.commit('core/dock/ADD_CATEGORY', {
      config: data.config,
      module: data.module
    })
  }

  private static registerLauncher(data: OwdModuleAppWindowCreateInstanceData) {
    if (data.config.launcher === true) {
      data.module.store.commit('core/launcher/ADD', {
        title: data.config.titleLauncher || data.config.title,
        icon: data.config.icon,
        category: data.config.category,
        favorite: data.config.favorite,
        callback: () => {

          // check if module is a singleton and an instance already exists
          if (data.module.isSingleton && data.module.getWindowInstancesCount(data.config.name) > 0) {
            // throw Error(`You can't open more than a window for ${windowConfig.name}, since it's a singleton`)
            // module is a singleton, you don't need to create a new window.
            // return first instance of this window group and you'll be fine
            return data.module.getFirstWindowInstance(data.config.name).open(true)
          }

          data.module.createWindow(data.config).open(true)
        }
      })
    }
  }

  loadStorage(storage: OwdModuleAppWindowStorage | undefined) {
    if (!storage) {

      this.instance.storage = JSON.parse(JSON.stringify({
        position: this.instance.config.position,
        size: this.instance.config.size,
        minimized: !!this.instance.config.minimized,
        maximized: !!this.instance.config.maximized,
        focused: false,
        workspace: this.module.store.getters['core/workspace/workspaceActive'],
        metaData: {}
      }))

    } else {

      if (typeof storage.size !== 'undefined') {
        this.instance.storage.size = storage.size
      }

      if (typeof storage.size !== 'undefined') {
        this.instance.storage.position = storage.position
      }

      if (typeof storage.minimized !== 'undefined') {
        this.instance.storage.minimized = storage.minimized
      }

      if (typeof storage.maximized !== 'undefined') {
        this.instance.storage.maximized = storage.maximized
      }

      if (typeof storage.workspace !== 'undefined') {
        this.instance.storage.workspace = storage.workspace
      }

    }

    return true
  }

  mount() {
    this.mounted = true
    this.eventsExecute('onMounted')
  }

  /**
   * Destroy window
   */
  destroy(): boolean {
    // set no more focused
    this.setFocusActive(false)

    // trigger onClose window component events
    this.close()

    // remove from dock
    this.instance.module.store.commit('core/dock/REMOVE', this)

    // remove from window focus ids
    this.module.store.commit('core/windowFocus/UNSET_WINDOW_FOCUS', this.uniqueID)

    // unregister window instance
    if (typeof this.module.windowInstances[this.windowName] !== 'undefined') {
      delete this.module.windowInstances[this.windowName][this.uniqueID]
      this.module.store.commit('core/window/UNREGISTER_WINDOW_INSTANCE', this)
    }

    // unregister store instance
    if (!this.module.isSingleton && this.instance.module.hasStoreInstance()) {
      this.instance.module.unregisterStoreInstance(this.uniqueName)
    }

    // remove uniqueID from workspace
    this.instance.module.store.dispatch('core/workspace/removeWindowFromWorkspace', {
      windowId: this.uniqueID,
      workspaceId: this.storage.workspace
    })

    // remove window from storage
    let storage: OwdModuleAppWindowsStorage = helperStorage.loadStorage('window') || {}

    if (typeof storage[this.config.name] !== 'undefined') {
      delete storage[this.config.name][this.uniqueID]
      helperStorage.saveStorage('window', storage)
    }

    return true
  }

  // soft open
  open(focus: boolean = false): boolean {
    if (!this.mounted) {
      this.onMounted((windowInstance: any) => {
        windowInstance.open(focus)
      })
    } else {
      this.instance.storage.minimized = false

      // recalculate window position
      this.adjustPosition()

      // focus window
      if (focus) {
        this.focus()
      }
    }

    return true
  }

  // soft close
  close(): boolean {
    this.instance.storage.minimized = false
    this.instance.storage.maximized = false

    return true
  }

  minimize(value: boolean = true): boolean {
    this.instance.storage.minimized = value

    return true
  }

  get isMinimized(): boolean {
    return this.instance.storage.minimized
  }

  maximize(toggle: boolean): boolean {
    if (!this.config.maximizable) {
      return false
    }

    this.instance.storage.maximized = toggle

    this.focus()

    return true
  }

  get isMaximized(): boolean {
    return this.instance.storage.maximized
  }

  save() {
    let storage: OwdModuleAppWindowsStorage = helperStorage.loadStorage('window') || {}

    if (typeof storage[this.config.name] === 'undefined') {
      storage[this.config.name] = {}
    }

    storage[this.config.name][this.uniqueID] = {
      uniqueID: this.uniqueID,
      position: this.storage.position,
      size: this.storage.size,
      minimized: this.storage.minimized,
      maximized: this.storage.maximized,
      focused: this.storage.focused,
      fullscreen: this.storage.fullscreen,
      workspace: this.storage.workspace
    }

    if (typeof this.storage.metaData !== 'undefined') {
      storage[this.config.name][this.uniqueID].metaData = this.storage.metaData
    }

    // update local storage
    helperStorage.saveStorage('window', storage)
  }

  fullscreen(toggle: boolean): boolean {
    if (!this.config.fullscreenable) {
      return false
    }

    this.instance.storage.fullscreen = toggle

    this.module.store.commit('core/windowFullscreen/SET_FULLSCREEN_MODE', toggle)

    return true
  }

  focus() {
    this.instance.module.store.commit('core/windowFocus/SET_WINDOW_FOCUS', this.uniqueID)

    // handle windowFocuses positions
    const owdWindowFocuses = this.instance.module.store.getters['core/windowFocus/windowFocusList']

    for (const otherWindowInstance of this.instance.module.store.getters['core/window/modulesAppWindowInstances']) {
      // set window z-index
      otherWindowInstance.setFocusIndex(owdWindowFocuses.indexOf(otherWindowInstance.uniqueID))

      // set focused if window has just been focused
      otherWindowInstance.setFocusActive(this.uniqueID === otherWindowInstance.uniqueID)
    }
  }

  setFocusActive(focused: boolean): void {
    this.instance.storage.focused = focused
  }

  setWorkspace(id: number): boolean {
    // remove window uniqueID from previous workspace
    this.instance.module.store.dispatch('core/workspace/removeWindowFromWorkspace', {
      windowId: this.uniqueID,
      workspaceId: this.storage.workspace
    })

    // update window workspace
    this.instance.storage.workspace = id

    // add window uniqueID to current workspace
    this.instance.module.store.dispatch('core/workspace/addWindowToWorkspace', {
      windowId: this.uniqueID,
      workspaceId: id
    })

    return true
  }

  getFocusIndex(): number {
    return this.instance.storage.position.z || 0
  }

  setFocusIndex(index: number): boolean {
    this.instance.storage.position.z = index

    return true
  }

  get hasFocus(): boolean {
    return this.instance.storage.focused
  }

  getSize(): OwdModuleAppWindowConfigSize {
    return this.instance.storage.size
  }

  setSize(size: OwdModuleAppWindowConfigSize): boolean {
    this.instance.storage.size = size

    return true
  }

  resetSize(): boolean {
    this.instance.storage.size = this.config.size

    return true
  }

  getPosition(): OwdModuleAppWindowConfigPosition {
    return this.instance.storage.position
  }

  setPosition(position: OwdModuleAppWindowConfigPosition): boolean {
    if (position.x) this.instance.storage.position.x = position.x
    if (position.y) this.instance.storage.position.y = position.y
    if (position.z) this.instance.storage.position.z = position.z

    return true
  }

  resetPosition(): boolean {
    this.instance.storage.position = this.config.position

    return true
  }

  adjustPosition(): OwdModuleAppWindowConfigPosition {
    const windowPosition = this.getPosition()
    const windowPositionAdjusted = helperWindow.calcPosition(this.instance)

    if (JSON.stringify(windowPosition) !== JSON.stringify(windowPositionAdjusted)) {
      this.setPosition(windowPositionAdjusted)
    }

    return this.instance.storage.position
  }

  setNavTitle(title: string, exclusive?: boolean) {
    if (!title) {
      this.instance.storage.title = undefined
      return true
    }

    let newTitle

    if (!exclusive) {
      newTitle = title + ' - ' + this.config.title
    } else {
      newTitle = title
    }

    this.instance.storage.title = newTitle
  }
}