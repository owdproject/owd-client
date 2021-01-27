<template>
  <div class="notification-list">
    <div class="notification-list-container">

      <ul v-if="notifications.length > 0">
        <li v-for="(notification, key) in notifications" :key="key">
          <Notification :notification="notification" />
        </li>
      </ul>

      <div class="notification-list-empty" v-else>

        <v-icon>mdi-bell</v-icon>
        <div>
          No notifications
        </div>

      </div>

    </div>
    <div class="notification-list-action" v-if="notifications.length > 0">
      <button @click="$store.commit('core/notification/RESET')">Clear</button>
    </div>
  </div>
</template>

<script>
  import Notification from "./Notification";
  import {computed} from "vue";
  import {useStore} from "vuex";

  export default {
    components: {Notification},
    setup() {
      const store = useStore()

      const notifications = computed(() => store.getters['core/notification/list'])

      return {
        notifications
      }
    }
  }
</script>

<style scoped lang="scss">
.notification-list {
  display: grid;
  grid-template-rows: calc(100% - 32px) 32px;

  .notification-list-container {
    max-height: 385px;
    overflow-y: auto;

    &::-webkit-scrollbar,
    &::-webkit-scrollbar-thumb {
      width: 0;
      background: transparent;
    }

    ul {
      list-style-type: none;
      margin: 0;
      padding: 0;

      li:not(:last-child) {
        margin-bottom: 12px;
      }
    }

    .notification-list-empty {
      min-height: 100%;
    }
  }

  .notification-list-action {
    text-align: right;
  }
}
</style>