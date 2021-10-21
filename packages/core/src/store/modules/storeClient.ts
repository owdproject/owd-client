import {VuexModule, Module, Action, RegisterOptions} from "vuex-class-modules";

import SseModule from "./storeSse";
import WindowModule from "./window/storeWindow";
import BackgroundModule from "./storeBackground";

@Module
export default class StoreClient extends VuexModule {
  private readonly storeSseModule: SseModule
  private readonly storeWindowModule: WindowModule
  private readonly storeBackgroundModule: BackgroundModule

  constructor(
    storeSseModule: SseModule,
    storeWindow: WindowModule,
    storeBackground: BackgroundModule,
    options: RegisterOptions
  ) {
    super(options);
    this.storeSseModule = storeSseModule
    this.storeWindowModule = storeWindow
    this.storeBackgroundModule = storeBackground
  }

  @Action
  async initialize() {
    this.storeSseModule.initialize()
    this.storeWindowModule.initialize()
    this.storeBackgroundModule.initialize()
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
