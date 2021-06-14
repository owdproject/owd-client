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

    <NotificationListFloating v-show="!opened" />
  </div>
</template>

<script setup>
import { defineProps, defineEmit } from 'vue'
import DesktopSystemBarMenuContent from '../../../components/SystemBar/components/SystemBarMenuContent.vue'
import NotificationList from "./NotificationList/NotificationList.vue";
import NotificationCalendar from "./NotificationCalendar/NotificationCalendar.vue";
import NotificationListFloating from "./NotificationListFloating/NotificationListFloating.vue";

const props = defineProps({
  opened: Boolean
})

const emit = defineEmit([
  'close'
])

function menuClose() {
  emit('close')
}
</script>

<style scoped lang="scss">
.owd-desktop__notification__container {
  display: grid;
  width: 700px;
  max-width: calc(100% - 32px);
  height: 500px;
  max-height: 60vh;
  grid-template-columns: 58% 42%;
  line-height: 32px;
  padding: 16px 0;
  left: 50%;
  transform: translateX(-50%);

  @media(max-width: 600px) {
    grid-template-columns: 100%;
  }

  @media(max-height: 400px) {
    max-height: calc(100vh - 60px);
  }

  /*
  .arrow {
    border: solid $owd-window-border;
    background: $owd-window-background;
    border-width: 0 3px 3px 0;
    display: inline-block;
    padding: 8px;
    transform: rotate(-135deg);
  }
   */

  .col-notification-list {
    padding: 8px 24px;

    @media(max-width: 600px), (max-height: 400px) {
      padding: 4px 16px;
    }
  }

  .col-calendar {
    border-left: 1px solid $owd-window-content-separator;
    padding: 16px;
    text-align: left;

    @media(max-width: 600px) {
      display: none;
    }
  }
}
</style>