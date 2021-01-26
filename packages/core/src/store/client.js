import axios from 'axios'

const clientDefaultTitle = process.env.VUE_APP_NAME
const clientDefaultVersion = process.env.VUE_APP_VERSION

const clientLocalStorageName = 'client-storage'
const apiUrl = process.env.VUE_APP_SERVER_API_BASE_URL

const defaultUsername = 'guest'

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
      state.title = title
    },

    TITLE_RESET(state) {
      state.title = clientDefaultTitle
    },

    VERSION_SET(state, version) {
      state.version = version
    },

    VERSION_RESET(state) {
      state.version = clientDefaultVersion
    },

    SYNC_SET(state, data) {
      state.sync = data
    },

    ACCOUNT_SET(state, data) {
      if (!data) {
        data = {username: defaultUsername, token: null}
      }
      state.account = data
    }
  },

  actions: {
    async initialize({commit, dispatch}) {
      commit('core/debug/LOG', 'App initialized', {root: true})

      // # VUEX WINDOWS INIT

      // load windows positions from local storage
      await dispatch('core/windows/initialize', null, {root: true})

      // load client customization
      // todo improve or remove
      // await dispatch('storageLoad');
    },

    /**
     * Load client customizations from local storage
     *
     * @param state
     * @param commit
     */
    storageLoad({ commit }) {
      if (localStorage.getItem(clientLocalStorageName)) {
        try {
          const clientData = JSON.parse(localStorage.getItem(clientLocalStorageName))

          commit('TITLE_SET', clientData.title)
          commit('VERSION_SET', clientData.version)
          commit('ACCOUNT_SET', clientData.account)
        } catch (e) {
          localStorage.removeItem(clientLocalStorageName)
        }
      }
    },

    /**
     * Save client customizations in local storage
     *
     * @param state
     */
    storageSave({ state }) {
      const clientData = {
        title: state.title,
        version: state.version,
        account: state.account,
        snakeAutostart: state.snakeAutostart
      }

      // save in local storage
      localStorage.setItem(clientLocalStorageName, JSON.stringify(clientData))
    },

    /**
     * Wipe all data, restore default client settings
     */
    reset({dispatch}, reload) {
      localStorage.clear();
      sessionStorage.clear();
      dispatch('core/windows/resetWindowsStorage', null, {root: true})

      if (reload) window.location.reload()
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
            commit('core/ACCOUNT_SET', {username: response.data.username, token: response.data.token})
            dispatch('storageSave')

            resolve(response.data)
          })
          .catch(() => {
            commit('core/ACCOUNT_SET')
            dispatch('storageSave')

            reject()
          })
      })
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
      const token = state.account.token

      return new Promise((resolve, reject) => {
        axios
          .post(apiUrl + 'auth/check', {token: token})
          .then(() => {
            resolve()
          })
          .catch(() => {
            commit('core/ACCOUNT_SET')
            dispatch('storageSave')

            reject()
          })
      })
    },

    /**
     * Logout
     *
     * @param commit
     * @param dispatch
     */
    doLogout({ commit, dispatch }) {
      commit('core/ACCOUNT_SET')
      dispatch('storageSave')
    }
  }
}
