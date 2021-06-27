let timeoutSave: { [key: string]: any } = {}

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
    console.error('[owd] error while loading window storage', e)
  }

  return null
}

/**
 * Save storage
 */
export function saveStorage(name: string, data: any) {
  const storeName = storageName(name)

  // reset previous save execution
  clearTimeout(timeoutSave[storeName])

  // set next save execution
  timeoutSave[storeName] = setTimeout(() => {

    // save to local storage
    localStorage.setItem(storeName, JSON.stringify(data))

  }, 200)
}

/**
 * Reset storage
 */
export function resetStorage(name: string) {
  localStorage.removeItem(storageName(name))
}