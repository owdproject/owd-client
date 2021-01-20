import md5 from 'md5'
import store from '../../store'
import {
  OwdModuleAppWindowDetail,
  OwdModuleAppWindowInstance
} from "../../../../types";

interface CallbackWindowInstance<T1, T2 = void> {
  (windowInstance: T1): T2;
}

export function generateWindowUniqueId(): string {
  return md5(Date.now().toString() + Math.random())
}

// WINDOW DETAILS

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
    for (const owdModuleAppWindowInstance of store.getters['core/modules/modulesAppWindowInstances'].groups[windowName]) {
      await cb(owdModuleAppWindowInstance)
    }
  }
}

export function isWindowNameExisting(windowName: string) {
  return typeof store.getters['core/modules/modulesAppWindowDetails'][windowName] !== 'undefined'
}

export function getWindowGroupInstances(windowName: string) {
  return store.getters['core/modules/modulesAppWindowInstances'].groups[windowName]
}

export function getWindowGroupInstancesCount(windowName: string): number {
  return store.getters['core/modules/modulesAppWindowInstances'].groups[windowName].length
}

export function isWindowGroupInstanceIndexExisting(windowName: string, index: number) {
  return typeof store.getters['core/modules/modulesAppWindowInstances'].groups[windowName][index] !== 'undefined'
}

export function getWindowGroupInstanceByIndex(windowName: string, index: number) {
  return store.getters['core/modules/modulesAppWindowInstances'].groups[windowName][index]
}

export function getWindowGroupFirstInstance(windowName: string) {
  return store.getters['core/modules/modulesAppWindowInstances'].groups[windowName][0]
}