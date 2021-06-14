<template>
  <DesktopSystemBarMenu v-if="$owd.desktopModules.list.StatusSystemBar && $owd.desktopModules.list.StatusSystemBar.default">
    <div class="icons">

      <component
          v-for="(desktopModule, i) of $owd.desktopModules.list.StatusSystemBar.default" :key="i"
          :is="desktopModule.components.menu"
          :config="desktopModule.config"
      />

    </div>
  </DesktopSystemBarMenu>
</template>

<script setup>
import DesktopSystemBarMenu from "../../../components/SystemBar/components/SystemBarMenu.vue";
import {defineProps} from "vue";

const props = defineProps({
  config: Object
})
</script>

<style scoped lang="scss">
.icons {
  pointer-events: none;

  i {
    &:not(:last-child) {
      margin: 0 4px;
    }
  }
}
</style>