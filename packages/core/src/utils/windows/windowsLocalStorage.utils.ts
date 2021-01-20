const localStorageNameWindow = 'storage-window'
const localStorageNameWindowFocus = 'storage-window-focus'

// windows

/**
 * Load window storage
 */
export function loadWindowsStorage() {
  try {
    const windowsStorage = localStorage.getItem(localStorageNameWindow)

    if (windowsStorage) {
      return JSON.parse(windowsStorage)
    }
  } catch (e) {
    console.error('[OWD] Error while loading window storage', e)
  }

  return null
}

/**
 * Save window storage
 */
export function saveWindowsStorage(data: any) {
  localStorage.setItem(localStorageNameWindow, data)
}

/**
 * Reset window storage
 */
export function resetWindowsStorage() {
  localStorage.removeItem(localStorageNameWindow)
}

// window focuses

/**
 * Load window focuses storage
 */
export function loadWindowStorageFocuses(): string[] {
  try {
    const windowsStorageFocuses = localStorage.getItem(localStorageNameWindowFocus)

    if (windowsStorageFocuses) {
      return JSON.parse(windowsStorageFocuses)
    }
  } catch (e) {
    console.error(e)
  }

  return []
}

/**
 * Save window focuses storage
 */
export function saveWindowStorageFocuses(list: string[]) {
  localStorage.setItem(localStorageNameWindowFocus, JSON.stringify(list))
}

/**
 * Remove window focuses storage
 */
export function resetWindowsStorageFocuses() {
  localStorage.removeItem(localStorageNameWindowFocus)
}