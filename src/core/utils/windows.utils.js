import md5 from 'md5'

export function isWindowGroup(windowsArray) {
  return isWindowGroupNotEmpty(windowsArray)
}

export function isWindowGroupNotEmpty(windowsArray) {
  return Object.keys(windowsArray).length > 0
}

export function isWindowIndexExisting(windowGroup, uniqueID) {
  if (typeof uniqueID === 'string') {
    return windowGroup.find(window => window.uniqueID === uniqueID)
  }

  return false
}

export function findWindowWithAttr(windowGroup, attr, value) {
  for (let i = 0; i < windowGroup.length; i += 1) {
    if (windowGroup[i][attr] === value) {
      return i;
    }
  }

  return -1;
}

export function getCountArrayOfWindows(windowsArray) {
  if (isWindowGroup(windowsArray)) {
    return windowsArray.length
  }

  return 0
}

export function generateUniqueWindowId() {
  return md5(Date.now() + Math.random())
}