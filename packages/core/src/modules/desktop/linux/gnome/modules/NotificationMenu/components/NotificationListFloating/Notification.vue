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
      <div class="notification-text__title" v-text="notification.title" />
      <div class="notification-text__details" v-text="notification.details" />
    </div>
  </div>
</template>

<script setup>
import {defineProps} from 'vue'

const props = defineProps({
  notification: Object
})
</script>

<style scoped lang="scss">
.notification {
  background: $owd-window-item-background;
  border: 1px solid $owd-window-content-border-color;
  border-radius: 5px;
  box-shadow: $owd-window-item-box-shadow;
  padding: 16px;
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

    &__title {
      color: white;
      line-height: 16px;
      line-clamp: 1;
      -webkit-line-clamp: 1;
      white-space: nowrap;
      text-overflow: ellipsis;
      max-width: 100%;
      overflow: hidden;
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
}
</style>