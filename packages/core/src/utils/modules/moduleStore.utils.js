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