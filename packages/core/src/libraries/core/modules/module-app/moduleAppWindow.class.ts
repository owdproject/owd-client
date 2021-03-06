import md5 from "md5";
import * as helperStorage from "@owd-client/core/src/helpers/helperStorage";
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
  private readonly instance: OwdModuleAppWindowInstance

  constructor(data: OwdModuleAppWindowCreateInstanceData) {
    this.instance = this.register(data)
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

  get windowName(): string {
    return this.config.name
  }

  get moduleName(): string {
    return this.module.moduleInfo.name
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

  private register(data: OwdModuleAppWindowCreateInstanceData): OwdModuleAppWindowInstance {
    let instance: any = {
      module: data.module,
      config: {...data.config},
      storage: {...data.storage},
    }

    if (instance.module.isSingleton && instance.module.windowGroupInstancesCount(instance.config.name) > 0) {
      // module is a singleton, you don't need to create a new window.
      // return first instance of this window group and you'll be fine
      return instance.module.windowGroupInstancesFirstInstance(instance.config.name)
    }

    if (!instance.config.theme) {
      instance.config.theme = {}
    }

    if (typeof instance.config.menu === 'undefined') {
      instance.config.menu = true
    }

    if (typeof instance.config.menuApp === 'undefined') {
      instance.config.menuApp = true
    }

    if (typeof instance.config.theme.dense === 'undefined') {
      instance.config.theme.dense = true
    }

    // deep clone object
    instance.storage = JSON.parse(JSON.stringify({
      position: instance.config.position,
      size: instance.config.size,
      minimized: !!instance.config.minimized,
      maximized: !!instance.config.maximized,
      opened: false,
      focused: false,
      metaData: instance.storage.metaData
    }))

    if (data.storage && typeof data.storage.uniqueID !== 'undefined') {
      instance.storage.uniqueID = data.storage.uniqueID
    }

    if (data.storage && typeof data.storage.size !== 'undefined') {
      instance.storage.size = data.storage.size
    }

    if (data.storage && typeof data.storage.size !== 'undefined') {
      instance.storage.position = data.storage.position
    }

    if (data.storage && typeof data.storage.opened !== 'undefined') {
      instance.storage.opened = data.storage.opened
    }

    if (data.storage && typeof data.storage.minimized !== 'undefined') {
      instance.storage.minimized = data.storage.minimized
    }

    if (data.storage && typeof data.storage.maximized !== 'undefined') {
      instance.storage.maximized = data.storage.maximized
    }

    if (typeof instance.storage.uniqueID === 'undefined') {
      instance.storage.uniqueID = ModuleAppWindow.generateUniqueID()
    }

    // initialize Vue store for this window instance
    if (!instance.module.isSingleton) {
      instance.module.registerModuleStoreInstance(instance.config.name+'-'+instance.storage.uniqueID)
    }

    // add windowName (WindowSample) to module window instances
    if (typeof instance.module.windowInstances[instance.config.name] === 'undefined') {
      instance.module.windowInstances[instance.config.name] = {}

      // register vue component
      instance.module.app.component(instance.config.name, instance.config.component)

      // component is no more needed once registered
      delete instance.config.component

      // populate window config definition under moduleInfo.windows, if missing
      if (instance.module.moduleInfo.windows && !instance.module.moduleInfo.windows.find((window: OwdModuleAppWindowConfig) => window.name === data.config.name)) {
        instance.module.moduleInfo.windows.push(instance.config)
      }
    }

    return instance
  }

  create(): boolean {
    if (this.module.isSingleton && this.module.windowGroupInstancesCount(this.config.name) > 0) {
      return false
    }

    // register instance
    this.module.windowInstances[this.config.name][this.storage.uniqueID] = this
    this.module.store.commit('core/window/REGISTER_WINDOW_INSTANCE', this)

    // add to dock
    this.module.store.commit('core/windowDock/ADD', this)

    return true
  }

  get isCreated() {
    return typeof this.module.windowInstances[this.config.name][this.storage.uniqueID] !== 'undefined'
  }

  restore(): boolean {
    const storage = helperStorage.loadStorage('window') || []

    if (storage) {
      if (Object.prototype.hasOwnProperty.call(storage, this.config.name)) {
        for (const uniqueID in storage[this.config.name]) {

          if (Object.prototype.hasOwnProperty.call(storage[this.config.name], uniqueID)) {
            const windowStorage = storage[this.config.name][uniqueID]
            const windowInstance = this.module.addWindow(this.config, windowStorage)

            windowInstance.create()

            if (windowInstance && windowStorage.opened) {
              windowInstance.open()
            }
          }

        }

        return true
      }
    }

    return false
  }

  destroy(): boolean {
    // set no more focused
    this.setFocusActive(false)

    // trigger onClose window component events
    this.close()

    // remove from dock
    this.instance.module.store.commit('core/windowDock/REMOVE', this)

    // remove from window focus ids
    this.module.store.commit('core/windowFocus/UNSET_WINDOW_FOCUS', this.uniqueID)

    // unregister window instance
    if (typeof this.module.windowInstances[this.windowName] !== 'undefined') {
      delete this.module.windowInstances[this.windowName][this.uniqueID]
      this.module.store.commit('core/window/UNREGISTER_WINDOW_INSTANCE', this)
    }

    // unregister store instance
    if (!this.module.isSingleton && this.instance.module.hasModuleStoreInstance()) {
      this.instance.module.unregisterModuleStoreInstance(this.uniqueName)
    }

    return true
  }

  // soft open
  open(focus: boolean = false): boolean {
    this.instance.storage.opened = true
    this.instance.storage.minimized = false

    // recalculate window position
    this.adjustPosition()

    // focus window
    if (focus) {
      this.focus()
    }

    return true
  }

  // soft close
  close(): boolean {
    this.instance.storage.opened = false
    this.instance.storage.maximized = false

    return true
  }

  minimize(value: boolean = true): boolean {
    this.instance.storage.minimized = value
    this.instance.storage.opened = !value

    return true
  }

  minimizeToggle(): boolean {
    this.minimize(!this.instance.storage.minimized)

    if (this.instance.storage.minimized === false) {
      this.focus()
    }

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

    this.module.store.commit('core/windowFocus/SET_FULLSCREEN_MODE', toggle)

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