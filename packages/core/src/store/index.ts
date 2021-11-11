import { Store, createStore } from 'vuex'
import {OwdCoreStoreContext} from "@owd-client/types";

import storeClientModule from './modules/storeClient'
import storeFullscreenModule from './modules/window/storeWindowFullscreen'
import storeLauncherModule from './modules/storeLauncher'
import storeNotificationModule from './modules/storeNotification'
import storeBackgroundModule from './modules/storeBackground'
import storeSoundModule from './modules/storeSound'
import storeWorkspaceModule from './modules/storeWorkspace'
import storeSseModule from './modules/storeSse'
import storeWindowModule from './modules/window/storeWindow'
import storeWindowDockModule from './modules/storeDock'
import storeWindowFocusModule from './modules/window/storeWindowFocus'

let store: Store<any>

/**
 * Initialize OWD vuex store
 */
export function initializeAppStore(context: OwdCoreStoreContext) {
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


  const storeDock = new storeWindowDockModule({ store, name: 'core/dock' })
  const storeLauncher = new storeLauncherModule({ store, name: 'core/launcher' })
  const storeNotification = new storeNotificationModule({ store, name: 'core/notification' })
  const storeBackground = new storeBackgroundModule({ store, name: 'core/background' })
  const storeSound = new storeSoundModule({ store, name: 'core/sound' })
  const storeWorkspace = new storeWorkspaceModule({ store, name: 'core/workspace' })
  const storeSse = new storeSseModule({ store, name: 'core/sse' })

  const storeWindowFocus = new storeWindowFocusModule( { store, name: 'core/windowFocus' })
  const storeWindowFullscreen = new storeFullscreenModule({ store, name: 'core/windowFullscreen' })
  const storeWindow = new storeWindowModule(storeWindowFocus, { store, name: 'core/window' })

  const storeClient = new storeClientModule(storeSse, storeWindow, storeBackground, storeSound, storeWorkspace,{ store, name: 'core/client' })

  // install as vue plugin
  context.app.use(store)

  return store
}