export default {
  namespaced: true,

  state: {
    modulesLoaded: {},
    windowsLoaded: {},
  },

  getters: {
    modulesLoaded(state) {
      return state.modulesLoaded
    },
    windowsLoaded(state) {
      return state.windowsLoaded
    }
  },

  mutations: {
    SET_LOADED_MODULES: function(state, modulesLoaded) {
      console.log(modulesLoaded)
      state.modulesLoaded = modulesLoaded
    },
    SET_LOADED_WINDOWS: function(state, windowsLoaded) {
      state.windowsLoaded = windowsLoaded
    }
  },

  actions: {
    isModuleLoaded({getters}, module) {
      return Object.keys(getters['modulesLoaded']).includes(module)
    },

    getLoadedModuleWindowInfo({getters}, windowName) {
      if (typeof getters['windowsLoaded'][windowName] !== 'undefined') {
        return getters['windowsLoaded'][windowName]
      }

      return null
    }
  }
}