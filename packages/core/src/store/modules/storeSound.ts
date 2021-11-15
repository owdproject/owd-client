import {Module, Mutation, Action, VuexModule} from "vuex-class-modules";
import {loadStorage, saveStorage} from "../../helpers/helperStorage";

@Module
export default class StoreSound extends VuexModule {
  private sound: any = {
    masterVolume: 50
  }

  get masterVolume() {
    return this.sound.masterVolume
  }

  @Mutation
  SET_SOUND(sound: any) {
    this.sound = sound
  }

  /**
   * Load sound status from local storage
   */
  @Action
  initialize() {
    const sound = loadStorage('sound')

    if (sound) {
      this.SET_SOUND(sound)
    }
  }

  /**
   * Set sound master
   *
   * @param value
   */
  @Action
  async setMasterVolume(value: number) {
    this.SET_SOUND({
      ...this.sound,
      masterVolume: value
    })

    // update sound storage
    await this.save()
  }

  /**
   * Update sound storage
   */
  @Action
  save() {
    saveStorage('sound', this.sound)
  }
}