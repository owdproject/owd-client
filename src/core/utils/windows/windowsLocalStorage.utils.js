const windowsLocalStorageName = 'windows-storage';

export function loadWindowsLocalStorage() {
  try {
    let storageWindows = localStorage.getItem(windowsLocalStorageName);

    storageWindows = JSON.parse(storageWindows)

    return storageWindows
  } catch (e) {
    console.error('[OWD] loadWindowsLocalStorage', e)
  }

  return null
}


export function saveWindowsLocalStorage(data) {
  localStorage.setItem(windowsLocalStorageName, data);
}