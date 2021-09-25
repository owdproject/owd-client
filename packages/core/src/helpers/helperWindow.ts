import {useDesktop} from "@owd-client/core/index";
import {OwdModuleAppWindowInstance} from "@owd-client/types";

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
    const desktopWindowsContainerOffsetArea = desktopWindowsContainerArea.getBoundingClientRect()

    const maxPositionLeft = owdModuleAppWindow.storage.position.x + owdModuleAppWindow.storage.size.width + desktopWindowsContainerOffset.left

    let x = owdModuleAppWindow.storage ? owdModuleAppWindow.storage.position.x : desktopWindowsContainerOffset.left

    if (pageWindow.innerWidth < owdModuleAppWindow.storage.size.width) {
      return 0
    }

    if (owdModuleAppWindow.storage.position.x === 0) {
      return desktopWindowsContainerOffsetArea.left - desktopWindowsContainerOffset.left
    }

    if (owdModuleAppWindow.storage.position.x < 0 || maxPositionLeft > pageWindow.innerWidth) {
      return desktopWindowsContainerOffsetArea.width + desktopWindowsContainerOffsetArea.left - desktopWindowsContainerOffset.left - owdModuleAppWindow.storage.size.width
    }

    if (owdModuleAppWindow.storage.position.x > 0) {
      if (owdModuleAppWindow.storage.position.x > (desktopWindowsContainerOffsetArea.width - desktopWindowsContainerOffsetArea.left)) {
        return desktopWindowsContainerOffsetArea.left - desktopWindowsContainerOffset.left
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
    const desktopWindowsContainerOffsetArea = desktopWindowsContainerArea.getBoundingClientRect()
    
    if (desktopWindowsContainerOffsetArea.height < owdModuleAppWindow.storage.size.height) {
      return 0
    }

    if (owdModuleAppWindow.storage.position.y < 0) {
      return desktopWindowsContainerOffsetArea.height + desktopWindowsContainerOffsetArea.top - desktopWindowsContainerOffset.top - owdModuleAppWindow.storage.size.height
    }

    if (
      (pageWindow.innerHeight < owdModuleAppWindow.storage.position.y + owdModuleAppWindow.storage.size.height + desktopWindowsContainerOffset.top)
      || (owdModuleAppWindow.storage.position.y + owdModuleAppWindow.storage.size.height > desktopWindowsContainerOffset.bottom)
    ) {
      return desktopWindowsContainerOffsetArea.height + desktopWindowsContainerOffsetArea.top - desktopWindowsContainerOffset.top - owdModuleAppWindow.storage.size.height
    }

    if (owdModuleAppWindow.storage.position.y === 0) {
      return desktopWindowsContainerOffsetArea.top - desktopWindowsContainerOffset.top
    }

    if (owdModuleAppWindow.storage.position.y > 0) {
      if (owdModuleAppWindow.storage.position.y > (desktopWindowsContainerOffsetArea.height - desktopWindowsContainerOffsetArea.top)) {
        return desktopWindowsContainerOffsetArea.top - desktopWindowsContainerOffset.top
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
  return useDesktop().store
    .getters['core/window/modulesAppWindowInstances']
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