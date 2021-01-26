/**
 * Load commands.js from module folder
 *
 * @param moduleInfo
 * @returns {*}
 */
export function loadModuleFileCommands(moduleInfo) {
  try {
    return require('@/../src/modules/' + moduleInfo.name + '/commands').default
  } catch(e) {
    console.error(`[OWD] Unable to load "/modules/${moduleInfo.name}/store"`, e)
  }
}