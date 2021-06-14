import md5 from "md5";

import {
  OwdModuleAppWindowInstance,
  OwdModuleAppWindowCreateInstanceData,
  OwdModuleAppWindowConfigPosition,
  OwdModuleAppWindowConfigSize,
  OwdModuleApp,
  OwdModuleAppWindowStorage, OwdModuleAppWindowConfig
} from "@owd-client/types";
import * as helperWindow from "../../helpers/helperWindow";

export default class ModuleAppWindow implements OwdModuleAppWindowInstance {
  private readonly instance: OwdModuleAppWindowInstance

  constructor(data: OwdModuleAppWindowCreateInstanceData) {
    this.instance = this.createWindowInstance(data)
  }

  /**
   * Generate window instance uniqueID
   */
  private static generateWindowInstanceUniqueId(): string {
    return md5(Date.now().toString() + Math.random())
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
    return this.instance.module.moduleInfo.name
  }

  get uniqueID(): string {
    return this.instance.uniqueID
  }

  get uniqueName(): string {
    return this.instance.uniqueName
  }

  /**
   * Create window instance
   *
   * @param data
   */
  createWindowInstance(data: OwdModuleAppWindowCreateInstanceData): OwdModuleAppWindowInstance {
    let instance: any = {...data}

    if (!data.config.theme) {
      data.config.theme = {}
    }

    if (typeof data.config.theme.dense === 'undefined') {
      data.config.theme.dense = true
    }

    const moduleName = instance.module.moduleInfo.name

    // assign unique instance id
    if (!instance.uniqueID) {
      instance.uniqueID = ModuleAppWindow.generateWindowInstanceUniqueId()
    }

    // assign unique instance name
    instance.uniqueName = `${moduleName}-${instance.uniqueID}`

    // set default storage using owdModuleAppWindow.config
    instance.storage = {
      position: data.config.position,
      size: data.config.size,
      minimized: !!data.config.minimized,
      maximized: !!data.config.maximized,
      opened: false,
      focused: false

      // todo add metadata + methods
    }

    // overwrite storage with previous status (from local storage)
    if (data.storage) {
      if (typeof data.storage.position !== 'undefined') {
        instance.storage.position = data.storage.position
      }

      if (typeof data.storage.size !== 'undefined') {
        instance.storage.size = data.storage.size
      }

      if (typeof data.storage.opened !== 'undefined') {
        instance.storage.opened = !!data.storage.opened
      }

      if (typeof data.storage.minimized !== 'undefined') {
        instance.storage.minimized = !!data.storage.minimized
      }

      if (typeof data.storage.maximized !== 'undefined') {
        instance.storage.maximized = !!data.storage.maximized
      }
    }

    // initialize storeInstance if module isn't a singleton
    if (instance.module.isSingleton === false) {
      instance.module.registerModuleStoreInstance(instance.uniqueName)
    }

    return instance
  }

  // soft open
  open(): boolean {
    this.instance.storage.opened = true
    this.instance.storage.minimized = false

    return true
  }

  // soft close
  close(): boolean {
    this.instance.storage.opened = false
    this.instance.storage.maximized = false

    return true
  }

  destroy(): boolean {
    if (!this.instance.module.moduleInfo.singleton) {
      if (this.instance.module.hasModuleStoreInstance()) {
        this.instance.module.unregisterModuleStoreInstance(this.instance.uniqueName)
      }
    }

    return true
  }

  minimize(value: boolean = true): boolean {
    this.instance.storage.minimized = value

    return true
  }

  minimizeToggle(): boolean {
    this.instance.storage.minimized = !this.instance.storage.minimized

    return true
  }

  get isMinimized(): boolean {
    return this.instance.storage.minimized
  }

  maximize(toggle: boolean): boolean {
    if (!this.instance.config.maximizable) {
      return false
    }

    this.instance.storage.maximized = toggle

    return true
  }

  get isMaximized(): boolean {
    return this.instance.storage.maximized
  }

  fullscreen(toggle: boolean): boolean {
    if (!this.instance.config.fullscreenable) {
      return false
    }

    this.instance.storage.fullscreen = toggle

    return true
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
    this.instance.storage.size = this.instance.config.size

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
    this.instance.storage.position = this.instance.config.position

    return true
  }

  /**
   * Validate and adjust window position
   */
  adjustPosition(): OwdModuleAppWindowConfigPosition {
    this.instance.storage.position = helperWindow.calcPosition(this.instance)

    return this.instance.storage.position
  }

  setNavTitle(title: string, exclusive?: boolean) {
    if (!title) {
      this.instance.storage.title = undefined
      return true
    }

    let newTitle

    if (!exclusive) {
      newTitle = title + ' - ' + this.instance.config.title
    } else {
      newTitle = title
    }

    this.instance.storage.title = newTitle
  }
}