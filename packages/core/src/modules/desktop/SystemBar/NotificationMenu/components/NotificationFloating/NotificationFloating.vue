<template>
  <div class="owd-desktop__floating-notifications">
    <ul v-if="notifications.length > 0">
      <li v-for="(notification, key) in notifications" :key="key">
        <Notification :notification="notification" />
      </li>
    </ul>
  </div>
</template>

<script setup>
import Notification from "./Notification";

import {getCurrentInstance, ref} from "vue";
import {useStore} from "vuex";

const app = getCurrentInstance();
const store = useStore()

const owdConfig = app.appContext.config.owd
const notificationMenuOptions = owdConfig.desktop.SystemBar.options.modules.NotificationMenu

let notifications = ref([])

store.subscribe((mutation) => {
  if (mutation.type === `core/notification/ADD`) {
    const notification = mutation.payload

    notifications.value.push(notification)

    // remove other notifications if max allowed is X
    if (notifications.value.length > notificationMenuOptions.floatingNotification.max) {
      notifications.value.shift()
    }

    // remove after X seconds
    setTimeout(
        () => notifications.value.shift(),
        notification.duration || notificationMenuOptions.floatingNotification.duration
    )
  }
})
</script>

<style scoped lang="scss">
.owd-desktop__floating-notifications {
  position: absolute;
  top: 50px;
  left: 50%;
  width: 338px;
  transform: translateX(-50%);
  z-index: 99;

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;

    li {
      margin-bottom: 12px;
    }
  }
}
</style>