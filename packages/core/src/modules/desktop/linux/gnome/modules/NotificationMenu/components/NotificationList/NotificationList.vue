<template>
  <div class="notification-list">
    <div class="notification-list__container">

      <div class="notification-list__container__inner">
        <ul v-if="notifications.length > 0">
          <li v-for="(notification, key) in notifications" :key="key">
            <Notification :notification="notification" />
          </li>
        </ul>

        <div class="notification-list__empty" v-else>

          <v-icon class="mb-5">mdi-bell</v-icon>
          <div v-text="$t('desktop.SystemBar.NotificationMenu.notificationsEmpty')" />

        </div>
      </div>

    </div>
    <div class="notification-list__action" v-if="notifications.length > 0">
      <v-btn
          @click="$store.commit('core/notification/RESET')"
          v-text="$t('desktop.SystemBar.NotificationMenu.clear')"
      />
    </div>
  </div>
</template>

<script setup>
  import Notification from "./Notification.vue";
  import {computed} from "vue";
  import {useStore} from "vuex";

  const store = useStore()

  const notifications = computed(() => store.getters['core/notification/list'])
</script>

<style scoped lang="scss">
.notification-list {
  position: relative;
  display: grid;
  grid-template-rows: calc(100% - 36px) 36px;

  &__container {
    position: relative;
    margin-bottom: 16px;

    &__inner {
      position: absolute;
      left: 0;
      right: 0;
      height: 100%;
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

      .notification-list__empty {
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        width: 100%;
        font-size: 14px;
        transform: translateY(-50%);

        i {
          font-size: 45px;
        }
      }
    }
  }

  &__action {
    text-align: right;
  }
}
</style>