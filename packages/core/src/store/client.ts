import {VuexModule, Module, Mutation, Action, RegisterOptions} from "vuex-class-modules";
import DebugModule from "./debug";

const clientLocalStorageName = 'client-storage'
const clientDefaultTitle = process.env.VUE_APP_NAME

@Module
export default class ClientModule extends VuexModule {
  private readonly debugModule: DebugModule

  // client title
  private title: string = clientDefaultTitle

  // client version
  private version: string = process.env.VUE_APP_VERSION

  constructor(
    debugModule: DebugModule,
    options: RegisterOptions
  ) {
    super(options);
    this.debugModule = debugModule
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
    this.debugModule.LOG('App initialized')

    // load windows positions from local storage
    // await dispatch('core/windows/initialize', null, {root: true})
  }

  /**
   * Save client datay in local storage
   */
  @Action
  storageSave(data: any) {
    /*
    const clientData = {
      title: this.title,
      account: this.authModule.loggedUser
    }

     */
    localStorage.setItem(clientLocalStorageName, JSON.stringify(data))
  }

  /**
   * Wipe all data, restore default client settings
   */
  @Action
  reset(reload: boolean) {
    localStorage.clear();
    sessionStorage.clear();
    // dispatch('core/windows/resetWindowsStorage', null, {root: true})

    if (reload) window.location.reload()
  }
}
