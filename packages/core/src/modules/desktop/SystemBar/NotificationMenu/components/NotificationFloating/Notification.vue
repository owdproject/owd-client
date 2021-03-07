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
      <div class="title" v-text="notification.title" />
      <div class="details" v-text="notification.details" />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    notification: Object
  },
}
</script>

<style scoped lang="scss">
.notification {
  background: $windowContentItemBackground;
  border: 1px solid $windowContentBorder;
  border-radius: 5px;
  box-shadow: $windowContentItemShadow;
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
    width: calc(100% - 48px);
    height: 32px;
    color: #777;

    .title {
      color: white;
      line-height: 18px;
      line-clamp: 1;
      -webkit-line-clamp: 1;
      white-space: nowrap;
      text-overflow: ellipsis;
      max-width: 100%;
      overflow: hidden;
    }

    .details {
      color: #717171;
      line-height: 20px;
      text-transform: uppercase;
      font-size: 10px;
      letter-spacing: 1px;
      margin-top: -2px;
    }
  }
}
</style>