import { createStore } from 'vuex'

import storeDebugModule from './modules/storeDebug'
import storeClientModule from './modules/storeClient'
import storeFullscreenModule from './modules/storeFullscreen'
import storeNotificationModule from './modules/storeNotification'
import storeModulesModule from './modules/storeModules'
import storeWindowModule from './modules/window/storeWindow'
import storeWindowCategoryModule from './modules/window/storeWindowCategory'
import storeWindowDockModule from './modules/window/storeWindowDock'
import storeWindowFocusModule from './modules/window/storeWindowFocus'
import storeSseModule from './modules/storeSse'

const store = createStore({
  devtools: true,
  modules: {
    core: {
      namespaced: true,
      modules: {}
    }
  }
})

export const storeDebug = new storeDebugModule({ store, name: 'core/debug' })
export const storeClient = new storeClientModule(storeDebug, { store, name: 'core/client' })
export const storeFullScreen = new storeFullscreenModule({ store, name: 'core/fullscreen' })
export const storeNotification = new storeNotificationModule({ store, name: 'core/notification' })
export const storeSse = new storeSseModule({ store, name: 'core/sse' })
export const storeModules = new storeModulesModule({ store, name: 'core/modules' })
export const storeWindowFocus = new storeWindowFocusModule( { store, name: 'core/windowFocus' })
export const storeWindowCategory = new storeWindowCategoryModule(storeModules, { store, name: 'core/windowCategory' })
export const storeWindowDock = new storeWindowDockModule(storeModules, { store, name: 'core/windowDock' })
export const storeWindow = new storeWindowModule(storeDebug, storeModules, storeFullScreen, storeWindowFocus, storeWindowDock, { store, name: 'core/window' })

export default store

export const owdCreateStore = function() {
  return store
}

export function useStore() {
  return store
}