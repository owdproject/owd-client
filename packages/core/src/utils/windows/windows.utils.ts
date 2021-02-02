import md5 from 'md5'
import store from '../../store'
import {
  OwdModuleAppWindowDetail,
  OwdModuleAppWindowInstance
} from "../../../../types";

interface CallbackWindowInstance<T1, T2 = void> {
  (windowInstance: T1): T2;
}

/**
 * Generate window instance uniqueID
 */
export function generateWindowInstanceUniqueId(): string {
  return md5(Date.now().toString() + Math.random())
}

/**
 * Calculate x position for new opened windows
 * todo refactor
 *
 * @param data
 * @returns {Promise<void>}
 */
export function calcPositionX(data: { window: any, forceLeft?: boolean, forceRight?: boolean }) {
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
 * todo refactor
 *
 * @param data
 * @returns {Promise<unknown>}
 */
export function calcPositionY(data: { window: any, forceLeft?: boolean, forceRight?: boolean }) {
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

// WINDOW DETAILS

/**
 * Get window details (moduleInfo + window.config)
 *
 * @param windowName
 */
export function getWindowDetailsFromWindowName(windowName: string): OwdModuleAppWindowDetail | undefined {
  if (typeof store.getters['core/modules/modulesAppWindowDetails'][windowName] !== 'undefined') {
    return store.getters['core/modules/modulesAppWindowDetails'][windowName]
  }
}

// WINDOW INSTANCES

/**
 * Find window by attr
 *
 * @param attr
 * @param value
 */
export function findWindowInstanceByAttr(attr: string, value: string) {
  return store.getters['core/modules/modulesAppWindowInstances'].list
    .find((owdModuleAppWindowInstance: OwdModuleAppWindowInstance) => {
      if (attr === 'uniqueID') {
        return owdModuleAppWindowInstance.uniqueID === value
      }
      if (attr === 'uniqueName') {
        return owdModuleAppWindowInstance.uniqueName === value
      }
      if (attr === 'name') {
        return owdModuleAppWindowInstance.config.name === value
      }
    })
}

/**
 * For each window instance
 *
 * @param cb
 */
export async function forEachWindowInstance(cb: CallbackWindowInstance<OwdModuleAppWindowInstance>) {
  for (const owdModuleAppWindowInstance of store.getters['core/modules/modulesAppWindowInstances'].list) {
    await cb(owdModuleAppWindowInstance)
  }
}

export function getWindowInstances(moduleName: string) {
  return store.getters['core/modules/modulesAppKeyMap'][moduleName]
}

export function getWindowInstance(moduleName: string, windowName: string, uniqueID: string) {
  return store.getters['core/modules/modulesAppKeyMap'][moduleName].windowInstances[windowName][uniqueID]
}

// WINDOW GROUPS

/**
 * For each window instance in window group
 *
 * @param windowName
 * @param cb
 */
export async function forEachWindowGroupInstance(
  windowName: string,
  cb: CallbackWindowInstance<OwdModuleAppWindowInstance>
) {
  if (store.getters['core/modules/modulesAppWindowInstances'].groups) {
    for (const owdModuleAppWindowInstance of store.getters['core/modules/modulesAppWindowInstances'].groups[windowName].list) {
      await cb(owdModuleAppWindowInstance)
    }
  }
}

export function isWindowNameExisting(windowName: string) {
  return typeof store.getters['core/modules/modulesAppWindowDetails'][windowName] !== 'undefined'
}

export function getWindowGroupInstances(windowName: string) {
  return store.getters['core/modules/modulesAppWindowInstances'].groups[windowName].list
}

export function getWindowGroupInstancesCount(windowName: string): number {
  if (typeof store.getters['core/modules/modulesAppWindowInstances'].groups[windowName] !== 'undefined') {
    return store.getters['core/modules/modulesAppWindowInstances'].groups[windowName].list.length
  }

  return 0
}

export function isWindowGroupInstanceIndexExisting(windowName: string, index: number) {
  return typeof store.getters['core/modules/modulesAppWindowInstances'].groups[windowName].list[index] !== 'undefined'
}

export function getWindowGroupInstanceByIndex(windowName: string, index: number) {
  return store.getters['core/modules/modulesAppWindowInstances'].groups[windowName].list[index]
}

export function getWindowGroupFirstInstance(windowName: string) {
  return store.getters['core/modules/modulesAppWindowInstances'].groups[windowName].list[0]
}