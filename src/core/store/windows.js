import Vue from 'vue';
import * as windowsUtils from "@/core/utils/windows";

const localStorageWindowsStorageName = 'windows-storage';

export default {
  namespaced: true,

  state: {
    desktopInnerWidth: window.innerWidth,
    desktopInnerHeight: window.innerHeight,

    windows: {},

    // z-index global counter for windows focus
    windowsFocus: 0
  },

  getters: {
    windows(state) {
      return state.windows
    },
    windowsFocus(state) {
      return state.windowsFocus
    }
  },

  mutations: {
    SET_DESKTOP_WIDTH(state, width) {
      state.desktopInnerWidth = width
    },
    SET_DESKTOP_HEIGHT(state, height) {
      state.desktopInnerHeight = height
    },
    SET_WINDOW(state, data) {
      data.window.index = data.index

      const windowsArray = state.windows[data.name];

      // check if is array of windows
      if (windowsUtils.isArrayOfWindows(windowsArray)) {
        if (windowsUtils.isWindowIndexExisting(windowsArray, data.index)) {
          state.windows[data.name][data.index] = data.window
        }
      }
    },
    UNSET_WINDOW(state, data) {
      const windowsArray = state.windows[data.name];

      // check if is array of windows
      if (windowsUtils.isArrayOfWindows(windowsArray)) {
        if (windowsUtils.isWindowIndexExisting(windowsArray, data.index)) {
          state.windows[data.name].splice(data.index, 1)
        }
      }
    },
    SET_WINDOWS(state, windows) {
      state.windows = windows
    },
    SET_WINDOWS_FOCUS(state, focusIndex) {
      state.windowsFocus = focusIndex
    },
    WINDOWS_FOCUS_INCREMENT(state) {
      state.windowsFocus++
    }
  },

  actions: {
    /**
     * Get window by name or by name + id
     *
     * @param state
     * @param window
     * @returns {null|*}
     */
    getWindow({state}, window) {
      let windowName = null;
      let windowIndex = 0;

      switch(typeof window) {
        case 'string':
          windowName = window
          break;
        case 'object':
          windowName = window.name;
          windowIndex = Number(window.index)
          break;
      }

      // clone windowsArray
      const windowsArray = [ ...state.windows[windowName] ];

      if (windowsUtils.isArrayOfWindowsNotEmpty(windowsArray)) {
        if (windowsUtils.isWindowIndexExisting(windowsArray, windowIndex)) {
          return windowsArray[windowIndex]
        }
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
      Object.keys(state.windows).forEach((windowName) => {
        const windowGroup = state.windows[windowName]

        // if is array and contains windows
        if (windowsUtils.isArrayOfWindowsNotEmpty(windowGroup)) {
          cb(windowName)
        }
      })
    },

    /**
     * For each window
     *
     * @param state
     * @param cb
     */
    forEachWindow({state}, cb) {
      Object.keys(state.windows).forEach((windowName) => {
        // if is array and contains windows
        if (windowsUtils.isArrayOfWindowsNotEmpty(state.windows[windowName])) {

          // for each window
          state.windows[windowName].forEach(window => {
            cb(window)
          })

        }
      })
    },

    /**
     * Returns windows history from local storage
     *
     * @returns {boolean|any}
     */
    async getWindowsByWindowGroupName({state}, name) {
      const windows = state.windows

      if (windowsUtils.isArrayOfWindowsNotEmpty(windows[name])) {
        return windows[name]
      }

      return []
    },

    /**
     * Returns windows history from local storage
     * (or return selective windows history filtered by windowName)
     *
     * @returns {boolean|any}
     */
    async getWindowsStorageByWindowsName({dispatch}, name) {
      let windowsStorage = await dispatch('loadWindowsStorage')

      if (windowsStorage) {
        windowsStorage = windowsStorage.windows
      }

      if (windowsStorage && typeof windowsStorage[name] !== 'undefined') {
        return windowsStorage[name]
      }

      return null
    },

    /**
     * Get windows storage
     *
     * @param state
     * @param data
     * @returns {null|*|string}
     */
    getWindowStorage({state}, data) {
      let storage = state.windows;

      if (data.storage) {
        storage = data.storage
      }

      const windowName = data.name
      const windowIndex = data.index

      if (storage && storage.windows) {
        if (typeof storage.windows[windowName] !== 'undefined') {
          return storage.windows[windowName][windowIndex]
        }
      }

      return null
    },

    generateWindowData(context, data) {
      const windowData = {...data.config}

      // assign index and unique id
      windowData.index = data.index
      windowData.uniqueID = windowsUtils.generateUniqueWindowId()

      // .config contains window standard configuration from specific window module.json
      windowData.config = data.config.window;

      // add informations about this module
      windowData.module = data.module;

      // .window data has been assigned to .config so is no more needed in .window
      delete windowData.window;

      // add storage (clone from .config)
      windowData.storage = {...data.config.window};

      // overwrite .storage with history (from local storage)
      if (data.storage) {

        // set window position and other status
        windowData.storage = {
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
        if (windowData.config.menu === false) {
          windowData.storage.menu = !!data.storage.menu;
        }

        // window is already opened, show item in menu
        if (!data.storage.closed) {
          windowData.storage.menu = true;
        }
      }

      return windowData
    },

    /**
     * Initialize all windows instances and load positions from local storage
     *
     * @param state
     * @param dispatch
     */
    async initialize({dispatch}) {
      // get loaded modules in OWD Client
      const modulesLoaded = Vue.prototype.$modules.modulesLoaded;

      // new windows object
      const windows = {};

      // build windows object starting from modules
      if (modulesLoaded) {

        // for each module
        Object.keys(modulesLoaded).forEach(moduleName => {
          const module = modulesLoaded[moduleName];

          // does module contain any windows?
          if (Array.isArray(module.windows) && module.windows.length > 0) {

            // for each window in module
            module.windows.forEach(async moduleWindowComponent => {

              // is component effectively a window?
              if (moduleWindowComponent.window) {
                // for example WindowSample
                const windowName = moduleWindowComponent.name;

                console.log('[OWD] Module component name: ' + windowName);

                const storageWindows = await dispatch('getWindowsStorageByWindowsName', windowName)

                let windowIndex = 0

                const windowData = {
                  index: windowIndex,
                  name: windowName,
                  config: moduleWindowComponent,
                  module
                }

                // assign empty array windows object with windowName key
                windows[windowName] = [];

                // has windowsStorage filtered by windowName (from local storage) some windows for us?
                if (Array.isArray(storageWindows) && storageWindows.length > 0) {

                  // for each window storage
                  for (const windowStorage of storageWindows) {

                    windowData.index = windowIndex
                    windowData.storage = windowStorage

                    dispatch('windowInitialize', windowData)

                    windowIndex++
                  }

                } else {

                  // there is no window stored in local storage so generate at least one window instance
                  dispatch('windowInitialize', windowData)

                }

              }
            });

          }
        });

      }

      // commit('SET_WINDOWS', windows);

      /*
      if (storage) {
        commit('SET_WINDOWS_FOCUS', Number(storage.windowsFocus));
      }
      */

      // check windows position on load
      dispatch('windowsHandlePageResize');
    },

    /**
     * Load and returns windows positions and others data from local storage
     *
     * @returns {boolean|any}
     */
    loadWindowsStorage() {
      return new Promise((resolve, reject) => {
        try {
          let storageWindows = localStorage.getItem(localStorageWindowsStorageName);

          storageWindows = JSON.parse(storageWindows)

          resolve(storageWindows)
        } catch (e) {
          reject(e);
        }
      })
    },

    /**
     * Save windows positions in local storage
     *
     * @param state
     */
    saveWindowsStorage({state}) {
      if (Object.keys(state.windows).length) {
        let data = {
          windows: {},
          windowsFocus: state.windowsFocus
        };

        // for each window group
        Object.keys(state.windows).forEach((windowName) => {

          // if is array and contain windows
          if (windowsUtils.isArrayOfWindowsNotEmpty(state.windows[windowName])) {
            data.windows[windowName] = []

            // for each window currently loaded
            state.windows[windowName].forEach(window => {

              // push a window storage object with essentials data to store
              data.windows[windowName].push({
                x: Number(window.storage.x),
                y: Number(window.storage.y),
                z: Number(window.storage.z),
                width: Number(window.storage.width),
                height: Number(window.storage.height),
                closed: !!window.storage.closed,
                minimized: !!window.storage.minimized,
                maximized: !!window.storage.maximized,
              });

            })
          }

        });

        // save in local storage
        localStorage.setItem(localStorageWindowsStorageName, JSON.stringify(data));
      }
    },

    /**
     * Get free window group index
     *
     * @param state
     * @param name
     * @returns {number|*}
     */
    getWindowGroupsFreeIndex({state}, name) {
      if (windowsUtils.isArrayOfWindowsNotEmpty(state.windows[name])) {
        return state.windows[name].length
      }

      return 0
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
     * initialize window
     *
     * @param state
     * @param commit
     * @param dispatch
     * @param window
     */
    async windowInitialize({state, commit, dispatch}, window) {
      // check if window is given or...
      const windowData = await dispatch('generateWindowData', window)

      if (!windowData) {
        return console.log('[OWD] Unable to create new window')
      }

      const windowGroups = {...state.windows}

      // push component to windows array
      if (typeof windowGroups[window.name] === 'undefined') {
        windowGroups[window.name] = []
      }

      windowGroups[window.name].push(windowData);

      commit('SET_WINDOWS', windowGroups)
    },

    /**
     * Open window
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
        const index = await dispatch('getWindowGroupsFreeIndex', name)
        const config = await dispatch('getWindowConfiguration', name)
        const module = await dispatch('getWindowModule', name)

        window = await dispatch('generateWindowData', {
          index,
          name,
          config,
          module
        })
      }

      if (!window) {
        return console.log('[OWD] Unable to create new window')
      }

      const windowGroups = {...state.windows}

      // push component to windows array
      if (typeof windowGroups[name] === 'undefined') {
        windowGroups[name] = []
      }

      window.storage.closed = false

      // calculate pos x and y
      window.storage.x = await dispatch('windowCalcPosX', {window});
      window.storage.y = await dispatch('windowCalcPosY', {window});

      windowGroups[name].push(window);

      commit('SET_WINDOWS', windowGroups)

      // force manual windows save because 'window.storage' isn't triggered in the Window.vue watch() event
      dispatch('saveWindowsStorage')
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
      if (!window || !window.storage) return console.log('Window missing');

      window.storage.closed = false;
      window.storage.minimized = false;
      window.storage.menu = true;

      // calculate pos x and y
      window.storage.x = await dispatch('windowCalcPosX', {window});
      window.storage.y = await dispatch('windowCalcPosY', {window});

      // check windows position on load
      dispatch('windowsHandlePageResize');

      // focus on window
      commit('WINDOWS_FOCUS_INCREMENT');
      window.storage.z = state.windowsFocus;

      // update
      commit('SET_WINDOW', {
        name: data.name,
        index: data.index,
        window
      });
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
      if (!window || !window.storage) return console.log('Window missing');

      window.storage.minimized = true;

      // update
      commit('SET_WINDOW', {
        name: data.name,
        index: data.index,
        window
      });
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
      if (!window || !window.storage) return console.log('Window missing');

      if (window.config.maximizable) {
        window.storage.maximized = true;
      }

      // update
      commit('SET_WINDOW', {
        name: data.name,
        index: data.index,
        window
      });
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
      if (!window || !window.storage) return console.log('Window missing');

      if (window.config.maximizable) {
        window.storage.maximized = false;
      }

      // update
      commit('SET_WINDOW', {
        name: data.name,
        index: data.index,
        window
      });
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
      if (!window || !window.storage) return console.log('Window missing');

      if (window.config.maximizable) {
        window.storage.maximized = !window.storage.maximized;
      }

      // update
      commit('SET_WINDOW', {
        name: data.name,
        index: data.index,
        window
      });
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
      if (!window || !window.storage) return console.log('Window missing');

      if (window.config.expandable) {
        window.storage.expanded = !window.storage.expanded;

        // update
        commit('SET_WINDOW', {
          name: data.name,
          index: data.index,
          window
        });
      }
    },

    /**
     * Set all windows hidden
     *
     * @param state
     * @param commit
     */
    windowMinimizeAll({state, commit}) {
      const windowGroups = {...state.windows};

      Object.keys(windowGroups).forEach(name => {
        windowGroups[name].storage.closed = true
      });

      // update
      commit('SET_WINDOWS', windowGroups);
    },

    /**
     * Set all windows not maximized
     *
     * @param dispatch
     */
    windowUnmaximizeAll({dispatch}) {
      dispatch('forEachWindow', async window => {
        if (window.storage.maximized) {
          dispatch('windowUnmaximize', window)
        }
      })
    },

    /**
     * Get window position
     *
     * @param state
     * @param name
     */
    getWindowPosition({ state }, name) {
      const window = { ...state.windows[name] };

      // is window in memory?
      if (!window || !window.storage) return console.log('Window missing');

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
      const window = await dispatch('getWindow', data);

      // is window in memory?
      if (!window || !window.storage) return console.log('Window missing');

      commit('WINDOWS_FOCUS_INCREMENT');
      window.storage.z = state.windowsFocus;

      // update
      commit('SET_WINDOW', {
        name: data.name,
        index: data.index,
        window
      });
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
      if (!window || !window.storage) return console.log('Window missing');

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
      if (!window || !window.storage) return console.log('Window missing');

      window.storage.x = x;
      window.storage.y = y;

      // update
      commit('SET_WINDOW', {
        name: data.name,
        index: data.index,
        window
      });
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
      if (!window || !window.storage) return console.log('Window missing');

      const windowsWithCertainGroupName = await dispatch('getWindowsByWindowGroupName', window.name)
      if (
        typeof window.config.menu === 'boolean' &&
        windowsUtils.getCountArrayOfWindows(windowsWithCertainGroupName) > 1
      ) {
        // destroy window if > 1
        commit('UNSET_WINDOW', {
          name: data.name,
          index: data.index
        });

        // reassign windows indexes
        dispatch('windowReassignIndexes');
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
      if (!window || !window.storage) return console.log('Window missing');

      window.storage.closed = true;

      if (typeof window.config.menu === 'boolean') {
        window.storage.menu = false;
      }

      commit('SET_WINDOW', {
        name: window.name,
        index: window.index,
        window
      });
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
      if (!window || !window.storage) return console.log('Window missing');

      window.title = title;

      // update
      commit('SET_WINDOW', {
        name: data.name,
        index: data.index,
        window
      });
    },

    /**
     * When a window is destroyed, its window group array changes
     * so all window indexes need to be reassigned
     *
     * @returns {Promise<void>}
     */
    async windowReassignIndexes({state, commit, dispatch}) {
      const windowGroups = {...state.windows}

      await dispatch('forEachWindowGroupName', (name) => {
        for (const index of Object.keys(windowGroups[name])) {
          windowGroups[name].forEach(() => {

            // overwrite index
            windowGroups[name][index].index = Number(index)

          })
        }
      })

      // overwrite windows
      commit('SET_WINDOWS', windowGroups);
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
      if (!data || !data.window.storage) return console.log('Window missing');

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
      if (!data || !data.window.storage) return console.log('Window missing');

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
     *
     * @param state
     * @param commit
     * @param dispatch
     */
    windowsHandlePageResize({state, commit, dispatch}) {
      // reset position if window moved outside parent on page resize
      const windowGroups = {...state.windows};

      // get window container size
      const windowContainer = document.getElementById('windows-container');

      if (windowContainer) {
        let windowContainerWidth = windowContainer.offsetWidth;
        let windowContainerHeight = windowContainer.offsetHeight;

        dispatch('forEachWindow', async window => {

          if (!window.storage.closed) {
            const maxLeft = window.storage.x + window.storage.width;
            const maxTop = window.storage.y + window.storage.height;

            // calculate max top/left position allowed
            if (maxLeft < window.storage.width || maxLeft > windowContainerWidth) {
              window.storage.x = await dispatch('windowCalcPosX', {window, forceRight: true});

              // replace data in windows object
              windowGroups[window.name][window.index] = window
            }
            if (maxTop < window.storage.height || maxTop > windowContainerHeight) {
              window.storage.y = await dispatch('windowCalcPosY', {window, forceRight: true});

              // replace data in windows object
              windowGroups[window.name][window.index] = window
            }
          }

        })

        // overwrite windows
        commit('SET_WINDOWS', windowGroups);
      }
    }
  }
};
