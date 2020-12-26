import md5 from 'md5'
import store from '../../store'
import {OwdModuleWindowInstance} from "../../../../types";

interface CallbackWindowInstance<T1, T2 = void> {
  (windowInstance: T1): T2;
}

export function generateWindowUniqueId(): string {
  return md5(Date.now().toString() + Math.random())
}

// WINDOW INSTANCES

export function findWindowInstanceByAttr(attr: string, value: string) {
  return store.getters['core/windows/windowsInstances']
    .find((windowInstance: OwdModuleWindowInstance) => {
      if (attr === 'uniqueID') {
        return windowInstance.uniqueID === value
      }
      if (attr === 'name') {
        return windowInstance.config.name === value
      }
    })
}

export function findWindowInstanceIndex(attr: string, value: string) {
  return store.getters['core/windows/windowsInstances']
    .findIndex((windowInstance: OwdModuleWindowInstance) => {
      if (attr === 'uniqueID') {
        return windowInstance.uniqueID === value
      }
      if (attr === 'name') {
        return windowInstance.config.name === value
      }
    })
}

/**
 * For each window instance
 *
 * @param cb
 */
export async function forEachWindowInstance(cb: CallbackWindowInstance<OwdModuleWindowInstance>) {
  const windowsInstances = store.getters['core/windows/windowsInstances']

  for (const windowInstance of windowsInstances) {
    await cb(windowInstance)
  }
}

// WINDOW GROUPS

export function isWindowGroupExisting(windowName: string) {
  return typeof store.getters['core/windows/windowGroups'][windowName] !== 'undefined'
}

export function getWindowGroup(windowName: string) {
  return  store.getters['core/windows/windowGroups'][windowName]
}

export function isWindowGroupWindowIndexExisting(windowName: string, i: number) {
  return typeof store.getters['core/windows/windowGroups'][windowName][i] !== 'undefined'
}

export function getWindowGroupWindowIndex(windowName: string, i: number) {
  return store.getters['core/windows/windowGroups'][windowName][i]
}

/**
 * For each window instance in window group
 *
 * @param windowName
 * @param cb
 */
export async function forEachWindowInstanceInWindowGroup(
  windowName: string,
  cb: CallbackWindowInstance<OwdModuleWindowInstance>
) {
  for (const windowInstance of store.getters['core/windows/windowGroups']) {
    const window = await store.dispatch('core/windows/getWindow', {
      uniqueID: windowInstance.uniqueID
    })

    if (window) {
      await cb(window)
    }
  }
}