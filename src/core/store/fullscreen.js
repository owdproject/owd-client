export default {
  namespaced: true,

  state: {
    fullscreen: false
  },

  getters: {
    fullscreenActive(state) {
      return state.fullscreen
    }
  },

  mutations: {
    SET_FULLSCREEN_MODE(state, value) {
      state.fullscreen = value
    }
  },
};
