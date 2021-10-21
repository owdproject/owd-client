import {VuexModule, Module, Action, RegisterOptions} from "vuex-class-modules";

import SseModule from "./storeSse";
import WindowModule from "./window/storeWindow";
import BackgroundModule from "./storeBackground";
import SoundModule from "./storeSound";

@Module
export default class StoreClient extends VuexModule {
  private readonly storeSse: SseModule
  private readonly storeWindow: WindowModule
  private readonly storeBackground: BackgroundModule
  private readonly storeSound: SoundModule

  constructor(
    storeSse: SseModule,
    storeWindow: WindowModule,
    storeBackground: BackgroundModule,
    storeSound: SoundModule,
    options: RegisterOptions
  ) {
    super(options);
    this.storeSse = storeSse
    this.storeWindow = storeWindow
    this.storeBackground = storeBackground
    this.storeSound = storeSound
  }

  @Action
  async initialize() {
    this.storeSse.initialize()
    this.storeWindow.initialize()
    this.storeBackground.initialize()
    this.storeSound.initialize()
  }

  /**
   * Wipe all data, restore default client settings
   */
  @Action
  reset(reload: boolean) {
    localStorage.clear();
    sessionStorage.clear();

    if (reload) window.location.reload()
  }
}
