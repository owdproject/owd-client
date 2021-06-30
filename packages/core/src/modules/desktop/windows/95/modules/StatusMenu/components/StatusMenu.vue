<template>
  <DesktopSystemBarMenu>
    <div class="owd-desktop__status-menu">

      <div
          v-if="$owd.desktopModules.list.StatusSystemBar && $owd.desktopModules.list.StatusSystemBar.default"
          class="owd-desktop__status-menu__icons"
      >

        <component
            v-for="(desktopModule, i) of $owd.desktopModules.list.StatusSystemBar.default" :key="i"
            :is="desktopModule.components.menu"
            :config="desktopModule.config"
        />

      </div>

      <StatusTime />

    </div>

  </DesktopSystemBarMenu>
</template>

<script setup>
import DesktopSystemBarMenu from "../../../components/SystemBar/components/SystemBarMenu.vue";
import StatusTime from "@owd-client/core/src/components/status/StatusTime.vue"
import {defineProps} from "vue";

const props = defineProps({
  config: Object
})
</script>

<style scoped lang="scss">
.owd-desktop__status-menu {
  display: inline-flex;
  height: 25px;
  line-height: 23px;
  margin: 4px 1px 0 0;
  padding: 0 10px;
  border: 1px solid;
  border-color: #828282 white white #828282;
  pointer-events: none;

  .v-icon {
    &:not(:last-child) {
      width: auto;
    }
  }

  &__icons {
    margin: 0 8px 0 4px;
  }
}
</style>