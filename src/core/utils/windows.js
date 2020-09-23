export function isArrayOfWindows(windowsArray) {
  return Array.isArray(windowsArray)
}

export function isArrayOfWindowsNotEmpty(windowsArray) {
  return isArrayOfWindows(windowsArray) && windowsArray.length > 0
}

export function isWindowIndexExisting(windowsArray, index) {
  if (typeof index === 'number') {
    return typeof windowsArray[index] !== 'undefined'
  }

  return false
}

export function getCountArrayOfWindows(windowsArray) {
  if (isArrayOfWindows(windowsArray)) {
    return windowsArray.length
  }

  return 0
}