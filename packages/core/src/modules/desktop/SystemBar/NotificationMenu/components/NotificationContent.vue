<template>
  <div>
    <DesktopSystemBarMenuContent v-if="opened" class="notification-container">

      <NotificationList class="col col-notification-list" />
      <NotificationCalendar class="col col-calendar" />

    </DesktopSystemBarMenuContent>

    <NotificationFloating v-if="!opened" />
  </div>
</template>

<script>
import DesktopSystemBarMenuContent from '../../../../../components/desktop/SystemBar/components/DesktopSystemBarMenuContent'
import NotificationList from "./NotificationColumnList/NotificationList";
import NotificationCalendar from "./NotificationColumnCalendar/NotificationCalendar";
import NotificationFloating from "./Notifications/NotificationFloating/NotificationFloating";

export default {
  components: {
    DesktopSystemBarMenuContent,
    NotificationList,
    NotificationCalendar,
    NotificationFloating
  },
  props: {
    opened: Boolean
  }
}
</script>

<style scoped lang="scss">
.notification-container {
  display: grid;
  width: 700px;
  height: 500px;
  max-height: 60vh;
  grid-template-columns: 55% 45%;
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