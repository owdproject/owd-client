import {VuexModule, Module, Action, RegisterOptions} from "vuex-class-modules";

import SseModule from "./storeSse";
import WindowModule from "./window/storeWindow";
import BackgroundModule from "./storeBackground";
import SoundModule from "./storeSound";
import WorkspaceModule from "./storeWorkspace";

@Module
export default class StoreClient extends VuexModule {
  private readonly storeSse: SseModule
  private readonly storeWindow: WindowModule
  private readonly storeBackground: BackgroundModule
  private readonly storeSound: SoundModule
  private readonly storeWorkspace: WorkspaceModule

  constructor(
    storeSse: SseModule,
    storeWindow: WindowModule,
    storeBackground: BackgroundModule,
    storeSound: SoundModule,
    storeWorkspace: WorkspaceModule,
    options: RegisterOptions
  ) {
    super(options);
    this.storeSse = storeSse
    this.storeWindow = storeWindow
    this.storeBackground = storeBackground
    this.storeSound = storeSound
    this.storeWorkspace = storeWorkspace
  }

  @Action
  async initialize() {
    await this.storeSse.initialize()
    await this.storeWindow.initialize()
    await this.storeBackground.initialize()
    await this.storeSound.initialize()
    await this.storeWorkspace.initialize()
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
