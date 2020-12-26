const windowsLocalStorageName = 'windows-storage'

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

export function saveWindowsStorage(data: any) {
  localStorage.setItem(windowsLocalStorageName, data)
}

export function resetWindowsStorage() {
  localStorage.removeItem(windowsLocalStorageName)
}