import md5 from 'md5'
import store from '../../store'
import {OwdModuleAppWindowInstance} from "../../../../types";

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
  return store.getters['core/window/windowInstances']
    .find((owdModuleAppWindowInstance: OwdModuleAppWindowInstance) => {
      if (attr === 'uniqueID') {
        return owdModuleAppWindowInstance.uniqueID === value
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
  for (const owdModuleAppWindowInstance of store.getters['core/window/windowInstances']) {
    await cb(owdModuleAppWindowInstance)
  }
}

// WINDOW GROUPS

export function isWindowGroupExisting(name: string) {
  return typeof store.getters['core/window/windowGroups'][name] !== 'undefined'
}

export function getWindowGroup(name: string) {
  return  store.getters['core/window/windowGroups'][name]
}

export function isWindowGroupWindowIndexExisting(name: string, i: number) {
  return typeof store.getters['core/window/windowGroups'][name][i] !== 'undefined'
}

export function getWindowGroupWindowIndex(name: string, i: number) {
  return store.getters['core/window/windowGroups'][name][i]
}

/**
 * For each window instance in window group
 *
 * @param windowGroup
 * @param cb
 */
export async function forEachWindowInstanceInWindowGroup(
  windowGroup: string,
  cb: CallbackWindowInstance<OwdModuleAppWindowInstance>
) {
  if (store.getters['core/window/windowGroups'][windowGroup]) {
    for (const owdModuleAppWindowInstance of store.getters['core/window/windowGroups'][windowGroup]) {
      await cb(owdModuleAppWindowInstance)
    }
  }
}