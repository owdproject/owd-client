/**
 * Load module component window from module folder
 *
 * @param moduleInfo
 * @param windowName
 * @returns {*}
 */
export function loadModuleFileComponentWindow(moduleInfo, windowName) {
  try {
    return require('@/../src/modules/' + moduleInfo.name + '/windows/' + windowName + '.vue').default
  } catch(e) {
    if (this.config.debug) console.error(`[OWD] Unable to load "/modules/${moduleInfo.name}/windows/${windowName}.vue"`, e)
  }
}