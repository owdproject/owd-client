import Vue from 'vue';
import * as windowsUtils from "~/core/utils/windows.utils";
import * as windowLocalStorageUtils from "~/core/utils/windows/windowsLocalStorage.utils";
import {storeInstanceCreate,storeInstanceDestroy} from "@/core/utils/store/storeInstance.utils";

// load windows storage from local storage
const windowLocalStorage = windowLocalStorageUtils.loadWindowsLocalStorage()

export default {
  namespaced: true,

  state: {
    desktopInnerWidth: window.innerWidth,
    desktopInnerHeight: window.innerHeight,

    windowInstances: {},

    // windows z-index
    windowFocuses: []
  },

  getters: {
    windowInstances(state) {
      return state.windowInstances
    },
    windowFocuses(state) {
      return state.windowFocuses
    }
  },

  mutations: {
    SET_DESKTOP_WIDTH(state, width) {
      state.desktopInnerWidth = width
    },
    SET_DESKTOP_HEIGHT(state, height) {
      state.desktopInnerHeight = height
    },
    // todo / currently this mutation is here just for logging purposes
    // because window state attrs are changed directly.
    // i return the cloned window object in getWindow() but it's not effective,
    // check #wtf-1 and then when 'getWindow' is called
    SET_WINDOW(state, data) {
      // state.windowInstances[data.name][data.uniqueID] = data
    },
    UNSET_WINDOW(state, data) {
      const windowGroup = state.windowInstances[data.name];

      // check if is array of windows
      if (windowsUtils.isWindowGroup(windowGroup)) {
        if (windowsUtils.isWindowIndexExisting(windowGroup, data.uniqueID)) {
          const index = windowsUtils.findWindowWithAttr(windowGroup, 'uniqueID', data.uniqueID)
          state.windowInstances[data.name].splice(index, 1)
        }
      }
    },
    REGISTER_WINDOW(state, data) {
      // add window instance to window data
      state.windowInstances[data.name].push(data)
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
    async initialize({commit,dispatch}) {
      // get loaded modules in OWD Client
      const modulesLoaded = Vue.prototype.$modules.modulesLoaded;

      const windowInstances = {}
      const windowRegistrationPool = []

      // build windows object starting from modules
      if (modulesLoaded) {

        // for each module
        for (const moduleName of Object.keys(modulesLoaded)) {
          const module = modulesLoaded[moduleName];
          const moduleWithoutWindows = {...module}; delete moduleWithoutWindows.windows

          // does module contain any windows?
          if (Array.isArray(module.windows) && module.windows.length > 0) {

            // for each window in module
            for (const moduleWindowComponent of module.windows) {
              // is component effectively a window?
              if (moduleWindowComponent.window) {

                // for example WindowSample
                const windowName = moduleWindowComponent.name;

                windowInstances[windowName] = []

                console.log('[OWD] Module component name: ' + windowName);

                const storageWindows = await dispatch('getWindowsStorageByWindowName', windowName)

                const windowData = {
                  name: windowName,
                  config: moduleWindowComponent,
                  module: moduleWithoutWindows
                }

                // has windowsStorage filtered by windowName (from local storage) some windows for us?
                if (Array.isArray(storageWindows) && storageWindows.length > 0) {

                  // for each window storage
                  for (const windowStorage of storageWindows) {

                    windowRegistrationPool.push({
                      ...windowData,
                      storage: windowStorage
                    })

                  }

                } else {

                  // there is no window stored in local storage so generate at least one instance
                  windowRegistrationPool.push(windowData)

                }

              }
            }

          }
        }

      }

      commit('SET_WINDOW_INSTANCES', windowInstances)

      if (windowRegistrationPool.length > 0) {
        for (const windowData of windowRegistrationPool) {
          await dispatch('windowCreateInstance', windowData)
        }
      }

      // check windows position on load
      dispatch('windowsHandlePageResize');
    },

    /**
     * Get window by name or by name + id
     *
     * @param state
     * @param data
     * @returns {null|*}
     */
    getWindow({getters}, data) {
      let name

      switch(typeof data) {
        case 'string':
          name = data
          break;
        case 'object':
          name = data.name
          break;
      }

      const windowGroupInstances = getters['windowInstances'][name]
      let windowInstance

      if (!data.uniqueID) {
        windowInstance = windowGroupInstances[0]
      } else {
        windowInstance = windowGroupInstances.find(window => window.uniqueID === data.uniqueID)
      }

      if (typeof windowInstance !== 'undefined') {
        return {...windowInstance} // #wtf-1
      }

      return null
    },

    /**
     * For each window group name
     *
     * @param state
     * @param cb
     */
    forEachWindowGroupName({state}, cb) {
      for (const windowName of Object.keys(state.windowInstances)) {
        if (state.windowInstances[windowName].length > 0) {
          cb(windowName)
        }
      }
    },

    /**
     * For each window
     *
     * @param state
     * @param cb
     */
    forEachWindow({state}, cb) {
      for (const windowName of Object.keys(state.windowInstances)) {
        for (const windowInstance of state.windowInstances[windowName]) {
          cb(windowInstance)
        }
      }
    },

    /**
     * Returns windows history from local storage
     *
     * @returns {boolean|any}
     */
    async getWindowsByWindowName({state}, name) {
      if (windowsUtils.isWindowGroupNotEmpty(state.windowInstances[name])) {
        return state.windowInstances[name]
      }

      return []
    },

    /**
     * Returns windows history from local storage
     * (or return selective windows history filtered by windowName)
     *
     * @returns {boolean|any}
     */
    async getWindowsStorageByWindowName({dispatch}, windowName) {
      if (
        windowLocalStorage &&
        windowLocalStorage.windowInstances &&
        typeof windowLocalStorage.windowInstances[windowName] !== 'undefined'
      ) {
        return windowLocalStorage.windowInstances[windowName]
      }

      return null
    },

    /**
     * Save windows positions in local storage
     *
     * @param state
     */
    saveWindowsStorage({state}) {
      if (Object.keys(state.windowInstances).length) {
        const data = {};

        // for each window group
        for (const windowName of Object.keys(state.windowInstances)) {

          // if is array and contain windows
          data[windowName] = []

          // for each window currently loaded
          for (const window of state.windowInstances[windowName]) {

            // push a window storage object with essentials data to store
            data[windowName].push({
              x: Number(window.storage.x),
              y: Number(window.storage.y),
              z: Number(window.storage.z),
              width: Number(window.storage.width),
              height: Number(window.storage.height),
              closed: !!window.storage.closed,
              minimized: !!window.storage.minimized,
              maximized: !!window.storage.maximized,
            });

          }

        }

        // update local storage
        windowLocalStorageUtils.saveWindowsLocalStorage(JSON.stringify({
          windowInstances: data,
          windowFocuses: state.windowFocuses
        }))
      }
    },

    /**
     * Get original window configuration
     *
     * @param context
     * @param name
     * @returns {null}
     */
    getWindowConfiguration(context, name) {
      const windowConfiguration = Vue.prototype.$modules.getWindowConfigurationFromWindowName(name);

      if (typeof windowConfiguration !== 'undefined') {
        return windowConfiguration
      }

      return null
    },

    /**
     * Get original window module
     *
     * @param context
     * @param name
     * @returns {null}
     */
    getWindowModule(context, name) {
      const windowModule = Vue.prototype.$modules.getWindowModuleFromWindowName(name);

      if (typeof windowModule !== 'undefined') {
        return windowModule
      }

      return null
    },

    /**
     * Initialize window
     *
     * @param commit
     * @param dispatch
     * @param data
     */
    async windowCreateInstance({commit, dispatch}, data) {
      // check if window is given or...
      // get a copy of the module window configuration
      const windowInstance = {...data.config}

      // assign unique id
      windowInstance.uniqueID = windowsUtils.generateUniqueWindowId()

      // .config contains rules and features enabled in the module.json "window" attr
      windowInstance.config = data.config.window;

      // add informations about this module
      windowInstance.module = data.module;

      // .window data has been assigned to .config so is no more needed in .window
      delete windowInstance.window;

      // add storage (clone from windowInstance.config)
      windowInstance.storage = {...windowInstance.config};

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
          maximized: !!data.storage.maximized,
        };

        // show item in menu
        if (windowInstance.config.menu === false) {
          windowInstance.storage.menu = !!data.storage.menu;
        }

        // window is already opened, show item in menu
        if (!data.storage.closed) {
          windowInstance.storage.menu = true
        }
      }

      // initialize storeInstance if needed
      if (windowInstance.module.storeInstance) {
        const storeDefaultsGenerator = require(`../../modules/${windowInstance.module.name}/storeInstance`)

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
     * @param state
     * @param commit
     * @param dispatch
     * @param name
     * @param window
     */
    async windowCreate({state, commit, dispatch}, {name, window}) {
      // check if window is given or...
      if (!window) {
        const config = await dispatch('getWindowConfiguration', name)
        const module = await dispatch('getWindowModule', name)

        window = await dispatch('windowCreateInstance', {
          name,
          config,
          module
        })
      }

      if (!window) {
        return console.log('[OWD] Unable to create new window')
      }

      const windowGroups = {...state.windowInstances}

      // push component to windows array
      if (typeof windowGroups[name] === 'undefined') {
        windowGroups[name] = []
      }

      window.storage.closed = false

      // calculate pos x and y
      window.storage.x = await dispatch('windowCalcPosX', {window});
      window.storage.y = await dispatch('windowCalcPosY', {window});

      // update
      commit('SET_WINDOW', window);

      // focus on window
      dispatch('windowFocus', window);
    },

    /**
     * Open window
     *
     * @param state
     * @param commit
     * @param dispatch
     * @param data
     */
    async windowOpen({state, commit, dispatch}, data) {
      const window = await dispatch('getWindow', data);

      // is window in memory?
      if (!window || !window.storage) return console.log('[OWD] Window missing');

      window.storage.closed = false;
      window.storage.minimized = false;
      window.storage.menu = true;

      // calculate pos x and y
      window.storage.x = await dispatch('windowCalcPosX', {window});
      window.storage.y = await dispatch('windowCalcPosY', {window});

      // update
      commit('SET_WINDOW', window);

      // check windows position on load
      dispatch('windowsHandlePageResize');

      // focus on window
      dispatch('windowFocus', window);
    },

    /**
     * Minimize window
     *
     * @param commit
     * @param dispatch
     * @param data
     */
    async windowMinimize({commit, dispatch}, data) {
      const window = await dispatch('getWindow', data);

      // is window in memory?
      if (!window || !window.storage) return console.log('[OWD] Window missing');

      window.storage.minimized = true;

      // update
      commit('SET_WINDOW', window);
    },

    /**
     * Maximize window
     *
     * @param commit
     * @param dispatch
     * @param data
     */
    async windowMaximize({commit, dispatch}, data) {
      const window = await dispatch('getWindow', data);

      // is window in memory?
      if (!window || !window.storage) return console.log('[OWD] Window missing');

      if (window.config.maximizable) {
        window.storage.maximized = true;
      }

      // update
      commit('SET_WINDOW', window);
    },

    /**
     * Un-maximize window
     *
     * @param commit
     * @param dispatch
     * @param data
     */
    async windowUnmaximize({commit, dispatch}, data) {
      const window = await dispatch('getWindow', data);

      // is window in memory?
      if (!window || !window.storage) return console.log('[OWD] Window missing');

      if (window.config.maximizable) {
        window.storage.maximized = false;
      }

      // update
      commit('SET_WINDOW', window);
    },

    /**
     * Invert maximize window status
     *
     * @param commit
     * @param dispatch
     * @param data
     */
    async windowInvertMaximize({commit, dispatch}, data) {
      const window = await dispatch('getWindow', data);

      // is window in memory?
      if (!window || !window.storage) return console.log('[OWD] Window missing');

      if (window.config.maximizable) {
        window.storage.maximized = !window.storage.maximized;
      }

      // update
      commit('SET_WINDOW', window);
    },

    /**
     * Expand window
     *
     * @param commit
     * @param dispatch
     * @param data
     */
    async windowExpand({commit, dispatch}, data) {
      const window = await dispatch('getWindow', data);

      // is window in memory?
      if (!window || !window.storage) return console.log('[OWD] Window missing');

      if (window.config.expandable) {
        window.storage.expanded = !window.storage.expanded;

        // update
        commit('SET_WINDOW', window);
      }
    },

    /**
     * Set all windows hidden
     *
     * @param state
     * @param commit
     */
    windowMinimizeAll({dispatch}) {
      dispatch('forEachWindow', window => {
        if (window.storage.maximized) {
          window.storage.closed = true
        }
      })
    },

    /**
     * Set all windows not maximized
     *
     * @param dispatch
     */
    windowUnmaximizeAll({dispatch}) {
      dispatch('forEachWindow', window => {
        if (window.storage.maximized) {
          dispatch('windowUnmaximize', window)
        }
      })
    },

    /**
     * Get window position
     *
     * @param state
     * @param dispatch
     * @param data
     */
    async getWindowPosition({state, dispatch}, data) {
      const window = await dispatch('getWindow', data);

      // is window in memory?
      if (!window || !window.storage) return console.log('[OWD] Window missing');

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
    async windowFocus({state, commit, dispatch}, data) {
      const windowFocuses = [...state.windowFocuses]

      if (windowFocuses.length === 0) {
        // set first item null cuz index should start from 1
        windowFocuses.push(null)
      }

      if (windowFocuses.includes(data.uniqueID)) {
        windowFocuses.splice(windowFocuses.indexOf(data.uniqueID), 1)
      }

      windowFocuses.push(data.uniqueID)

      dispatch('forEachWindow', window => {
        let index = windowFocuses.indexOf(window.uniqueID)

        if (index < 0) {
          index = 0
        }

        window.storage.z = index
      })

      commit('SET_WINDOW_FOCUSES', windowFocuses)
    },

    /**
     * Get window focus
     *
     * @param dispatch
     * @param data
     */
    async getWindowFocus({dispatch}, data) {
      const window = await dispatch('getWindow', data);

      // is window in memory?
      if (!window || !window.storage) return console.log('[OWD] Window missing');

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
      const window = await dispatch('getWindow', data);

      // is window in memory?
      if (!window || !window.storage) return console.log('[OWD] Window missing');

      window.storage.x = x;
      window.storage.y = y;

      // update
      commit('SET_WINDOW', window);
    },

    /**
     * Destroy window
     *
     * @param dispatch
     * @param commit
     * @param data
     */
    async windowDestroy({commit, dispatch}, data) {
      const window = await dispatch('getWindow', data);

      // is window in memory?
      if (!window || !window.storage) return console.log('[OWD] Window missing');

      const windowsWithCertainGroupName = await dispatch('getWindowsByWindowName', window.name)
      if (
        typeof window.config.menu === 'boolean' &&
        windowsUtils.getCountArrayOfWindows(windowsWithCertainGroupName) > 1
      ) {
        // destroy window if > 1
        commit('UNSET_WINDOW', window);

        // destroy storeInstance if present
        if (data.module.storeInstance) {
          const storeName = `${data.module.name}-${data.uniqueID}`

          // destroy dynamic store module
          storeInstanceDestroy(storeName)
        }
      } else {
        dispatch('windowClose', window)
      }
    },

    /**
     * Close window
     *
     * @param dispatch
     * @param commit
     * @param data
     */
    async windowClose({commit, dispatch}, data) {
      const window = await dispatch('getWindow', data);

      // is window in memory?
      if (!window || !window.storage) return console.log('[OWD] Window missing');

      window.storage.closed = true;

      if (typeof window.config.menu === 'boolean') {
        window.storage.menu = false;
      }

      commit('SET_WINDOW', window);
    },

    /**
     * Close all windows
     *
     * @param state
     * @param commit
     */
    windowCloseAll({state, commit}) {
      const windowGroups = {...state.windows};

      Object.keys(windowGroups).forEach(name => {
        windowGroups[name].storage.closed = true
      });

      // update
      commit('SET_WINDOWS', windowGroups);
    },

    async windowSetNavTitle({commit, dispatch}, {data, title}) {
      const window = await dispatch('getWindow', data);

      // is window in memory?
      if (!window || !window.storage) return console.log('[OWD] Window missing');

      window.title = title;

      // update
      commit('SET_WINDOW', window);
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
      if (typeof data.forceLeft === 'undefined') data.forceLeft = false;
      if (typeof data.forceRight === 'undefined') data.forceRight = false;

      // is window in memory?
      if (!data || !data.window.storage) return console.log('[OWD] Window missing');

      let x = data.window.storage.x;

      // if > 0, window pos was loaded from local storage
      if (data.window.storage.x === 0 || data.forceLeft) {
        x = 96;
      } else if (data.window.storage.x < 0 || data.forceRight) {
        x = state.desktopInnerWidth - data.window.config.width - 24; // right
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
      if (typeof data.forceLeft === 'undefined') data.forceLeft = false;
      if (typeof data.forceRight === 'undefined') data.forceRight = false;

      // is window in memory?
      if (!data || !data.window.storage) return console.log('[OWD] Window missing');

      let y = data.window.storage.y;

      // if > 0, window pos was loaded from local storage
      if (data.window.storage.y === 0 || data.forceLeft) {
        y = 24;
      } else if (data.window.storage.y < 0 || data.forceRight) {
        y = state.desktopInnerHeight - window.config.height - 24; // right
      }

      return y
    },

    /**
     * Reset windows position on page resize
     * todo fix me
     *
     * @param state
     * @param commit
     * @param dispatch
     */
    windowsHandlePageResize({state,commit,dispatch}) {
      // reset position if window moved outside parent on page resize
      const windowGroupInstances = {...state.windowInstances};

      dispatch('forEachWindow', async window => {

        if (!window.storage.closed) {
          const maxLeft = window.storage.x + window.storage.width;
          const maxTop = window.storage.y + window.storage.height;

          // calculate max top/left position allowed
          if (maxLeft < window.storage.width || maxLeft > state.desktopInnerWidth) {
            window.storage.x = await dispatch('windowCalcPosX', {window, forceRight: true});

            // replace data in windows object
            windowGroupInstances[window.name][window.uniqueID] = window
          }
          if (maxTop < window.storage.height || maxTop > state.desktopInnerHeight) {
            window.storage.y = await dispatch('windowCalcPosY', {window, forceRight: true});

            // replace data in windows object
            windowGroupInstances[window.name][window.uniqueID] = window
          }
        }

      })

      commit('SET_WINDOW_INSTANCES', windowGroupInstances)
    }
  }
};
