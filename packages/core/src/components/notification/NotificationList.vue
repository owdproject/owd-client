<template>
  <div id="notifications">
    <ul>
      <li v-for="(notification, key) in notifications" :key="key">
        <Notification
          :name="notification.name"
          :service="notification.service"
          :icon="notification.icon"
          :text="notification.text"
          :details="notification.details"
        />
      </li>
    </ul>
  </div>
</template>

<script>
import {mapGetters} from "vuex";
import Notification from './NotificationDetails'

export default {
  name: 'NotificationList',
  components: {Notification},
  computed: {
    ...mapGetters({
      notifications: 'core/notification/list'
    })
  }
}
</script>

<style lang="scss">
  #notifications {
    position: fixed;
    top: 24px;
    right: 22px;
    z-index: 10;
    pointer-events: none;

    ul {
      margin: 0;
      padding: 0;
      list-style-type: none;

      li {
        margin-bottom: 12px;
      }
    }
  }
</style>
