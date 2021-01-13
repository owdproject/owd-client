const windowsLocalStorageName = 'windows-storage'
const windowsLocalStorageFocusesName = 'windows-focuses-storage'

// windows

/**
 * Load window storage
 */
export function loadWindowsStorage() {
  try {
    const windowsStorage = localStorage.getItem(windowsLocalStorageName)

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
  localStorage.setItem(windowsLocalStorageName, data)
}

/**
 * Reset window storage
 */
export function resetWindowsStorage() {
  localStorage.removeItem(windowsLocalStorageName)
}

// window focuses

/**
 * Load window focuses storage
 */
export function loadWindowStorageFocuses(): string[] {
  try {
    const windowsStorageFocuses = localStorage.getItem(windowsLocalStorageFocusesName)

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
  localStorage.setItem(windowsLocalStorageFocusesName, JSON.stringify(list))
}

/**
 * Remove window focuses storage
 */
export function resetWindowsStorageFocuses() {
  localStorage.removeItem(windowsLocalStorageFocusesName)
}