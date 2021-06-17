import {VuexModule, Module, Mutation, Action, RegisterOptions} from "vuex-class-modules";

import SseModule from "./storeSse";
import WindowDockModule from "./window/storeWindowDock";
import WindowModule from "./window/storeWindow";

const clientDefaultTitle = import.meta.env.VITE_NAME || ''
const clientVersion = import.meta.env.VITE_VERSION || '2.0.0'
const clientWebsite = import.meta.env.VITE_WEBSITE || 'owdproject.com'

@Module
export default class ClientVuexModule extends VuexModule {
  private readonly storeSseModule: SseModule
  private readonly storeWindowDock: WindowDockModule
  private readonly storeWindow: WindowModule

  // client title
  public title: string = clientDefaultTitle

  // client version
  public version: string = clientVersion

  // client website
  public website: string = clientWebsite

  constructor(
    storeSseModule: SseModule,
    storeWindowDock: WindowDockModule,
    storeWindow: WindowModule,
    options: RegisterOptions
  ) {
    super(options);
    this.storeSseModule = storeSseModule
    this.storeWindowDock = storeWindowDock
    this.storeWindow = storeWindow
  }

  @Mutation
  TITLE_SET(title: string) {
    this.title = title
  }

  @Mutation
  TITLE_RESET() {
    this.title = clientDefaultTitle
  }

  @Mutation
  VERSION_SET(version: string) {
    this.version = version
  }

  @Action
  async initialize() {
    console.log('[OWD] App initialized')

    this.storeSseModule.initialize()
    this.storeWindow.initialize()
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
