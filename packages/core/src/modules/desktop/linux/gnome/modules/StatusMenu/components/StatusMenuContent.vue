<template>
  <DesktopSystemBarMenuContent
      class="owd-desktop__status-menu__container"
      v-click-outside="menuClose"
  >

    <template v-if="$owd.desktopModules.list.StatusSystemBar && $owd.desktopModules.list.StatusSystemBar.default">
      <component
          v-for="(desktopModule, i) of $owd.desktopModules.list.StatusSystemBar.default" :key="i"
          :is="desktopModule.components.content"
          @close="menuClose"
      />
    </template>

  </DesktopSystemBarMenuContent>
</template>

<script setup>
import DesktopSystemBarMenuContent from '../../../components/SystemBar/components/SystemBarMenuContent.vue'
import {defineEmit} from "vue";

const emit = defineEmit([
  'close'
])

function menuClose() {
  emit('close')
}
</script>

<style scoped lang="scss">
.owd-desktop__status-menu {
  &__container {
    display: grid;
    width: 300px;
    max-width: calc(100% - 32px);
    right: 16px;
    padding: 20px 18px;
    text-align: center;
  }
}

.overline {
  height: 9px;
  line-height: 12px;
  margin-bottom: 12px;
}

.patreon-goal {
  text-align: left;
  margin-bottom: 22px;

  .progress-bar {
    width: 100%;
    height: 8px;
    margin-top: 5px;
    border-radius: 4px;
    background: #282828;
    overflow: hidden;

    &__value {
      height: 100%;
      background-color: $owd-dock-item-square-background;
      border-radius: 4px;
    }
  }
}
</style>