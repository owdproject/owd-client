import md5 from "md5";
import * as helperWindow from "@owd-client/core/src/helpers/helperWindow";
import {
  OwdModuleAppWindowInstance,
  OwdModuleAppWindowCreateInstanceData,
  OwdModuleAppWindowConfigPosition,
  OwdModuleAppWindowConfigSize,
  OwdModuleApp,
  OwdModuleAppWindowStorage, OwdModuleAppWindowConfig
} from "@owd-client/types";

export default class ModuleAppWindow implements OwdModuleAppWindowInstance {
  private instance: OwdModuleAppWindowInstance
  private mounted: boolean = false

  private events: { [eventName: string]: any[] } = {
    onMounted: []
  }
  private initialStorage: OwdModuleAppWindowStorage|undefined

  constructor(data: OwdModuleAppWindowCreateInstanceData) {
    this.initialize(data)
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

  /**
   * Generate window instance uniqueID
   */
  private static generateUniqueID(): string {
    return md5(Date.now().toString() + Math.random())
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

    if (typeof config.theme.dense === 'undefined') {
      config.theme.dense = true
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
        title: data.config.titleApp || data.config.title,
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

  /**
   * Register window
   *
   * @param data
   * @private
   */
  private initialize(data: OwdModuleAppWindowCreateInstanceData): void {
    this.instance = {
      module: data.module,
      config: {...data.config},
      storage: {...data.storage},
    }

    // deep clone object
    this.instance.storage = JSON.parse(JSON.stringify({
      position: this.instance.config.position,
      size: this.instance.config.size,
      minimized: !!this.instance.config.minimized,
      maximized: !!this.instance.config.maximized,
      focused: false,
      metaData: this.instance.storage.metaData
    }))

    this.initialStorage = data.storage

    if (data.storage && typeof data.storage.uniqueID !== 'undefined') {
      this.instance.storage.uniqueID = data.storage.uniqueID
    }

    if (typeof this.instance.storage.uniqueID === 'undefined') {
      this.instance.storage.uniqueID = ModuleAppWindow.generateUniqueID()
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
  }

  loadStorage() {
    const storage = this.initialStorage

    if (storage && typeof storage.size !== 'undefined') {
      this.instance.storage.size = storage.size
    }

    if (storage && typeof storage.size !== 'undefined') {
      this.instance.storage.position = storage.position
    }

    if (storage && typeof storage.minimized !== 'undefined') {
      this.instance.storage.minimized = storage.minimized
    }

    if (storage && typeof storage.maximized !== 'undefined') {
      this.instance.storage.maximized = storage.maximized
    }
  }

  mount() {
    this.loadStorage()

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

    return true
  }

  // soft open
  open(focus: boolean = false): boolean {
    if (!this.mounted) {
      this.onMounted((windowInstance) => {
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