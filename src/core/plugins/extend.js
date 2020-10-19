import Vue from 'vue'
import modulesConfig from '../../../config/modules.json'

const modulesLoaded = {}
const windowsLoaded = {}

export default ({ store, terminal }) => {
  const merge = require('lodash.merge')

  if (modulesConfig) {
    let failed = false

    if (modulesConfig.type !== 'client') {
      console.error('[OWD] Config modules.json is not valid.')
      failed = true
    }

    if (!modulesConfig.modulesEnabled || modulesConfig.modulesEnabled.length === 0) {
      console.log("[OWD] There aren't modules to load.")
      failed = true
    }

    if (!failed) {
      // get names of the modules
      const modulesNames = Object.keys(modulesConfig.modulesEnabled)

      if (modulesNames.length > 0) {
        for (const moduleName of modulesNames) {

          // load module info
          const moduleInfo = loadModuleInfo(moduleName)

          if (!moduleInfo) {
            return console.log('Module info is not valid.')
          }

          // check dependencies
          if (!areDependenciesSatisfied(moduleInfo.dependencies)) {
            return console.log(
              `Dependencies of ${moduleInfo.name} are not satisfied.\n` +
              JSON.stringify(moduleInfo.dependencies)
            )
          }

          // load all window components
          if (Array.isArray(moduleInfo.windows)) {
            moduleInfo.windows.forEach(windowComponent => {
              if (!windowComponent.name) {
                return console.log(`[OWD] Component name is missing in ${windowComponent.name}.`)
              }

              const loadedWindow = loadModuleWindow(moduleInfo.name, windowComponent.name)

              if (loadedWindow) {
                Vue.component(windowComponent.name, loadedWindow)

                // remove windows property from module basic details
                const moduleBasicDetails = {...moduleInfo}
                delete moduleBasicDetails.windows

                // add module info to loaded modules
                modulesLoaded[moduleInfo.name] = moduleInfo
                windowsLoaded[windowComponent.name] = {
                  window: windowComponent,
                  module: moduleBasicDetails
                }
              }
            })
          }

          // load store
          if (moduleInfo.store) {
            const loadedStore = loadModuleStore(moduleInfo.name)

            if (loadedStore) {
              let storeConfig = {}

              if (moduleInfo.config) {
                const loadedConfig = loadModuleConfig(moduleInfo.name)

                if (loadedConfig) {
                  storeConfig = loadedConfig
                }
              }

              store.registerModule(moduleInfo.name, merge(
                loadedStore,
                {
                  namespaced: true,
                  state: storeConfig
                }
              ))

              // add module info to loaded modules
              modulesLoaded[moduleInfo.name] = moduleInfo
            }
          }

          // load commands
          if (moduleInfo.commands) {
            const commands = loadCommands(moduleInfo.name, { Vue, store, terminal, module: moduleInfo })

            if (commands) {
              Object.keys(commands).forEach((commandName) => {
                terminal.addCommand(commandName, commands[commandName])
              })
            }
          }

        }
      }
    }
  }

  return {
    modulesLoaded,
    windowsLoaded,
    isModuleLoaded: (module) => {
      return Object.keys(modulesLoaded).includes(module)
    },
    getWindowConfigurationFromWindowName: (windowName) => {
      if (typeof windowsLoaded[windowName] !== 'undefined') {
        return windowsLoaded[windowName].window
      }

      return null
    },
    getWindowModuleFromWindowName: (moduleName) => {
      if (typeof windowsLoaded[moduleName] !== 'undefined') {
        return windowsLoaded[moduleName].module
      }

      return null
    }
  }
}

/**
 * Check if dependencies are satisfied
 *
 * @param dependencies
 * @returns {boolean}
 */
function areDependenciesSatisfied(dependencies) {
  let dependenciesStatisfied = true

  if (dependencies && dependencies.length > 0) {
    dependencies.forEach((dependency) => {

      if (dependenciesStatisfied) {
        if (!modulesLoaded.list.includes(dependency)) {
          dependenciesStatisfied = false
        }
      }

    })
  }

  return dependenciesStatisfied
}

/**
 * Load module info
 *
 * @param moduleFolder
 * @returns {any}
 */
function loadModuleInfo(moduleFolder) {
  try {
    return require('../../../src/modules/' + moduleFolder + '/module.json')
  } catch(e) {
    console.log(`[OWD] Missing "/modules/${moduleFolder}/module.json"`)
  }
}

/**
 * Load module window
 *
 * @param moduleName
 * @param windowName
 * @returns {*}
 */
function loadModuleWindow(moduleName, windowName) {
  try {
    return require('../../../src/modules/' + moduleName + '/windows/' + windowName + '.vue').default
  } catch(e) {
    console.log(`[OWD] Missing "/modules/${moduleName}/windows/${windowName}.vue"`)
  }
}

/**
 * Load module store
 *
 * @param moduleName
 * @returns {*}
 */
function loadModuleStore(moduleName) {
  try {
    return require('../../../src/modules/' + moduleName + '/store').default
  } catch(e) {
    console.log(`[OWD] Missing "/modules/${moduleName}/store"`)
  }
}

/**
 * Load module config
 *
 * @param moduleName
 * @returns {any}
 */
function loadModuleConfig(moduleName) {
  try {
    return require('../../../config/' + moduleName + '/config.json')
  } catch(e) {
    console.log(`[OWD] Missing "/modules/${moduleName}/config.json"`)
  }
}

/**
 * Load commands from module passing terminal as instance
 *
 * @param moduleFolder
 * @param store
 * @param terminal
 * @returns {*}
 */
function loadCommands(moduleFolder, { store, terminal, module }) {
  try {
    const commands = require('../../../src/modules/' + moduleFolder + '/commands.js')

    if (commands) {
      // instance commands
      return commands.default({ store, terminal, module})
    }
  } catch(e) {
    console.log(`[OWD] Missing "/modules/${moduleFolder}/commands.js"`)
  }
}
