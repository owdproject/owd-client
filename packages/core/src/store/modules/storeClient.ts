import {VuexModule, Module, Mutation, Action, RegisterOptions} from "vuex-class-modules";

import SseModule from "./storeSse";
import WindowModule from "./window/storeWindow";

@Module
export default class StoreClient extends VuexModule {
  private readonly storeSseModule: SseModule
  private readonly storeWindowModule: WindowModule

  constructor(
    storeSseModule: SseModule,
    storeWindow: WindowModule,
    options: RegisterOptions
  ) {
    super(options);
    this.storeSseModule = storeSseModule
    this.storeWindowModule = storeWindow
  }

  @Action
  async initialize() {
    this.storeSseModule.initialize()
    this.storeWindowModule.initialize()
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
