import axios from 'axios';

const clientDefaultTitle = process.env.VUE_APP_NAME;
const clientDefaultVersion = process.env.VUE_APP_VERSION;

const clientLocalStorageName = 'client-storage';
const apiUrl = process.env.VUE_APP_SERVER_API_BASE_URL;

const defaultUsername = 'guest';

export default {
  namespaced: true,

  state: {
    title: clientDefaultTitle,
    version: clientDefaultVersion,

    sync: {
      status: false,
      session: '',
      mode: ''
    },

    account: {
      username: defaultUsername,
      token: null
    },

    snakeAutostart: false
  },

  mutations: {
    TITLE_SET(state, title) {
      state.title = title;
    },

    TITLE_RESET(state) {
      state.title = clientDefaultTitle;
    },

    VERSION_SET(state, version) {
      state.version = version;
    },

    VERSION_RESET(state) {
      state.version = clientDefaultVersion;
    },

    SYNC_SET(state, data) {
      state.sync = data;
    },

    ACCOUNT_SET(state, data) {
      if (!data) {
        data = {username: defaultUsername, token: null};
      }
      state.account = data;
    }
  },

  actions: {
    /**
     * Load client customizations from local storage
     *
     * @param state
     * @param commit
     */
    storageLoad({ commit }) {
      if (localStorage.getItem(clientLocalStorageName)) {
        try {
          let clientData = JSON.parse(localStorage.getItem(clientLocalStorageName));

          commit('TITLE_SET', clientData.title);
          commit('VERSION_SET', clientData.version);
          commit('ACCOUNT_SET', clientData.account);
        } catch (e) {
          localStorage.removeItem(clientLocalStorageName);
        }
      }
    },

    /**
     * Save client customizations in local storage
     *
     * @param state
     */
    storageSave({ state }) {
      let clientData = {
        title: state.title,
        version: state.version,
        account: state.account,
        snakeAutostart: state.snakeAutostart,
      };

      // save in local storage
      localStorage.setItem(clientLocalStorageName, JSON.stringify(clientData));
    },

    /**
     * Login user
     *
     * @param commit
     * @param dispatch
     * @param data
     * @returns {Promise<any>}
     */
    doLogin({ commit, dispatch }, data) {
      return new Promise((resolve, reject) => {
        axios
          .post(apiUrl + 'auth/login', {username: data.username, password: data.password})
          .then(response => {
            commit('core/ACCOUNT_SET', {username: response.data.username, token: response.data.token});
            dispatch('storageSave');

            resolve(response.data);
          })
          .catch(() => {
            commit('core/ACCOUNT_SET');
            dispatch('storageSave');

            reject();
          });
      });
    },

    /**
     * Check user token
     *
     * @param state
     * @param commit
     * @param dispatch
     * @param data
     * @returns {Promise<any>}
     */
    doCheckToken({ state, commit, dispatch }) {
      const token = state.account.token;

      return new Promise((resolve, reject) => {
        axios
          .post(apiUrl + 'auth/check', {token: token})
          .then(() => {
            resolve();
          })
          .catch(() => {
            commit('core/ACCOUNT_SET');
            dispatch('storageSave');

            reject();
          });
      });
    },

    /**
     * Logout
     *
     * @param commit
     * @param dispatch
     */
    doLogout({ commit, dispatch }) {
      commit('core/ACCOUNT_SET');
      dispatch('storageSave');
    }
  }
};
