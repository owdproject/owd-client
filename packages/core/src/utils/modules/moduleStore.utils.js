/**
 * Load module store from module folder
 *
 * @param moduleInfo
 * @returns {*}
 */
export function loadModuleFileStore(moduleInfo) {
  try {
    return require('@/../src/modules/' + moduleInfo.name + '/store').default
  } catch(e) {
    console.error(`[OWD] Unable to load "/modules/${moduleInfo.name}/store"`, e)
  }
}

/**
 * Load module store config from config.json
 *
 * @param moduleInfo
 * @returns {*}
 */
export function loadModuleFileStoreConfig(moduleInfo) {
  if (moduleInfo.config) {
    try {
      return require('@/../config/' + moduleInfo.name + '/config.json')
    } catch(e) {
      console.error(`[OWD] Unable to load "/modules/${moduleInfo.name}/config.json"`, e)
    }
  }

  return null
}