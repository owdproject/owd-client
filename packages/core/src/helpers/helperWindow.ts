import store from '../store'
import {
  OwdModuleAppWindowDetail,
  OwdModuleAppWindowInstance
} from "@owd-client/types";

interface CallbackWindowInstance<T1, T2 = void> {
  (windowInstance: T1): T2;
}

/**
 * Calculate window position
 * @param owdModuleAppWindow
 */
export function calcPosition(owdModuleAppWindow: OwdModuleAppWindowInstance) {
  return {
    x: calcPositionX(owdModuleAppWindow),
    y: calcPositionY(owdModuleAppWindow),
    z: owdModuleAppWindow.storage.position.z
  }
}

/**
 * Calculate x position for new opened windows
 *
 * @returns {Promise<void>}
 */
export function calcPositionX(owdModuleAppWindow: any) {
  const pageWindow = window

  const desktopWindowsContainer = document.querySelector('.owd-windows-container')
  const desktopWindowsContainerArea = document.querySelector('.owd-windows-container__initialize-area')

  if (desktopWindowsContainerArea && desktopWindowsContainer) {
    const desktopWindowsContainerOffset = desktopWindowsContainer.getBoundingClientRect()
    const desktopWindowsContainerAreaOffset = desktopWindowsContainerArea.getBoundingClientRect()

    const maxPositionLeft = owdModuleAppWindow.storage.position.x + owdModuleAppWindow.storage.size.width + desktopWindowsContainerOffset.left

    let x = owdModuleAppWindow.storage ? owdModuleAppWindow.storage.position.x : desktopWindowsContainerOffset.left

    if (pageWindow.innerWidth < owdModuleAppWindow.storage.size.width) {
      return 0
    }

    if (owdModuleAppWindow.storage.position.x === 0) {
      return desktopWindowsContainerAreaOffset.left - desktopWindowsContainerOffset.left
    }

    if (owdModuleAppWindow.storage.position.x < 0 || maxPositionLeft > pageWindow.innerWidth) {
      return desktopWindowsContainerAreaOffset.width + desktopWindowsContainerAreaOffset.left - desktopWindowsContainerOffset.left - owdModuleAppWindow.storage.size.width
    }

    if (owdModuleAppWindow.storage.position.x > 0) {
      if (owdModuleAppWindow.storage.position.x > (desktopWindowsContainerAreaOffset.width - desktopWindowsContainerAreaOffset.left)) {
        return desktopWindowsContainerAreaOffset.left - desktopWindowsContainerOffset.left
      }

      return owdModuleAppWindow.storage.position.x
    }

    return x
  }

  return 0
}

/**
 * Calculate y position for new opened windows
 *
 * @param owdModuleAppWindow
 * @returns {Promise<unknown>}
 */
export function calcPositionY(owdModuleAppWindow: any) {
  const pageWindow = window

  const desktopWindowsContainer = document.querySelector('.owd-windows-container')
  const desktopWindowsContainerArea = document.querySelector('.owd-windows-container__initialize-area')

  if (desktopWindowsContainerArea && desktopWindowsContainer) {
    const desktopWindowsContainerOffset = desktopWindowsContainer.getBoundingClientRect()
    const desktopWindowsContainerAreaOffset = desktopWindowsContainerArea.getBoundingClientRect()

    // is window in memory?
    if (!owdModuleAppWindow || !owdModuleAppWindow.storage) return console.log('[OWD] Window not found')

    if (desktopWindowsContainerAreaOffset.height < owdModuleAppWindow.storage.size.height) {
      return 0
    }

    if (owdModuleAppWindow.storage.position.y < 0) {
      return desktopWindowsContainerAreaOffset.height + desktopWindowsContainerAreaOffset.top - desktopWindowsContainerOffset.top - owdModuleAppWindow.storage.size.height
    }

    if (pageWindow.innerHeight < owdModuleAppWindow.storage.position.y + owdModuleAppWindow.storage.size.height + desktopWindowsContainerOffset.top) {
      return desktopWindowsContainerAreaOffset.height + desktopWindowsContainerAreaOffset.top - desktopWindowsContainerOffset.top - owdModuleAppWindow.storage.size.height
    }

    if (owdModuleAppWindow.storage.position.y === 0) {
      return desktopWindowsContainerAreaOffset.top - desktopWindowsContainerOffset.top
    }

    if (owdModuleAppWindow.storage.position.y > 0) {
      if (owdModuleAppWindow.storage.position.y > (desktopWindowsContainerAreaOffset.height - desktopWindowsContainerAreaOffset.top)) {
        return desktopWindowsContainerAreaOffset.top - desktopWindowsContainerOffset.top
      }

      return owdModuleAppWindow.storage.position.y
    }
  }

  return 0
}

// WINDOW DETAILS

/**
 * Get window details (moduleInfo + window.config)
 *
 * @param windowName
 */
export function getWindowDetailsFromWindowName(windowName: string): OwdModuleAppWindowDetail {
  return store.getters['core/window/modulesAppWindowInstancesGroup'][windowName]
}

// WINDOW INSTANCES

/**
 * Find window by attr
 *
 * @param attr
 * @param value
 */
export function findWindowInstanceByAttr(attr: string, value: string) {
  return store.getters['core/window/modulesAppWindowInstancesList']
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
  for (const owdModuleAppWindowInstance of store.getters['core/window/modulesAppWindowInstancesList']) {
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
  if (store.getters['core/window/modulesAppWindowInstancesGroup']) {
    for (const owdModuleAppWindowInstance of store.getters['core/window/modulesAppWindowInstancesGroup'][windowName].list) {
      await cb(owdModuleAppWindowInstance)
    }
  }
}

export function isWindowNameExisting(windowName: string) {
  return typeof store.getters['core/window/modulesAppWindowInstancesGroup'][windowName] !== 'undefined'
}

export function getWindowGroupInstances(windowName: string) {
  return store.getters['core/window/modulesAppWindowInstancesGroup'][windowName].list
}

export function getWindowGroupInstancesCount(windowName: string): number {
  if (typeof store.getters['core/window/modulesAppWindowInstancesGroup'][windowName] !== 'undefined') {
    return store.getters['core/window/modulesAppWindowInstancesGroup'][windowName].list.length
  }

  return 0
}

export function isWindowGroupInstanceIndexExisting(windowName: string, index: number) {
  return typeof store.getters['core/window/modulesAppWindowInstancesGroup'][windowName].list[index] !== 'undefined'
}

export function getWindowGroupInstanceByIndex(windowName: string, index: number) {
  return store.getters['core/window/modulesAppWindowInstancesGroup'][windowName].list[index]
}

export function getWindowGroupFirstInstance(windowName: string) {
  return store.getters['core/window/modulesAppWindowInstancesGroup'][windowName].list[0]
}