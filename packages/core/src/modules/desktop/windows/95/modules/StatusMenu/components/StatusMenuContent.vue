<template>
  <DesktopSystemBarMenuContent
      v-if="$owd.desktopModules.list.StatusSystemBar && $owd.desktopModules.list.StatusSystemBar.default"
      class="owd-desktop__status-menu__content"
      v-click-outside="menuClose"
  >

    <component
        v-for="(desktopModule, i) of $owd.desktopModules.list.StatusSystemBar.default" :key="i"
        :is="desktopModule.components.content"
        @close="menuClose"
    />

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
  &__content {
    display: grid;
    width: 300px;
    max-width: calc(100% - 32px);
    right: 3px;
    padding: 12px;
    text-align: center;
  }
}
</style>