<template>
  <div
    :class="[
        'notification',
        `notification-service-${notification.service}`
    ]"
  >
    <div class="notification-icon">
      <v-icon :style="`color: ${notification.color};`">{{notification.icon}}</v-icon>
    </div>

    <div class="notification-text">

      <div class="headline">
        <span class="notification-text__title" v-text="notification.title" />
        <span class="notification-text__date" v-text="dateFromNow" />
      </div>

      <div class="notification-text__details" v-text="notification.details" />

    </div>

    <div class="notification-close" @click="removeNotification(notification)">
      <v-icon>mdi-close</v-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ref, getCurrentInstance, defineProps} from "vue";
import {useStore} from "vuex";

const props = defineProps({
  notification: Object
})

const app = getCurrentInstance();
const store = useStore()

function getDateFromNow(date): string {
  return app.appContext.config.globalProperties.$moment(date).fromNow()
}

const dateFromNow = ref(getDateFromNow(props.date))
setInterval(() => dateFromNow.value = getDateFromNow(props.date), 1000)

function removeNotification(notification) {
  store.commit('core/notification/REMOVE', notification)
}
</script>

<style scoped lang="scss">
.notification {
  position: relative;
  background: $windowContentItemBackground;
  border: 1px solid $windowContentBorder;
  border-radius: 5px;
  box-shadow: $windowContentItemShadow;
  padding: 16px 32px 16px 16px;
  text-align: left;
  font-size: 15px;
  cursor: default;

  .notification-icon {
    position: relative;
    display: inline-block;
    vertical-align: top;
    width: 32px;
    height: 32px;
    margin-right: 16px;
    text-align: center;
    font-size: 21px;

    i {
      vertical-align: -1px;
    }
  }

  .notification-text {
    display: inline-block;
    vertical-align: top;
    width: calc(100% - 64px);
    height: 32px;
    color: #777;

    .headline {
      margin-top: -1px;
      margin-bottom: 1px;
      line-height: 16px;
      line-clamp: 1;
      -webkit-line-clamp: 1;
      white-space: nowrap;
      text-overflow: ellipsis;
      max-width: 100%;
      overflow: hidden;
    }

    &__title {
      font-size: 15px;
      color: white;
    }

    &__date {
      margin-left: 9px;
      vertical-align: 1px;
      font-size: 11px;
      color: grey;
    }

    &__details {
      color: #717171;
      line-height: 20px;
      text-transform: uppercase;
      font-size: 10px;
      letter-spacing: 1px;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  .notification-close {
    position: absolute;
    top: 12px;
    right: 10px;
    width: 24px;
    height: 24px;
    line-height: 12px;
    text-align: center;
    cursor: pointer;
    display: none;

    i {
      font-size: 18px;
    }
  }

  &:hover {
    background: $windowContentItemBackgroundHover;

    .notification-close {
      display: block;
    }
  }
}
</style>