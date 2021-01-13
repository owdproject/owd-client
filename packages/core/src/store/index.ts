import { createStore } from 'vuex'

// VUEX INIT
import storeDebugModule from './debug'
import storeAuthModule from './auth'
import storeClientModule from './client'
import storeFullScreenModule from './fullscreen'
import storeNotificationModule from './notification'
import storeSseModule from './sse'
import storeModulesModule from './modules'
import storeWindowFocusModule from './window/windowFocus'
import storeWindowModule from './window/window'


const store = createStore({
  modules: {
    core: {
      namespaced: true,
      modules: {}
    }
  }
})

export const storeDebug = new storeDebugModule({ store, name: 'core/debug' })
export const storeAuth = new storeAuthModule({ store, name: 'core/auth' })
export const storeClient = new storeClientModule(storeDebug, { store, name: 'core/client' })
export const storeFullScreen = new storeFullScreenModule({ store, name: 'core/fullscreen' })
export const storeNotification = new storeNotificationModule({ store, name: 'core/notification' })
export const storeSse = new storeSseModule({ store, name: 'core/sse' })
export const storeModules = new storeModulesModule({ store, name: 'core/modules' })
export const storeWindowFocus = new storeWindowFocusModule( { store, name: 'core/windowFocus' })
export const storeWindow = new storeWindowModule(storeDebug, storeModules, storeFullScreen, storeWindowFocus, { store, name: 'core/window' })

export default store

export const owdCreateStore = function() {
  return store
}

export function useStore() {
  return store
}