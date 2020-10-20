import Vue from 'vue'
import * as windowsUtils from '~/core/utils/windows.utils'
import * as windowsInitialLocalStorageUtils from '~/core/utils/windows/windowsLocalStorage.utils'
import {storeInstanceCreate,storeInstanceDestroy} from '@/core/utils/store/storeInstance.utils'

// load windows storage from local storage
const windowsInitialLocalStorage = windowsInitialLocalStorageUtils.loadWindowsLocalStorage()

export default {
  namespaced: true,

  state: {
    desktopInnerWidth: window.innerWidth,
    desktopInnerHeight: window.innerHeight,

    windowInstances: [],

    // window groups
    windowGroups: {},

    // window categories
    windowCategories: {},

    // window z-indexes
    windowFocuses: [],
    windowFocused: null
  },

  getters: {
    windowInstances(state) {
      return state.windowInstances
    },
    windowInstancesOpened(state) {
      return state.windowInstances.filter(windowInstance => windowInstance.storage.closed === false)
    },
    windowGroups(state) {
      return state.windowGroups
    },
    windowCategories(state) {
      return state.windowCategories
    },
    windowFocuses(state) {
      return state.windowFocuses
    },
    windowFocused(state) {
      if (state.windowFocuses.length > 0) {
        return state.windowFocuses[state.windowFocuses.length - 1]
      }

      return null
    }
  },

  mutations: {
    SET_DESKTOP_WIDTH(state, width) {
      state.desktopInnerWidth = width
    },
    SET_DESKTOP_HEIGHT(state, height) {
      state.desktopInnerHeight = height
    },
    REGISTER_WINDOW(state, data) {
      // add to window groups
      if (!windowsUtils.isWindowGroupExisting(data.name)) {
        state.windowGroups[data.name] = []
      }
      if (!state.windowGroups[data.name].includes(data.uniqueID)) {
        state.windowGroups[data.name].push(data.uniqueID)
      }

      // add to window categories
      if (!windowsUtils.isWindowCategoryExisting(data.category)) {
        state.windowCategories[data.category] = []
      }
      if (!state.windowCategories[data.category].includes(data.uniqueID)) {
        state.windowCategories[data.category].push(data.uniqueID)
      }

      // add to window instances
      state.windowInstances.push(data)
    },
    UNREGISTER_WINDOW(state, data) {
      // remove from groups
      if (windowsUtils.isWindowGroupExisting(data.name)) {
        const indexGroup = state.windowGroups[data.name].indexOf(data.uniqueID)

        if (indexGroup > -1) {
          state.windowGroups[data.name].splice(indexGroup, 1)
        }
      }

      // remove from categories
      if (windowsUtils.isWindowCategoryExisting(data.category)) {
        const indexCategory = state.windowCategories[data.category].indexOf(data.uniqueID)

        if (indexCategory > -1) {
          state.windowCategories[data.category].splice(indexCategory, 1)
        }
      }

      // remove from window instances
      const index = windowsUtils.findWindowInstanceIndex('uniqueID', data.uniqueID)

      if (index > -1) {
        state.windowInstances.splice(index, 1)
      }
    },
    SET_WINDOW() {
      // I kept this mutation just for vuex logging cuz
      // window object properties are changed directly
    },
    SET_WINDOW_INSTANCES(state, windowInstances) {
      state.windowInstances = windowInstances
    },
    SET_WINDOW_FOCUSES(state, windowFocuses) {
      state.windowFocuses = windowFocuses
    }
  },

  actions: {
    /**
     * Initialize all windows instances and load positions from local storage
     *
     * @param state
     * @param dispatch
     */
    async initialize({getters,commit,dispatch}) {
      // get loaded modules in OWD Client
      const modulesLoaded = Vue.prototype.$modules.modulesLoaded

      const windowInstancesRegistrationPool = []
      const windowFocuses = []

      // build windows object starting from modules
      if (modulesLoaded) {

        // for each module
        for (const moduleName of Object.keys(modulesLoaded)) {
          const module = modulesLoaded[moduleName]
          const moduleWithoutWindows = {...module}; delete moduleWithoutWindows.windows

          // does module contain any windows?
          if (Array.isArray(module.windows) && module.windows.length > 0) {

            // for each window in module
            for (const moduleWindowComponent of module.windows) {
              // is component effectively a window?
              if (moduleWindowComponent.window) {

                // for example WindowSample
                const windowName = moduleWindowComponent.name

                console.log('[OWD] Module component name: ' + windowName)

                const storageWindows = await dispatch('getInitialWindowsStorageByWindowName', windowName)

                const windowData = {
                  name: windowName,
                  config: moduleWindowComponent,
                  module: moduleWithoutWindows
                }

                // has windowsStorage filtered by windowName (from local storage) some windows for us?
                if (Array.isArray(storageWindows) && storageWindows.length > 0) {

                  // for each window storage
                  for (const windowStorage of storageWindows) {

                    windowInstancesRegistrationPool.push({
                      ...windowData,
                      storage: windowStorage
                    })

                  }

                } else {

                  // there is no window stored in local storage so generate
                  // at least one instance if .autostart is set to true
                  if (module.autostart) {
                    windowInstancesRegistrationPool.push(windowData)
                  }

                }

              }
            }

          }
        }

      }

      if (windowInstancesRegistrationPool.length > 0) {
        for (const windowData of windowInstancesRegistrationPool) {
          const windowInstance = await dispatch('windowCreateInstance', windowData)

          // add unique id to windowFocuses list
          if (windowInstance) {
            windowFocuses.push(windowInstance.uniqueID)
          }
        }
      }

      // check windows position on load
      dispatch('windowsHandlePageResize')

      if (JSON.stringify(windowFocuses) !== JSON.stringify(getters['windowFocuses'])) {
        commit('SET_WINDOW_FOCUSES', windowFocuses)
      }
    },

    /**
     * Returns windows history from local storage
     * (or return selective windows history filtered by windowName)
     *
     * @returns {boolean|any}
     */
    async getInitialWindowsStorageByWindowName(context, windowName) {
      if (
        windowsInitialLocalStorage &&
        windowsInitialLocalStorage.windowInstances &&
        typeof windowsInitialLocalStorage.windowInstances[windowName] !== 'undefined'
      ) {
        return windowsInitialLocalStorage.windowInstances[windowName]
      }

      return null
    },

    /**
     * Save windows positions in local storage
     *
     * @param state
     */
    saveWindowsStorage({state}) {
      const data = {}

      windowsUtils.forEachWindowInstance(windowInstance => {
        if (typeof data[windowInstance.name] === 'undefined') {
          data[windowInstance.name] = []
        }

        data[windowInstance.name].push({
          x: Number(windowInstance.storage.x),
          y: Number(windowInstance.storage.y),
          z: Number(windowInstance.storage.z),
          width: Number(windowInstance.storage.width),
          height: Number(windowInstance.storage.height),
          closed: !!windowInstance.storage.closed,
          minimized: !!windowInstance.storage.minimized,
          maximized: !!windowInstance.storage.maximized
        })
      })

      // update local storage
      windowsInitialLocalStorageUtils.saveWindowsLocalStorage(JSON.stringify({
        windowInstances: data,
        windowFocuses: state.windowFocuses
      }))
    },

    /**
     * Reset entire windows storage
     *
     * @param commit
     */
    resetWindowsStorage({commit}) {
      commit('SET_WINDOW_INSTANCES', [])
      windowsInitialLocalStorageUtils.resetWindowsLocalStorage()
    },

    /**
     * Get window by name or by name + id
     *
     * @param context
     * @param data
     * @returns {null|*}
     */
    getWindow(context, data) {
      let groupName
      let uniqueID

      switch (typeof data) {
        case 'string':
          groupName = data
          break
        case 'object':
          if (data.uniqueID) {
            uniqueID = data.uniqueID
          } else {
            groupName = data.name
          }
          break
      }

      let windowInstance

      if (uniqueID) {
        windowInstance = windowsUtils.findWindowInstanceByAttr('uniqueID', uniqueID)
      } else {
        windowInstance = windowsUtils.findWindowInstanceByAttr('name', groupName)
      }

      if (windowInstance) return windowInstance

      return null
    },

    /**
     * Initialize window
     *
     * @param commit
     * @param dispatch
     * @param data
     */
    async windowCreateInstance({commit}, data) {
      // check if window is given or...
      // get a copy of the module window configuration
      const windowInstance = {...data.config}

      // assign unique id
      windowInstance.uniqueID = windowsUtils.generateWindowUniqueId()

      // .config contains rules and features enabled in the module.json "window" attr
      windowInstance.config = data.config.window

      // add informations about this module
      windowInstance.module = data.module

      // .window data has been assigned to .config so is no more needed in .window
      delete windowInstance.window

      // add storage (clone from windowInstance.config)
      windowInstance.storage = {...windowInstance.config}

      // overwrite .storage with history (local storage)
      if (data.storage) {

        // parse window positions and more
        windowInstance.storage = {
          x: Number(data.storage.x),
          y: Number(data.storage.y),
          z: Number(data.storage.z),
          width: Number(data.storage.width),
          height: Number(data.storage.height),
          closed: !!data.storage.closed,
          minimized: !!data.storage.minimized,
          maximized: !!data.storage.maximized
        }

        // show item in menu
        if (windowInstance.config.menu === false) {
          windowInstance.storage.menu = !!data.storage.menu
        }

        // window is already opened, show item in menu
        if (!data.storage.closed) {
          windowInstance.storage.menu = true
        }
      }

      // initialize storeInstance if module isn't a singleton
      if (!windowInstance.module.singleton) {
        let storeDefaultsGenerator = null

        try {
          storeDefaultsGenerator = require(`../../modules/${windowInstance.module.name}/storeInstance`)
        } catch(e) {
          console.log(`[OWD] Missing "/modules/${windowInstance.module.name}/storeInstance"`)
        }

        if (storeDefaultsGenerator) {
          const storeName = `${windowInstance.module.name}-${windowInstance.uniqueID}`
          const storeDefaults = storeDefaultsGenerator.default()

          // create dynamic store module with storeName as path
          storeInstanceCreate(storeName, storeDefaults)
        }
      }

      if (!windowInstance) {
        return console.log('[OWD] Unable to create new window')
      }

      await commit('REGISTER_WINDOW', windowInstance)

      return windowInstance
    },

    /**
     * Create new window
     *
     * @param commit
     * @param dispatch
     * @param data
     */
    async windowCreate({commit, dispatch}, data) {
      // it accepts strings and objects. when it's a string, converts to object
      if (typeof data === 'string') {
        data = {
          name: data,
          window: null
        }
      }

      const module = Vue.prototype.$modules.getWindowModuleFromWindowName(data.name)

      if (!module) {
        return console.log('[OWD] This module window doesn\'t exists')
      }

      // check if there is already one window created in this window group
      if (windowsUtils.isWindowGroupExisting(data.name)) {
        if (module.singleton && windowsUtils.isWindowGroupWindowIndexExisting(data.name, 0)) {
          const window = windowsUtils.getWindowGroupWindowIndex(data.name, 0)

          // just open it instead of creating a new one
          if (module.singleton || window.storage.closed) {
            return dispatch('windowOpen', window)
          }
        }
      }

      // check if window is given or...
      if (!data.window) {
        const config = Vue.prototype.$modules.getWindowConfigurationFromWindowName(data.name)

        data.window = await dispatch('windowCreateInstance', {
          name: data.name,
          config,
          module
        })
      }

      if (!data.window) {
        return console.log('[OWD] Unable to create new window')
      }

      data.window.storage.closed = false
      data.window.storage.minimized = false
      if (typeof data.window.config.menu === 'boolean') {
        data.window.storage.menu = true
      }

      // calculate pos x and y
      data.window.storage.x = await dispatch('windowCalcPosX', {window: data.window})
      data.window.storage.y = await dispatch('windowCalcPosY', {window: data.window})

      // update
      commit('SET_WINDOW', data.window)

      // focus on window
      dispatch('windowFocus', data.window)

      return data.window
    },

    /**
     * Open window
     *
     * @param state
     * @param commit
     * @param dispatch
     * @param data
     */
    async windowOpen({commit, dispatch}, data) {
      const window = await dispatch('getWindow', data)

      if (!window || !window.storage) {
        // window instance doesnt exist, create a new one
        return dispatch('windowCreate', data)
      }

      window.storage.closed = false
      window.storage.minimized = false
      window.storage.menu = true

      // recalculate pos x and y
      window.storage.x = await dispatch('windowCalcPosX', {window})
      window.storage.y = await dispatch('windowCalcPosY', {window})

      // update
      commit('SET_WINDOW', window)

      // check windows position on load
      dispatch('windowsHandlePageResize')

      // focus on window
      dispatch('windowFocus', window)

      return window
    },

    /**
     * Minimize window
     *
     * @param commit
     * @param dispatch
     * @param data
     */
    async windowMinimize({commit, dispatch}, data) {
      const window = await dispatch('getWindow', data)

      // is window in memory?
      if (!window || !window.storage) return console.log('[OWD] Window missing')

      window.storage.minimized = true

      // update
      commit('SET_WINDOW', window)
    },

    /**
     * Maximize window
     *
     * @param commit
     * @param dispatch
     * @param data
     */
    async windowMaximize({commit, dispatch}, data) {
      const window = await dispatch('getWindow', data)

      // is window in memory?
      if (!window || !window.storage) return console.log('[OWD] Window missing')

      if (window.config.maximizable) {
        window.storage.maximized = true
        commit('core/fullscreen/SET_FULLSCREEN_MODE', true, {root: true})
      }

      // update
      commit('SET_WINDOW', window)
    },

    /**
     * Un-maximize window
     *
     * @param commit
     * @param dispatch
     * @param data
     */
    async windowUnmaximize({commit, dispatch}, data) {
      const window = await dispatch('getWindow', data)

      // is window in memory?
      if (!window || !window.storage) return console.log('[OWD] Window missing')

      if (window.config.maximizable) {
        window.storage.maximized = false
      }

      // update
      commit('SET_WINDOW', window)
    },

    /**
     * Invert maximize window status
     *
     * @param commit
     * @param dispatch
     * @param data
     */
    async windowToggleMaximize({commit, dispatch}, data) {
      const window = await dispatch('getWindow', data)

      // is window in memory?
      if (!window || !window.storage) return console.log('[OWD] Window missing')

      if (window.config.maximizable) {
        window.storage.maximized = !window.storage.maximized

        if (window.storage.maximized) {
          commit('core/fullscreen/SET_FULLSCREEN_MODE', true, {root: true})
        }
      }

      // update
      commit('SET_WINDOW', window)
    },

    /**
     * Expand window
     *
     * @param commit
     * @param dispatch
     * @param data
     */
    async windowExpand({commit, dispatch}, data) {
      const window = await dispatch('getWindow', data)

      // is window in memory?
      if (!window || !window.storage) return console.log('[OWD] Window missing')

      if (window.config.expandable) {
        window.storage.expanded = !window.storage.expanded

        // update
        commit('SET_WINDOW', window)
      }
    },

    /**
     * Set window position
     *
     * @param commit
     * @param dispatch
     * @param data
     */
    async windowSetPosition({commit, dispatch}, data) {
      const window = await dispatch('getWindow', data.window)

      // is window in memory?
      if (!window || !window.storage) return console.log('[OWD] Window missing')

      window.storage.x = data.position.x
      window.storage.x = await dispatch('windowCalcPosX', {window})

      window.storage.y = data.position.y
      window.storage.y = await dispatch('windowCalcPosY', {window})

      // update
      commit('SET_WINDOW', window)
    },

    /**
     * Set all windows hidden
     */
    windowMinimizeAll() {
      windowsUtils.forEachWindowInstance(window => {
        if (window.storage.maximized) {
          window.storage.closed = true
        }
      })
    },

    /**
     * Set all windows not maximized
     *
     * @param commit
     * @param dispatch
     */
    windowUnmaximizeAll({commit, dispatch}) {
      windowsUtils.forEachWindowInstance(window => {
        if (window.storage.maximized) {
          dispatch('windowUnmaximize', window)
        }
      })

      commit('core/fullscreen/SET_FULLSCREEN_MODE', false, {root: true})
    },

    /**
     * Get window position
     *
     * @param state
     * @param dispatch
     * @param data
     */
    async getWindowPosition({dispatch}, data) {
      const window = await dispatch('getWindow', data)

      // is window in memory?
      if (!window || !window.storage) return console.log('[OWD] Window missing')

      return {
        x: window.storage.x,
        y: window.storage.y
      }
    },

    /**
     * Increment window focus
     *
     * @param state
     * @param dispatch
     * @param commit
     * @param data
     */
    async windowFocus({state, commit}, data) {
      const windowFocuses = [...state.windowFocuses]

      if (windowFocuses.length === 0) {
        // set first item null cuz index should start from 1
        windowFocuses.push(null)
      }

      if (windowFocuses.includes(data.uniqueID)) {
        windowFocuses.splice(windowFocuses.indexOf(data.uniqueID), 1)
      }

      windowFocuses.push(data.uniqueID)

      windowsUtils.forEachWindowInstance(window => {
        let index = windowFocuses.indexOf(window.uniqueID)

        if (index < 0) {
          index = 0
        }

        window.storage.z = index
      })

      if (JSON.stringify(windowFocuses) !== JSON.stringify(state.windowFocuses)) {
        commit('SET_WINDOW_FOCUSES', windowFocuses)
      }
    },

    /**
     * Get window focus
     *
     * @param dispatch
     * @param data
     */
    async getWindowFocus({dispatch}, data) {
      const window = await dispatch('getWindow', data)

      // is window in memory?
      if (!window || !window.storage) return console.log('[OWD] Window missing')

      return window.storage.z
    },

    /**
     * Update window position
     *
     * @param dispatch
     * @param commit
     * @param data
     * @param x
     * @param y
     */
    async windowUpdatePosition({commit, dispatch}, {data, x, y}) {
      const window = await dispatch('getWindow', data)

      // is window in memory?
      if (!window || !window.storage) return console.log('[OWD] Window missing')

      window.storage.x = x
      window.storage.y = y

      // update
      commit('SET_WINDOW', window)
    },

    /**
     * Destroy window
     *
     * @param dispatch
     * @param commit
     * @param data
     */
    async windowDestroy({commit, dispatch}, data) {
      const window = await dispatch('getWindow', data)

      // is window in memory?
      if (!window || !window.storage) return console.log('[OWD] Window missing');

      const windowInstancesGroup = windowsUtils.getWindowGroup(data.name)

      if ((!!window.autostart === false && !!window.config.menu === false) || windowInstancesGroup.length > 1) {
        // destroy window if > 1
        commit('UNREGISTER_WINDOW', window);

        // destroy storeInstance if needed
        if (!data.module.singleton) {
          const storeName = `${data.module.name}-${data.uniqueID}`

          // destroy dynamic store module
          storeInstanceDestroy(storeName)
        }
      } else {
        dispatch('windowClose', window)
      }

      // run manually cuz watch event in <Window> isn't triggered after destroy
      dispatch('saveWindowsStorage', window)
    },

    /**
     * Close window
     *
     * @param dispatch
     * @param commit
     * @param data
     */
    async windowClose({commit, dispatch}, data) {
      const window = await dispatch('getWindow', data)

      // is window in memory?
      if (!window || !window.storage) return console.log('[OWD] Window missing')

      window.storage.closed = true

      if (typeof window.config.menu === 'boolean') {
        window.storage.menu = false
      }

      commit('SET_WINDOW', window)
    },

    /**
     * Close all windows
     *
     * @param commit
     */
    windowCloseAll({commit}) {
      windowsUtils.forEachWindowInstance(window => {
        window.storage.closed = true
        commit('SET_WINDOW', window)
      })
    },

    async windowSetNavTitle({commit, dispatch}, {data, title}) {
      const window = await dispatch('getWindow', data)

      // is window in memory?
      if (!window || !window.storage) return console.log('[OWD] Window missing')

      window.title = title

      // update
      commit('SET_WINDOW', window)
    },

    /**
     * Calculate x position for new opened windows
     *
     * @param state
     * @param dispatch
     * @param data
     * @returns {Promise<void>}
     */
    async windowCalcPosX({state}, data) {
      if (typeof data.forceLeft === 'undefined') data.forceLeft = false
      if (typeof data.forceRight === 'undefined') data.forceRight = false

      // is window in memory?
      if (!data || !data.window.storage) return console.log('[OWD] Window missing')

      let x = data.window.storage.x

      // if > 0, window pos was loaded from local storage
      if (data.window.storage.x === 0 || data.forceLeft) {
        x = data.window.storage.x + 96
      } else if (data.window.storage.x < 0 || data.forceRight) {
        x = state.desktopInnerWidth - data.window.storage.width - 24 // right
      }

      return x
    },

    /**
     * Calculate y position for new opened windows
     *
     * @param state
     * @param dispatch
     * @param data
     * @returns {Promise<unknown>}
     */
    async windowCalcPosY({state}, data) {
      if (typeof data.forceLeft === 'undefined') data.forceLeft = false
      if (typeof data.forceRight === 'undefined') data.forceRight = false

      // is window in memory?
      if (!data || !data.window.storage) return console.log('[OWD] Window missing')

      let y = data.window.storage.y

      // if > 0, window pos was loaded from local storage
      if (data.window.storage.y === 0 || data.forceLeft) {
        y = data.window.storage.y + 24
      } else if (data.window.storage.y < 0 || data.forceRight) {
        if (data.window.storage) {
          y = state.desktopInnerHeight - data.window.storage.height - 24 // right
        }
      }

      return y
    },

    /**
     * Reset windows position on page resize
     *
     * @param state
     * @param commit
     * @param dispatch
     */
    async windowsHandlePageResize({state,commit,dispatch}) {
      await windowsUtils.forEachWindowInstance(async window => {
        let changed = false

        if (window.storage && !window.storage.closed) {
          const maxLeft = window.storage.x + window.storage.width
          const maxTop = window.storage.y + window.storage.height

          // calculate max top/left position allowed
          if (maxLeft < window.storage.width || maxLeft > state.desktopInnerWidth) {
            window.storage.x = await dispatch('windowCalcPosX', {window, forceRight: true})
            changed = true
          }
          if (maxTop < window.storage.height || maxTop > state.desktopInnerHeight) {
            window.storage.y = await dispatch('windowCalcPosY', {window, forceRight: true})
            changed = true
          }
        }

        if (changed) {
          commit('SET_WINDOW', window)
        }
      })
    }
  }
}
