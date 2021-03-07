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
        <span class="title" v-text="notification.title" />
        <span class="date" v-text="dateFromNow" />
      </div>

      <div class="details" v-text="notification.details" />

    </div>

    <div class="notification-close" @click="removeNotification(notification)">X</div>
  </div>
</template>

<script lang="ts">
import {ref, getCurrentInstance} from "vue";
import {useStore} from "vuex";

export default {
  props: {
    notification: Object
  },
  setup(props) {
    const app = getCurrentInstance();
    const store = useStore()

    function getDateFromNow(date): string {
      return app.appContext.config.globalProperties.$moment(date).fromNow()
    }

    const dateFromNow = ref(getDateFromNow(props.date))
    setInterval(() => dateFromNow.value = getDateFromNow(props.date), 1000)

    return {
      dateFromNow,
      removeNotification: (notification) => {
        store.commit('core/notification/REMOVE', notification)
      }
    }
  }
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
    width: calc(100% - 48px);
    height: 32px;
    color: #777;

    .headline {
      line-height: 18px;
      line-clamp: 1;
      -webkit-line-clamp: 1;
      white-space: nowrap;
      text-overflow: ellipsis;
      max-width: 100%;
      overflow: hidden;

      .title {
        font-weight: 600;
        font-size: 13px;
        color: white;
      }

      .date {
        margin-left: 9px;
        vertical-align: 1px;
        font-size: 11px;
        color: grey;
      }
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

  .notification-close {
    position: absolute;
    top: 16px;
    right: 16px;
    width: 12px;
    height: 12px;
    line-height: 12px;
    text-align: center;
    display: none;
  }

  &:hover {
    background: $windowContentItemBackgroundHover;

    .notification-close {
      display: block;
    }
  }
}
</style>