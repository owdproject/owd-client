import {Module, Mutation, Action, VuexModule} from "vuex-class-modules";
import {loadStorage, saveStorage} from "../helpers/helperStorage";

@Module
export default class StoreBackground extends VuexModule {
  private background: any = {
    color: '',
    image: '',
    size: ''
  }

  get backgroundColor() {
    return this.background.color
  }

  get backgroundImage() {
    return this.background.image
  }

  get backgroundSize() {
    return this.background.size
  }

  @Mutation
  SET_BACKGROUND(background: any) {
    this.background = background
  }

  /**
   * Load background status from local storage
   */
  @Action
  initialize() {
    const background = loadStorage('background')

    if (background) {
      this.SET_BACKGROUND(background)
    }
  }

  /**
   * Set background color
   *
   * @param color
   */
  @Action
  async setBackgroundColor(color: string) {
    this.SET_BACKGROUND({
      ...this.background,
      color
    })

    // update background storage
    await this.save()
  }

  /**
   * Set background image
   *
   * @param image
   */
  @Action
  async setBackgroundImage(image: string) {
    this.SET_BACKGROUND({
      ...this.background,
      image
    })

    // update background storage
    await this.save()
  }

  /**
   * Set background size
   *
   * @param size
   */
  @Action
  async setBackgroundSize(size: string) {
    this.SET_BACKGROUND({
      ...this.background,
      size
    })

    // update background storage
    await this.save()
  }

  /**
   * Update background storage
   */
  @Action
  save() {
    saveStorage('background', this.background)
  }
}