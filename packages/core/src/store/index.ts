import { createStore } from 'vuex'

import storeClientModule from './modules/storeClient'
import storeModulesAppModule from './modules/storeModulesApp'
import storeFullscreenModule from './modules/storeFullscreen'
import storeNotificationModule from './modules/storeNotification'
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

export const storeFullScreen = new storeFullscreenModule({ store, name: 'core/fullscreen' })
export const storeNotification = new storeNotificationModule({ store, name: 'core/notification' })
export const storeSse = new storeSseModule({ store, name: 'core/sse' })
export const storeModulesApp = new storeModulesAppModule({ store, name: 'core/modules' })
export const storeWindowFocus = new storeWindowFocusModule( { store, name: 'core/windowFocus' })
export const storeWindowCategory = new storeWindowCategoryModule(storeModulesApp, { store, name: 'core/windowCategory' })
export const storeWindowDock = new storeWindowDockModule(storeModulesApp, { store, name: 'core/windowDock' })
export const storeWindow = new storeWindowModule(storeModulesApp, storeFullScreen, storeWindowFocus, storeWindowDock, { store, name: 'core/window' })
export const storeClient = new storeClientModule(storeSse, storeWindowDock, storeWindow, { store, name: 'core/client' })

export default store

export const owdCreateStore = function() {
  return store
}

export function useStore() {
  return store
}