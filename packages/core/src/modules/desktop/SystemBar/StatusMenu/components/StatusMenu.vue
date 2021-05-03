<template>
  <DesktopSystemBarMenu>
    <div class="icons">

      <template v-if="desktopModules && desktopModules.default">
        <component
            v-for="(desktopModule, i) of desktopModules.default" :key="i"
            :is="desktopModule.components.menu"
            :config="desktopModule.config"
        />
        <v-icon class="ml-n1 mr-n2">mdi-menu-down</v-icon>
      </template>

    </div>
  </DesktopSystemBarMenu>
</template>

<script setup>
import DesktopSystemBarMenu from "@owd-client/core/src/components/desktop/SystemBar/components/SystemBarMenu";
import ModuleDesktopExtend from "@owd-client/core/src/libraries/moduleDesktop/extend/moduleDesktopExtend.class";
import {reactive, defineProps} from "vue";

const props = defineProps({
  config: Object
})

const desktopModules = reactive(ModuleDesktopExtend.getDesktopModules('StatusSystemBar') || {})
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