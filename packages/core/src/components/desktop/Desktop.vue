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

<script>
  import { getCurrentInstance } from 'vue'
  import DesktopSystemBar from "./SystemBar/DesktopSystemBar";
  import {useStore} from "vuex";

  export default {
    components: {DesktopSystemBar},
    setup() {
      const app = getCurrentInstance()
      const systemBarOptions = app.appContext.config.owd.desktop.SystemBar.options
      const store = useStore()

      let timeoutHandleDesktopResize = null

      return {
        systemBarEnabled: systemBarOptions.enabled,
        systemBarPosition: systemBarOptions.position,

        coreClientInitialize: () => {
          store.dispatch('core/client/initialize')
          store.dispatch('core/window/initialize')
        },
        coreSseConnect: () => {
          store.dispatch('core/sse/connect')
        },
        handleDesktopResize: () => {
          clearTimeout(timeoutHandleDesktopResize)

          timeoutHandleDesktopResize = setTimeout(() => {
            store.dispatch('core/window/windowsHandlePageResize')
          }, 100)
        }
      }
    },
    beforeMount() {
      // initialize client
      this.coreClientInitialize()
    },
    mounted() {
      // on page ready, connect to SSE
      if (this.$owd.config.sse.enabled) {
        window.addEventListener('load', this.coreSseConnect)
      }

      // add desktop resize event
      window.addEventListener('resize', this.handleDesktopResize)
    },
    unmounted() {
      // remove desktop resize event
      window.removeEventListener('resize', this.handleDesktopResize)
    }
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