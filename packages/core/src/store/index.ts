import { Store, createStore } from 'vuex'
import {OwdCoreStoreContext} from "@owd-client/types";

import storeClientModule from './modules/storeClient'
import storeModulesAppModule from './modules/storeModulesApp'
import storeFullscreenModule from './modules/storeFullscreen'
import storeNotificationModule from './modules/storeNotification'
import storeWindowModule from './modules/window/storeWindow'
import storeWindowCategoryModule from './modules/window/storeWindowCategory'
import storeWindowDockModule from './modules/window/storeWindowDock'
import storeWindowFocusModule from './modules/window/storeWindowFocus'
import storeSseModule from './modules/storeSse'

let store: Store<any>

/**
 * Initialize OWD vuex store
 */
export function initializeDesktopStore(context: OwdCoreStoreContext) {
  const config = context.app.config.globalProperties.$owd.store || {
    strict: false,
    devtools: false
  }

  store = createStore({
    strict: config.strict,
    devtools: config.devtools,
    modules: {
      core: {
        namespaced: true,
        modules: {}
      },
      // load additional vuex modules
      // defined in app/client.extensions.ts
      ...context.modules
    }
  })

  const storeFullScreen = new storeFullscreenModule({ store, name: 'core/fullscreen' })
  const storeNotification = new storeNotificationModule({ store, name: 'core/notification' })
  const storeSse = new storeSseModule({ store, name: 'core/sse' })
  const storeModulesApp = new storeModulesAppModule({ store, name: 'core/modulesApp' })
  const storeWindowFocus = new storeWindowFocusModule( { store, name: 'core/windowFocus' })
  const storeWindowCategory = new storeWindowCategoryModule(storeModulesApp, { store, name: 'core/windowCategory' })
  const storeWindowDock = new storeWindowDockModule({ store, name: 'core/windowDock' })
  const storeWindow = new storeWindowModule(storeModulesApp, storeFullScreen, storeWindowFocus, storeWindowDock, { store, name: 'core/window' })
  const storeClient = new storeClientModule(storeSse, storeWindowDock, storeWindow, { store, name: 'core/client' })

  // install as vue plugin
  context.app.use(store)

  return store
}

export function useDesktopStore() {
  return store
}