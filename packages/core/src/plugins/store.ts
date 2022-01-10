import { createStore } from 'vuex'
import {OwdCoreContext} from "@owd-client/types";

import storeClientModule from '../store/storeClient'
import storeFullscreenModule from '../store/window/storeWindowFullscreen'
import storeLauncherModule from '../store/storeLauncher'
import storeNotificationModule from '../store/storeNotification'
import storeBackgroundModule from '../store/storeBackground'
import storeSoundModule from '../store/storeSound'
import storeWorkspaceModule from '../store/storeWorkspace'
import storeSseModule from '../store/storeSse'
import storeWindowModule from '../store/window/storeWindow'
import storeWindowDockModule from '../store/storeDock'
import storeWindowFocusModule from '../store/window/storeWindowFocus'

/**
 * Initialize vuex store
 *
 * @param context
 */
export function initializeStore(context: OwdCoreContext) {
  const config = context.config.store || {
    strict: false,
    devtools: false
  }

  const store = createStore({
    strict: config.strict,
    devtools: config.devtools,
    modules: {
      // core store modules
      core: {
        namespaced: true,
        modules: {}
      },
      // load additional vuex modules
      // defined in app/client.extensions.ts
      ...context.extensions.store
    }
  })

  // initialize core modules
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

  const storeClient = new storeClientModule(
    storeSse, storeWindow, storeBackground,
    storeSound, storeWorkspace, storeDock,
    storeLauncher,
    { store, name: 'core/client' }
  )

  // initialize store
  context.app.use(store)

  return store
}