import {VuexModule, Module, Mutation} from "vuex-class-modules";

interface StoreNotificationItem {
  name: string;
  service: string;
  icon: string;
  color: string;
  title: string;
  details: string;
  sticky?: boolean;
  duration: number;
  date: Date;
}

@Module
export default class StoreNotification extends VuexModule {
  private items: StoreNotificationItem[] = []

  get list() {
    return this.items
  }

  @Mutation
  ADD(notification: StoreNotificationItem) {
    // add date if missing
    if (!notification.date) {
      notification.date = new Date()
    }

    this.items.unshift({
      ...notification
    })
  }

  @Mutation
  REMOVE(notification: StoreNotificationItem) {
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
