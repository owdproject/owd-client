import {VuexModule, Module, Mutation} from "vuex-class-modules";
import {OwdNotificationItem} from "@owd-client/types";

@Module
export default class StoreNotification extends VuexModule {
  private items: OwdNotificationItem[] = []

  /**
   * Get notification list
   */
  get list() {
    return this.items
  }

  @Mutation
  ADD(notification: OwdNotificationItem) {
    // add date if missing
    if (!notification.date) {
      notification.date = new Date()
    }

    this.items.unshift({
      ...notification
    })
  }

  @Mutation
  REMOVE(notification: OwdNotificationItem) {
    const index = this.items.indexOf(notification)

    if (index > -1) {
      this.items.splice(index, 1)
    }
  }

  @Mutation
  RESET() {
    this.items = []
  }
}
