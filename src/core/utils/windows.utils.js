import store from '../../core/store/index'
import md5 from 'md5'

export function isWindowGroupExisting(windowName) {
  const windowInstances = store.getters['core/windows/windowInstances']

  return typeof windowInstances[windowName] !== 'undefined'
}

export function isWindowGroupNotEmpty(windowName) {
  const windowInstances = store.getters['core/windows/windowInstances']

  if (Object.keys(windowInstances).includes(windowName)) {
    return windowInstances[windowName].length > 0
  }

  return false
}

export function isWindowUniqueIdExisting(windowGroup, uniqueID) {
  if (typeof uniqueID === 'string') {
    return windowGroup.find(window => window.uniqueID === uniqueID)
  }

  return false
}

export function isWindowIndexExisting(windowGroup, index) {
  return typeof windowGroup[index] !== 'undefined'
}

export function findWindowWithAttr(windowGroup, attr, value) {
  for (let i = 0; i < windowGroup.length; i += 1) {
    if (windowGroup[i][attr] === value) {
      return i
    }
  }

  return -1
}

export function getCountArrayOfWindows(windowGroup) {
  if (isWindowGroupNotEmpty(windowGroup)) {
    return windowGroup.length
  }

  return 0
}

export function generateUniqueWindowId() {
  return md5(Date.now() + Math.random())
}