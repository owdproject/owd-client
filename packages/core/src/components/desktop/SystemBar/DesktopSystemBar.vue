<template>
  <v-system-bar class="owd-desktop__system-bar">

    <div class="owd-desktop__system-bar__left">
      <slot name="system-bar-left-prepend" />

      <template v-for="(desktopModule, i) of desktopModules.left" :key="i">
        <component
            :is="desktopModule.components.menu"
            :config="desktopModule.config"
            @click="(e) => openSystemBarDesktopModule(e, desktopModule)"
        />
        <component
            :is="desktopModule.components.content"
            :arrow-position="desktopModule.config.arrowPosition"
            :opened="desktopModule.config.opened"
        />
      </template>

      <slot name="system-bar-left-append" />
    </div>

    <div class="owd-desktop__system-bar__center">
      <template v-for="(desktopModule, i) of desktopModules.center" :key="i">
        <component
            :is="desktopModule.components.menu"
            :config="desktopModule.config"
            @click="(e) => openSystemBarDesktopModule(e, desktopModule)"
        />
        <component
            :is="desktopModule.components.content"
            :arrow-position="desktopModule.config.arrowPosition"
            :opened="desktopModule.config.opened"
        />
      </template>
    </div>

    <div class="owd-desktop__system-bar__right">
      <slot name="system-bar-right-prepend" />

      <template v-for="(desktopModule, i) of desktopModules.right" :key="i">
        <component
            :is="desktopModule.components.menu"
            :config="desktopModule.config"
            @click="(e) => openSystemBarDesktopModule(e, desktopModule)"
        />
        <component
            :is="desktopModule.components.content"
            :arrow-position="desktopModule.config.arrowPosition"
            :opened="desktopModule.config.opened"
        />
      </template>

      <slot name="system-bar-right-append" />
    </div>

  </v-system-bar>
</template>

<script>
import {reactive} from 'vue';
import ModulesDesktop from '@owd-client/core/src/libraries/modules-desktop/extend/modulesDesktopExtend.class'

export default {
  props: {
    systemBar: Boolean
  },
  setup() {
    const desktopModules = reactive(ModulesDesktop.getDesktopModules('SystemBar'))

    const openSystemBarDesktopModule = (event, desktopModule) => {
      // set desktop module opened
      desktopModule.config.opened = !desktopModule.config.opened

      // set content arrow position
      desktopModule.config.arrowPosition = (event.target.offsetWidth / 2) - 24
    }

    return {
      desktopModules,
      openSystemBarDesktopModule
    }
  }
}
</script>

<style scoped lang="scss">
.owd-desktop__system-bar {
  display: grid;
  grid-template-columns: 30% 40% 30%;
  cursor: default;
  height: 26px;
  line-height: 26px;
  font-size: 13.5px;
  font-weight: bold;
  user-select: none;

  &__center {
    text-align: center;
  }

  &__right {
    text-align: right;
  }
}
</style>