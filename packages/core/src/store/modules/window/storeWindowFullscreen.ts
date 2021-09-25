import {VuexModule, Module, Mutation} from "vuex-class-modules";

@Module
export default class StoreWindowFullscreen extends VuexModule {
  private fullscreen: boolean = false

  get active() {
    return this.fullscreen
  }

  @Mutation
  SET_FULLSCREEN_MODE(value: boolean) {
    this.fullscreen = value
  }
}
