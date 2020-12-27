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

/**
 * Find window by attr
 *
 * @param attr
 * @param value
 */
export function findWindowInstanceByAttr(attr: string, value: string) {
  return store.getters['core/windows/windowInstances']
    .find((owdWindow: OwdModuleWindowInstance) => {
      if (attr === 'uniqueID') {
        return owdWindow.uniqueID === value
      }
      if (attr === 'name') {
        return owdWindow.config.name === value
      }
    })
}

/**
 * For each window instance
 *
 * @param cb
 */
export async function forEachWindowInstance(cb: CallbackWindowInstance<OwdModuleWindowInstance>) {
  for (const owdWindow of store.getters['core/windows/windowInstances']) {
    await cb(owdWindow)
  }
}

// WINDOW GROUPS

export function isWindowGroupExisting(name: string) {
  return typeof store.getters['core/windows/windowGroups'][name] !== 'undefined'
}

export function getWindowGroup(name: string) {
  return  store.getters['core/windows/windowGroups'][name]
}

export function isWindowGroupWindowIndexExisting(name: string, i: number) {
  return typeof store.getters['core/windows/windowGroups'][name][i] !== 'undefined'
}

export function getWindowGroupWindowIndex(name: string, i: number) {
  return store.getters['core/windows/windowGroups'][name][i]
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
  for (const owdWindow of store.getters['core/windows/windowGroups']) {
    const window = await store.dispatch('core/windows/getWindow', {
      uniqueID: owdWindow.uniqueID
    })

    if (window) {
      await cb(window)
    }
  }
}