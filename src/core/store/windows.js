import Vue from 'vue';

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
    SET_PAGE_WIDTH(state, width) {
      state.desktopInnerWidth = width
    },
    SET_PAGE_HEIGHT(state, height) {
      state.desktopInnerHeight = height
    },
    SET_WINDOW(state, data) {
      state.windows[data.name] = data.window
    },
    SET_WINDOW_STORAGE(state, data) {
      state.windows[data.name] = data.window
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
     * Returns windows history from local storage
     *
     * @returns {boolean|any}
     */
    getWindowsStorage() {
      return new Promise((resolve, reject) => {
        try {
          resolve(JSON.parse(localStorage.getItem(localStorageWindowsStorageName)))
        } catch (e) {
          reject(e);
        }
      })
    },

    /**
     * Load windows positions from local storage
     *
     * @param state
     * @param commit
     * @param storage
     */
    loadWindowsStorage({commit}, storage) {
      const modulesLoaded = Vue.prototype.$modules.modulesLoaded;

      // new windows object
      const windows = {};

      // rebuild windows object from modules
      if (modulesLoaded) {
        Object.keys(modulesLoaded).forEach(moduleName => {
          const module = modulesLoaded[moduleName];

          console.log('[OWD] Module name: ' + moduleName);

          // does module contain any windows?
          if (module.windows && module.windows.length > 0) {
            module.windows.forEach(component => {

              // is component effectively a window?
              if (component.window) {
                const windowName = component.name;

                console.log('[OWD] Module component name: ' + windowName);

                // assign component to windows object
                windows[windowName] = {...component};

                // component.window becomes windows[windowName].config
                windows[windowName].config = component.window;
                delete windows[windowName].window;

                // add storage (clone from component.window)
                windows[windowName].storage = {...component.window};

                // overwrite .window.storage with windows history (if available from local storage)
                if (storage && storage.windows[windowName]) {

                  // set window position and other status
                  windows[windowName].storage = {
                    x: Number(storage.windows[windowName].x),
                    y: Number(storage.windows[windowName].y),
                    z: Number(storage.windows[windowName].z),
                    width: Number(storage.windows[windowName].width),
                    height: Number(storage.windows[windowName].height),
                    closed: !!storage.windows[windowName].closed,
                    minimized: !!storage.windows[windowName].minimized,
                    maximized: !!storage.windows[windowName].maximized,
                  };

                  // show item in menu
                  if (windows[windowName].config.menu === false) {
                    windows[windowName].storage.menu = !!storage.windows[windowName].menu;
                  }

                  // window is already opened, show item in menu
                  if (!storage.windows[windowName].closed) {
                    windows[windowName].storage.menu = true;
                  }
                }

              }

            });
          }
        });
      }

      commit('SET_WINDOWS', windows);

      if (storage) {
        commit('SET_WINDOWS_FOCUS', Number(storage.windowsFocus));
      }
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

        // populate positions
        Object.keys(state.windows).forEach((windowName) => {
          if (state.windows[windowName]) {
            const windowStorage = state.windows[windowName].storage;

            data.windows[windowName] = {
              x: Number(windowStorage.x),
              y: Number(windowStorage.y),
              z: Number(windowStorage.z),
              width: Number(windowStorage.width),
              height: Number(windowStorage.height),
              closed: !!windowStorage.closed,
              minimized: !!windowStorage.minimized,
              maximized: !!windowStorage.maximized,
            };
          }
        });

        // save in local storage
        localStorage.setItem(localStorageWindowsStorageName, JSON.stringify(data));
      }
    },

    /**
     * Open window
     *
     * @param state
     * @param commit
     * @param dispatch
     * @param name
     */
    async windowOpen({state, commit, dispatch}, name) {
      const window = {...state.windows[name]};

      // is window in memory?
      if (!window.storage) return console.log('Window missing');

      window.storage.closed = false;
      window.storage.minimized = false;
      window.storage.menu = true;

      // calculate pos x and y
      window.storage.x = await dispatch('windowCalcPosX', {name});
      window.storage.y = await dispatch('windowCalcPosY', {name});

      // check windows position on load
      dispatch('windowsHandlePageResize');

      // focus on window
      commit('WINDOWS_FOCUS_INCREMENT');
      window.storage.z = state.windowsFocus;

      // update
      commit('SET_WINDOW', {name, window});
    },

    /**
     * Minimize window
     *
     * @param state
     * @param commit
     * @param name
     */
    windowMinimize({state, commit}, name) {
      const window = {...state.windows[name]};

      // is window in memory?
      if (!window.storage) return console.log('Window missing');

      window.storage.minimized = true;

      // update
      commit('SET_WINDOW', {name, window});
    },

    /**
     * Maximize window
     *
     * @param state
     * @param commit
     * @param name
     */
    windowMaximize({state, commit}, name) {
      const window = {...state.windows[name]};

      // is window in memory?
      if (!window.storage) return console.log('Window missing');

      if (window.config.maximizable) {
        window.storage.maximized = true;
      }

      // update
      commit('SET_WINDOW', {name, window});
    },

    /**
     * Invert maximize window status
     *
     * @param state
     * @param commit
     * @param name
     */
    windowInvertMaximize({state, commit}, name) {
      const window = {...state.windows[name]};

      // is window in memory?
      if (!window.storage) return console.log('Window missing');

      if (window.config.maximizable) {
        window.storage.maximized = !window.storage.maximized;
      }

      // update
      commit('SET_WINDOW', {name, window});
    },

    /**
     * Expand window
     *
     * @param state
     * @param commit
     * @param name
     */
    windowExpand({state, commit}, name) {
      const window = {...state.windows[name]};

      // is window in memory?
      if (!window.storage) return console.log('Window missing');

      if (window.config.expandable) {
        window.storage.expanded = !window.storage.expanded;

        // update
        commit('SET_WINDOW', {name, window});
      }
    },

    /**
     * Set all windows hidden
     *
     * @param state
     * @param commit
     */
    windowMinimizeAll({state, commit}) {
      const allWindows = {...state.windows};

      Object.keys(allWindows).forEach(name => {
        allWindows[name].storage.closed = true
      });

      // update
      commit('SET_WINDOWS', allWindows);
    },

    /**
     * Set all windows not maximized
     *
     * @param state
     * @param commit
     */
    windowUnmaximizeAll({state, commit}) {
      Object.keys(state.windows).forEach(name => {
        window[name].config.maximized = false
      });

      // update
      commit('SET_WINDOWS', window);
    },

    /**
     * Increment window focus
     *
     * @param state
     * @param commit
     * @param name
     */
    windowFocus({state, commit}, name) {
      const window = {...state.windows[name]};

      // is window in memory?
      if (!window.storage) return console.log('Window missing');

      commit('WINDOWS_FOCUS_INCREMENT');
      window.storage.z = state.windowsFocus;

      // update
      commit('SET_WINDOW', {name, window});
    },

    /**
     * Get window focus
     *
     * @param state
     * @param name
     */
    getWindowFocus({state}, name) {
      const window = {...state.windows[name]};

      // is window in memory?
      if (!window.storage) return console.log('Window missing');

      return window.storage.z
    },

    /**
     * Update window position
     *
     * @param state
     * @param commit
     * @param name
     * @param x
     * @param y
     */
    windowUpdatePosition({state, commit}, {name, x, y}) {
      const window = {...state.windows[name]};

      // is window in memory?
      if (!window.storage) return console.log('Window missing');

      window.storage.x = x;
      window.storage.y = y;

      // update
      commit('SET_WINDOW', {name, window});
    },

    /**
     * Close window
     *
     * @param state
     * @param commit
     * @param name
     */
    windowClose({state, commit}, name) {
      const window = {...state.windows[name]};

      // is window in memory?
      if (!window.storage) return console.log('Window missing');

      window.storage.closed = true;

      if (typeof window.config.menu === 'boolean') {
        window.storage.menu = false;
      }

      // update
      commit('SET_WINDOW', {name, window});
    },

    /**
     * Close all windows
     *
     * @param state
     * @param commit
     */
    windowCloseAll({state, commit}) {
      const allWindows = {...state.windows};

      Object.keys(allWindows).forEach(name => {
        allWindows[name].storage.closed = true
      });

      // update
      commit('SET_WINDOWS', allWindows);
    },

    windowSetNavTitle({state, commit}, {name, title}) {
      const window = {...state.windows[name]};

      // is window in memory?
      if (!window.storage) return console.log('Window missing');

      window.title = title;

      // update
      commit('SET_WINDOW', {name, window: window});
    },

    /**
     * Calculate x position for new opened windows
     *
     * @param state
     * @param name
     * @param forceLeft
     * @param forceRight
     * @returns {Promise<void>}
     */
    windowCalcPosX({state}, {name, forceLeft, forceRight}) {
      if (typeof forceLeft === 'undefined') forceLeft = false;
      if (typeof forceRight === 'undefined') forceRight = false;

      const window = {...state.windows[name]};

      // is window in memory?
      if (!window.storage) return console.log('Window missing');

      let x = window.storage.x;

      // if > 0, window pos was loaded from local storage
      if (window.storage.x === 0 || forceLeft) {
        x = 96;
      } else if (window.storage.x < 0 || forceRight) {
        x = state.desktopInnerWidth - window.config.width - 24; // right
      }

      return x
    },

    /**
     * Calculate y position for new opened windows
     *
     * @param state
     * @param name
     * @param forceLeft
     * @param forceRight
     * @returns {Promise<unknown>}
     */
    windowCalcPosY({state}, {name, forceLeft, forceRight}) {
      if (typeof forceLeft === 'undefined') forceLeft = false;
      if (typeof forceRight === 'undefined') forceRight = false;

      const window = {...state.windows[name]};

      // is window in memory?
      if (!window.storage) return console.log('Window missing');

      let y = window.storage.y;

      // if > 0, window pos was loaded from local storage
      if (window.storage.y === 0 || forceLeft) {
        y = 24;
      } else if (window.storage.y < 0 || forceRight) {
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
      const windows = {...state.windows};

      // get window container size
      const windowContainer = document.getElementById('windows-container');

      if (windowContainer) {
        let windowContainerWidth = windowContainer.offsetWidth;
        let windowContainerHeight = windowContainer.offsetHeight;

        Object.keys(windows).forEach(async (name) => {
          if (!windows[name].storage.closed) {
            const maxLeft = windows[name].storage.x + windows[name].storage.width;
            const maxTop = windows[name].storage.y + windows[name].storage.height;

            // calculate max top/left position allowed
            if (maxLeft < windows[name].storage.width || maxLeft > windowContainerWidth) {
              windows[name].storage.x = await dispatch('windowCalcPosX', {name, forceRight: true});
              commit('SET_WINDOWS', windows);
            }
            if (maxTop < windows[name].storage.height || maxTop > windowContainerHeight) {
              windows[name].storage.y = await dispatch('windowCalcPosY', {name, forceRight: true});
              commit('SET_WINDOWS', windows);
            }
          }
        })
      }
    }
  }
};
