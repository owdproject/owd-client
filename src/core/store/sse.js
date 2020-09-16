export default {
  namespaced: true,

  state: {
    eventSource: null,
    connected: true,
    reconnectInterval: null,
  },
  mutations: {
    SET_CONNECTED: (state, value) => {
      state.connected = value;
    },
    EVENT_LOG: (state, value) => {
      state.log = value;
    },
  },
  actions: {
    connect({state, commit, dispatch}) {
      const sse = new EventSource(process.env.VUE_APP_SERVER_API_BASE_URL + "sse");

      sse.onerror = () => {
        commit('SET_CONNECTED', false);
        console.error('Unable to connect to sse');

        sse.close();

        clearInterval(state.reconnectInterval);
        state.reconnectInterval = setInterval(() => dispatch('connect'), 5000);
      };

      sse.onmessage = (message) => {
        commit('SET_CONNECTED', true);
        clearInterval(state.reconnectInterval);

        const data = JSON.parse(message.data);

        if (Array.isArray(data)) {
          data.forEach((event) => {
            commit('EVENT_LOG', event);
          });
        } else {
          commit('EVENT_LOG', data);
        }
      };
    }
  }
}
