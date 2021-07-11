import {VuexModule, Module, Mutation, Action, RegisterOptions} from "vuex-class-modules";

import SseModule from "./storeSse";
import WindowModule from "./window/storeWindow";

const clientDefaultTitle = import.meta.env.VITE_NAME || ''
const clientVersion = import.meta.env.VITE_VERSION || '2.0.0'
const clientWebsite = import.meta.env.VITE_WEBSITE || 'owdproject.com'

@Module
export default class StoreClient extends VuexModule {
  private readonly storeSseModule: SseModule
  private readonly storeWindow: WindowModule

  // client title
  public title: string = clientDefaultTitle

  // client version
  public version: string = clientVersion

  // client website
  public website: string = clientWebsite

  constructor(
    storeSseModule: SseModule,
    storeWindow: WindowModule,
    options: RegisterOptions
  ) {
    super(options);
    this.storeSseModule = storeSseModule
    this.storeWindow = storeWindow
  }

  @Mutation
  SET_TITLE(title: string) {
    this.title = title
  }

  @Mutation
  RESET_TITLE() {
    this.title = clientDefaultTitle
  }

  @Mutation
  SET_VERSION(version: string) {
    this.version = version
  }

  @Action
  async initialize() {
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
