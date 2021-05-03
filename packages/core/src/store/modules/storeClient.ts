import {VuexModule, Module, Mutation, Action, RegisterOptions} from "vuex-class-modules";

import SseModule from "./storeSse";
import WindowDockModule from "./window/storeWindowDock";
import WindowModule from "./window/storeWindow";

const clientLocalStorageName = 'client-storage'

const clientDefaultTitle = process.env.VUE_APP_NAME || ''
const clientVersion = process.env.VUE_APP_VERSION || '2.0.0'
const clientWebsite = process.env.VUE_APP_WEBSITE || 'owdproject.com'

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

  @Action
  async initialize() {
    console.log('[OWD] App initialized')

    this.storeSseModule.initialize()
    this.storeWindowDock.initialize()
    this.storeWindow.initialize()
  }

  /**
   * Save client datay in local storage
   */
  @Action
  storageSave(data: any) {
    localStorage.setItem(clientLocalStorageName, JSON.stringify(data))
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
