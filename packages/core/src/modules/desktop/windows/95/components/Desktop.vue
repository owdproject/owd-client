<template>
  <div class="owd-desktop" :class="{
    'owd-desktop__system-bar--position-top': desktopOptions.SystemBar.position === 'top',
    'owd-desktop__system-bar--position-bottom': desktopOptions.SystemBar.position === 'bottom',
  }">
    <SystemBar v-if="desktopOptions.SystemBar.enabled">

      <!-- additional slots for left area system-bar -->
      <template v-slot:system-bar-left-append>
        <slot name="system-bar-left-append" />
      </template>

      <!-- additional slots for right area system-bar -->
      <template v-slot:system-bar-right-prepend>
        <slot name="system-bar-right-prepend" />
      </template>
      <template v-slot:system-bar-right-append>
        <slot name="system-bar-right-append" />
      </template>

    </SystemBar>

    <div class="owd-desktop__content">
      <slot />
    </div>
  </div>
</template>

<script setup>
import {inject, onBeforeMount, onMounted, onUnmounted} from 'vue'
  import {useStore} from "vuex";
  import SystemBar from "./SystemBar/SystemBar.vue";
  import ModuleDesktopExtend from "@owd-client/core/src/libraries/module-desktop/extend/moduleDesktopExtend.class";

  const store = useStore()

  // provide desktop options globally
  const desktopOptions = inject('desktopOptions')

  // initialize client
  onBeforeMount(() => store.dispatch('core/client/initialize'))

  // handle desktop resize event
  onMounted(() => window.addEventListener('resize', handleDesktopResize))
  onUnmounted(() => window.removeEventListener('resize', handleDesktopResize))

  let timeoutHandleDesktopResize = null

  function handleDesktopResize() {
    clearTimeout(timeoutHandleDesktopResize)

    timeoutHandleDesktopResize = setTimeout(() => {
      store.dispatch('core/window/windowsHandlePageResize')
    }, 100)
  }
</script>

<style scoped lang="scss">
  .owd-desktop {
    display: flex;
    flex-flow: column;
    background: $owd-desktop-system-bar-background;
    height: 100vh;

    &__system-bar {
      &--position-bottom {
        flex-direction: column-reverse;
      }
    }

    &__content {
      position: relative;
      overflow: hidden;
      flex: 1;
      background: $owd-background;
    }
  }
</style>