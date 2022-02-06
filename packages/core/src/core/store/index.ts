import {createStore, Store} from 'vuex'

import storeClientModule from '../../store/storeClient'
import storeFullscreenModule from '../../store/window/storeWindowFullscreen'
import storeLauncherModule from '../../store/storeLauncher'
import storeNotificationModule from '../../store/storeNotification'
import storeBackgroundModule from '../../store/storeBackground'
import storeSoundModule from '../../store/storeSound'
import storeWorkspaceModule from '../../store/storeWorkspace'
import storeSseModule from '../../store/storeSse'
import storeWindowModule from '../../store/window/storeWindow'
import storeWindowDockModule from '../../store/storeDock'
import storeWindowFocusModule from '../../store/window/storeWindowFocus'
import CoreModule from "../core.module";

export default class CoreStore extends CoreModule {
  private readonly instance: Store<any>

  constructor(ctx) {
    super(ctx)

    const config = this.config.store || {
      strict: false,
      devtools: false
    }

    this.instance = createStore({
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
        ...this.extensions.store
      }
    })

    // initialize core modules
    const storeDock = new storeWindowDockModule({ store: this.instance, name: 'core/dock' })
    const storeLauncher = new storeLauncherModule({ store: this.instance, name: 'core/launcher' })
    const storeNotification = new storeNotificationModule({ store: this.instance, name: 'core/notification' })
    const storeBackground = new storeBackgroundModule({ store: this.instance, name: 'core/background' })
    const storeSound = new storeSoundModule({ store: this.instance, name: 'core/sound' })
    const storeWorkspace = new storeWorkspaceModule({ store: this.instance, name: 'core/workspace' })
    const storeSse = new storeSseModule({ store: this.instance, name: 'core/sse' })

    const storeWindowFocus = new storeWindowFocusModule( { store: this.instance, name: 'core/windowFocus' })
    const storeWindowFullscreen = new storeFullscreenModule({ store: this.instance, name: 'core/windowFullscreen' })
    const storeWindow = new storeWindowModule(storeWindowFocus, { store: this.instance, name: 'core/window' })

    const storeClient = new storeClientModule(
        storeSse, storeWindow, storeBackground,
        storeSound, storeWorkspace, storeDock,
        storeLauncher,
        { store: this.instance, name: 'core/client' }
    )

    // initialize store
    this.app.use(this.instance)

    return this.instance
  }
}