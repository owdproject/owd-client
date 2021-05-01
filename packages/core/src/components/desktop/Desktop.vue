<template>
  <div class="owd-desktop" :class="{
    'owd-desktop--system-bar-enabled': systemBarEnabled,
    'owd-desktop--system-bar-position-top': systemBarPosition === 'top',
    'owd-desktop--system-bar-position-bottom': systemBarPosition === 'bottom',
  }">
    <DesktopSystemBar v-if="systemBarEnabled">

      <template v-slot:system-bar-left-prepend>
        <slot name="system-bar-left-prepend" />
      </template>
      <template v-slot:system-bar-left-append>
        <slot name="system-bar-left-append" />
      </template>

      <template v-slot:system-bar-right-prepend>
        <slot name="system-bar-right-prepend" />
      </template>
      <template v-slot:system-bar-right-append>
        <slot name="system-bar-right-append" />
      </template>

    </DesktopSystemBar>

    <div class="owd-desktop__content">
      <slot />
    </div>
  </div>
</template>

<script setup>
  import { getCurrentInstance, onBeforeMount, onMounted, onUnmounted } from 'vue'
  import {useStore} from "vuex";
  import DesktopSystemBar from "./SystemBar/DesktopSystemBar";

  const app = getCurrentInstance()
  const store = useStore()

  const owdConfig = app.appContext.config.owd

  const systemBarEnabled = owdConfig.desktop.SystemBar.options.enabled
  const systemBarPosition = owdConfig.desktop.SystemBar.options.position

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
    height: 100vh;

    &--system-bar-position-top {
      .owd-desktop__content {
        border-radius: 8px 8px 0 0;
      }
    }

    &--system-bar-position-bottom {
      flex-direction: column-reverse;

      .owd-desktop__content {
        border-radius: 0 0 8px 8px;
      }
    }

    &__content {
      position: relative;
      flex: 1;
    }
  }
</style>