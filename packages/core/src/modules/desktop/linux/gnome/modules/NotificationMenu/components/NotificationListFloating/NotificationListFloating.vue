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
import Notification from "./Notification.vue";

import {ref, inject} from "vue";
import {useStore} from "vuex";

const desktopOptions = inject('desktopOptions')

const store = useStore()

let notificationsQueue = ref([])
let notifications = ref([])

let showNextNotificationTimeout = null

store.subscribe((mutation) => {
  if (mutation.type === `core/notification/ADD`) {
    const notification = mutation.payload

    notificationsQueue.value.push(notification)

    if (notificationsQueue.value.length === 1) {
      showNextNotification()
    }
  }
})

function showNextNotification() {
  // clear previous timeout
  clearTimeout(showNextNotificationTimeout)

  // set timeout to show the first notification in queue
  showNextNotificationTimeout = setTimeout(() => {

    if (notificationsQueue.value.length > 0) {
      const nextNotification = notificationsQueue.value[0]

      // show first notification
      notifications.value.push(nextNotification)

      // run delayed callback
      if (typeof nextNotification.callback === 'function') {
        nextNotification.callback()
      }

      setTimeout(
          () => {
            // remove active notification after X seconds
            notifications.value.shift()
            // remove notification from queue
            notificationsQueue.value.shift()
            // show next notification
            showNextNotification()
          },
          nextNotification.duration || desktopOptions.NotificationMenu.floatingNotification.duration
      )
    }

  }, 1000)
}
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