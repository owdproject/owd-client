import store from '../../core/store/index'
import md5 from 'md5'

export function generateWindowUniqueId() {
  return md5(Date.now() + Math.random())
}

// WINDOW INSTANCES

export function isWindowInstancesGroupExisting(groupName) {
  return typeof store.getters['core/windows/windowInstances'][groupName] !== 'undefined'
}

export function getWindowInstancesByWindowGroup(groupName) {
  return  store.getters['core/windows/windowInstances'][groupName]
}

export function isWindowInstancesGroupWindowIndexExisting(groupName, i) {
  return typeof store.getters['core/windows/windowInstances'][groupName][i] !== 'undefined'
}

export function getWindowInstancesGroupWindowIndex(groupName, i) {
  return store.getters['core/windows/windowInstances'][groupName][i]
}

export function findWindowInstanceByAttr(groupName, attr, value) {
  const windowInstancesGroup = getWindowInstancesByWindowGroup(groupName)

  if (windowInstancesGroup) {
    return windowInstancesGroup.find(window => window[attr] === value)
  }

  return null
}

export function findWindowInstancesIndexByAttr(groupName, attr, value) {
  const windowInstances = store.getters['core/windows/windowInstances']

  for (let i = 0; i < windowInstances[groupName].length; i += 1) {
    if (windowInstances[groupName][i][attr] === value) {
      return i
    }
  }

  return -1
}

/**
 * For each window instance
 *
 * @param cb
 */
export function forEachWindowInstance(cb) {
  const windowInstances = store.getters['core/windows/windowInstances']

  for (const groupName of Object.keys(windowInstances)) {
    for (const window of windowInstances[groupName]) {
      cb(window)
    }
  }
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