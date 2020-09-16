import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

// VUEX INIT
import storeClient from './client'
import storeWindows from './windows'
import storeNotification from './notification'
import storeSse from './sse'
import storeDebug from './debug'

export default new Vuex.Store({
  modules: {
    core: {
      namespaced: true,
      modules: {
        client: storeClient,
        windows: storeWindows,
        notification: storeNotification,
        sse: storeSse,
        debug: storeDebug
      }
    }
  }
});
