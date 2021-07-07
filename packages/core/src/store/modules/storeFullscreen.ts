import {VuexModule, Module, Mutation, Action, RegisterOptions} from "vuex-class-modules";

@Module
export default class StoreFullscreen extends VuexModule {
  private fullscreen: boolean = false

  get active() {
    return this.fullscreen
  }

  @Mutation
  SET_FULLSCREEN_MODE(value: boolean) {
    this.fullscreen = value
  }
}
