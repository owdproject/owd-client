import store from '../../store'
import md5 from 'md5'

export function generateWindowUniqueId() {
  return md5(Date.now() + Math.random())
}

// WINDOW INSTANCES

export function findWindowInstanceByAttr(attr, value) {
  return store.getters['core/windows/windowInstances'].find(window => window[attr] === value)
}

export function findWindowInstanceIndex(attr, value) {
  return store.getters['core/windows/windowInstances'].findIndex(window => window[attr] === value)
}

/**
 * For each window instance
 *
 * @param cb
 */
export function forEachWindowInstance(cb) {
  const windowInstances = store.getters['core/windows/windowInstances']

  for (const windowInstance of windowInstances) {
    cb(windowInstance)
  }
}

// WINDOW GROUPS

export function isWindowGroupExisting(groupName) {
  return typeof store.getters['core/windows/windowGroups'][groupName] !== 'undefined'
}

export function getWindowGroup(groupName) {
  return  store.getters['core/windows/windowGroups'][groupName]
}

export function isWindowGroupWindowIndexExisting(groupName, i) {
  return typeof store.getters['core/windows/windowGroups'][groupName][i] !== 'undefined'
}

export function getWindowGroupWindowIndex(groupName, i) {
  return store.getters['core/windows/windowGroups'][groupName][i]
}

/**
 * For each window instance in window group
 *
 * @param groupName
 * @param cb
 */
export function forEachWindowInstanceInWindowGroup(groupName, cb) {
  store.getters['core/windows/windowGroups'][groupName].forEach(async uniqueID => {
    const window = await store.dispatch('core/windows/getWindow', {uniqueID})

    if (window) {
      cb(window)
    }
  })
}

// WINDOW CATEGORIES

/**
 * Get window category
 *
 * @param categoryName
 * @returns {*[]|*}
 */
export function getWindowCategory(categoryName) {
  if (isWindowCategoryExisting(categoryName)) {
    return store.getters['core/windows/windowCategories'][categoryName]
  }

  return []
}

/**
 * Does window category exist?
 *
 * @param categoryName
 * @returns {boolean}
 */
export function isWindowCategoryExisting(categoryName) {
  return typeof store.getters['core/windows/windowCategories'][categoryName] !== 'undefined'
}

/**
 * Does index in window category exist?
 *
 * @param categoryName
 * @param index
 * @returns {number}
 */
export function isWindowCategoryWindowIndexExisting(categoryName, index) {
  return store.getters['core/windows/windowCategories'][categoryName].indexOf(index)
}