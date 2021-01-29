<template>
  <div class="floating-notifications">
    <ul v-if="notifications.length > 0">
      <li v-for="(notification, key) in notifications" :key="key">
        <Notification :notification="notification" />
      </li>
    </ul>
  </div>
</template>

<script>
import Notification from "./Notification";

import {getCurrentInstance, ref} from "vue";
import {useStore} from "vuex";

export default {
  components: {
    Notification
  },
  setup() {
    const app = getCurrentInstance();
    const store = useStore()
    const options = app.appContext.config.owd.desktop.SystemBar.options.modules.NotificationMenu

    let notifications = ref([])

    store.subscribe((mutation) => {
      if (mutation.type === `core/notification/ADD`) {
        notifications.value.push(mutation.payload)

        // remove other notifications if max allowed is X
        if (notifications.value.length > options.floatingNotification.max) {
          notifications.value.shift()
        }

        // remove after X seconds
        setTimeout(() => notifications.value.shift(), options.floatingNotification.duration)
      }
    })

    return {
      notifications
    }
  }
}
</script>

<style scoped lang="scss">
.floating-notifications {
  position: absolute;
  top: 50px;
  left: 50%;
  width: 338px;
  transform: translateX(-50%);
  z-index: 9999;

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