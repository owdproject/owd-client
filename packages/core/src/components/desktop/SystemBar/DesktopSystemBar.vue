<template>
  <div class="owd-desktop__system-bar">

    <div class="owd-desktop__system-bar__left">
      <slot name="system-bar-left-prepend" />

      <template v-for="(desktopModule, i) of desktopModules.left" :key="i">
        <component
            :is="desktopModule.components.menu"
            :config="desktopModule.config"
            @click="(e) => openSystemBarDesktopModule(e, desktopModule)"
        />
        <component
            v-if="desktopModule.config.opened"
            :is="desktopModule.components.content"
            :arrow-position="desktopModule.config.arrowPosition"
            @close="closeSystemBarDesktopModule(desktopModule)"
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
            :opened="desktopModule.config.opened"
            :arrow-position="desktopModule.config.arrowPosition"
            @close="closeSystemBarDesktopModule(desktopModule)"
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
            v-if="desktopModule.config.opened"
            :is="desktopModule.components.content"
            :config="desktopModule.config"
            :arrow-position="desktopModule.config.arrowPosition"
            @close="closeSystemBarDesktopModule(desktopModule)"
        />
      </template>

      <slot name="system-bar-right-append" />
    </div>

  </div>
</template>

<script>
import {reactive} from 'vue';
import ModuleDesktopExtend from '@owd-client/core/src/libraries/moduleDesktop/extend/moduleDesktopExtend.class'

export default {
  props: {
    systemBar: Boolean
  },
  setup() {
    const desktopModules = reactive(ModuleDesktopExtend.getDesktopModules('SystemBar'))

    const openSystemBarDesktopModule = (event, desktopModule) => {
      // set desktop module opened
      desktopModule.config.opened = !desktopModule.config.opened

      // set content arrow position
      desktopModule.config.arrowPosition = (event.target.offsetWidth / 2) - 24
    }

    const closeSystemBarDesktopModule = (desktopModule) => {
      if (desktopModule) {
        desktopModule.config.opened = false
      }
    }

    return {
      desktopModules,
      openSystemBarDesktopModule,
      closeSystemBarDesktopModule
    }
  }
}
</script>

<style scoped lang="scss">
.owd-desktop__system-bar {
  display: grid;
  grid-template-columns: 30% 40% 30%;
  cursor: default;
  height: $desktopSystemBarHeight;
  line-height: $desktopSystemBarHeight;
  user-select: none;

  &__center {
    text-align: center;
  }

  &__right {
    text-align: right;
  }
}
</style>