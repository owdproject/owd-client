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
 */
export function calcPositionX(owdModuleAppWindow: OwdModuleAppWindowInstance) {
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
 */
export function calcPositionY(owdModuleAppWindow: OwdModuleAppWindowInstance) {
  const pageWindow = window

  const desktopWindowsContainer = document.querySelector('.owd-windows-container')
  const desktopWindowsContainerArea = document.querySelector('.owd-windows-container__initialize-area')

  if (desktopWindowsContainerArea && desktopWindowsContainer) {
    const desktopWindowsContainerOffset = desktopWindowsContainer.getBoundingClientRect()
    const desktopWindowsContainerAreaOffset = desktopWindowsContainerArea.getBoundingClientRect()
    
    if (desktopWindowsContainerAreaOffset.height < owdModuleAppWindow.storage.size.height) {
      return 0
    }

    if (owdModuleAppWindow.storage.position.y < 0) {
      return desktopWindowsContainerAreaOffset.height + desktopWindowsContainerAreaOffset.top - desktopWindowsContainerOffset.top - owdModuleAppWindow.storage.size.height
    }

    if (
      (pageWindow.innerHeight < owdModuleAppWindow.storage.position.y + owdModuleAppWindow.storage.size.height + desktopWindowsContainerOffset.top)
      || (owdModuleAppWindow.storage.position.y + owdModuleAppWindow.storage.size.height > desktopWindowsContainerOffset.bottom)
    ) {
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

// WINDOW INSTANCES

/**
 * Find window by attr
 *
 * @param attr
 * @param value
 */
export function findWindowInstanceByAttr(attr: string, value: string) {
  return store.getters['core/window/modulesAppWindowInstances']
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
  for (const owdModuleAppWindowInstance of store.getters['core/window/modulesAppWindowInstances']) {
    await cb(owdModuleAppWindowInstance)
  }
}

export function getWindowInstances(moduleName: string) {
  return store.getters['core/modulesApp/modulesAppKeyMap'][moduleName].windowInstances
}

export function getWindowInstance(moduleName: string, windowName: string, uniqueID: string) {
  return getWindowInstances(moduleName)[windowName][uniqueID]
}

// WINDOW GROUPS

export async function forEachInstanceInWindowGroup(
  windowName: string,
  cb: CallbackWindowInstance<OwdModuleAppWindowInstance>
) {
  if (isWindowNameExisting(windowName)) {
    for (const owdModuleAppWindowInstance of store.getters['core/window/modulesAppWindowGroups'][windowName].list) {
      await cb(owdModuleAppWindowInstance)
    }
  }
}

export function isWindowNameExisting(windowName: string): boolean {
  return typeof store.getters['core/window/modulesAppWindowGroups'][windowName] !== 'undefined'
}

export function getWindowGroupInfo(windowName: string): OwdModuleAppWindowDetail {
  return store.getters['core/window/modulesAppWindowGroups'][windowName]
}

export function getWindowInstancesInWindowGroup(windowName: string): OwdModuleAppWindowInstance[] {
  return store.getters['core/window/modulesAppWindowGroups'][windowName].list
}