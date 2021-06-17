<template>
  <div class="owd-desktop__system-bar">

    <!-- system-bar left area -->
    <div class="owd-desktop__system-bar__left">
      <slot name="system-bar-left-prepend" />

      <template v-if="$owd.desktopModules.list.SystemBar && $owd.desktopModules.list.SystemBar.left">
        <template v-for="(desktopModule, i) of $owd.desktopModules.list.SystemBar.left" :key="i">
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
      </template>

      <slot name="system-bar-left-append" />
    </div>

    <!-- system-bar right area -->
    <div class="owd-desktop__system-bar__right">
      <slot name="system-bar-right-prepend" />

      <template v-if="$owd.desktopModules.list.SystemBar && $owd.desktopModules.list.SystemBar.right">
        <template v-for="(desktopModule, i) of $owd.desktopModules.list.SystemBar.right" :key="i">
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
      </template>

      <slot name="system-bar-right-append" />
    </div>

  </div>
</template>

<script setup>
import {defineProps} from 'vue';

const props = defineProps({
  systemBar: Boolean
})

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
</script>

<style scoped lang="scss">
.owd-desktop__system-bar {
  display: flex;
  color: $owd-desktop-system-bar-text;
  height: $owd-desktop-system-bar-height;
  line-height: $owd-desktop-system-bar-height - 2px;
  padding: 0 2px;
  user-select: none;
  border-top: 1px solid $owd-desktop-system-bar-background;
  box-shadow: inset 0 1px 0 0 white;
  cursor: default;

  &__left {
    display: flex;
    width: 100%;
  }

  &__right {
    text-align: right;
    width: 180px;
  }
}
</style>