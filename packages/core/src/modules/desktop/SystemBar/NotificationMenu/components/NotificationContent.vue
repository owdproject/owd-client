<template>
  <div>
    <DesktopSystemBarMenuContent
        v-if="opened"
        class="owd-desktop__notification__container"
        v-click-outside="menuClose"
    >

      <NotificationList class="col col-notification-list" />
      <NotificationCalendar class="col col-calendar" />

    </DesktopSystemBarMenuContent>

    <NotificationFloating v-if="!opened" />
  </div>
</template>

<script>
import DesktopSystemBarMenuContent from '@owd-client/core/src/components/desktop/SystemBar/components/SystemBarMenuContent'
import NotificationList from "./NotificationColumnList/NotificationList";
import NotificationCalendar from "./NotificationColumnCalendar/NotificationCalendar";
import NotificationFloating from "./NotificationFloating/NotificationFloating";

export default {
  components: {
    DesktopSystemBarMenuContent,
    NotificationList,
    NotificationCalendar,
    NotificationFloating
  },
  props: {
    opened: Boolean
  },
  emits: [
    'close'
  ],
  methods: {
    menuClose() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="scss">
.owd-desktop__notification__container {
  display: grid;
  width: 700px;
  height: 500px;
  max-height: 60vh;
  grid-template-columns: 58% 42%;
  line-height: 32px;
  padding: 16px 0;
  left: 50%;
  color: $windowContentInputColor;
  transform: translateX(-50%);

  .arrow {
    border: solid $windowBorder;
    background: $windowBackground;
    border-width: 0 3px 3px 0;
    display: inline-block;
    padding: 8px;
    transform: rotate(-135deg);
  }

  .col-notification-list {
    padding: 8px 24px;
  }

  .col-calendar {
    border-left: 1px solid $windowContentSeparator;
    padding: 16px;
    text-align: left;
  }
}
</style>