function storageName(name: string) {
  return 'storage-' + name
}

/**
 * Load storage
 */
export function loadStorage(name: string) {
  try {
    const storage = localStorage.getItem(storageName(name))

    if (storage) {
      return JSON.parse(storage)
    }
  } catch (e) {
    console.error('[OWD] Error while loading window storage', e)
  }

  return null
}

/**
 * Save storage
 */
export function saveStorage(name: string, data: any) {
  localStorage.setItem(storageName(name), JSON.stringify(data))
}

/**
 * Reset storage
 */
export function resetStorage(name: string) {
  localStorage.removeItem(storageName(name))
}