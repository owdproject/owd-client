<template>
  <div id="desktop" :class="{'with-system-bar': systemBar}">
    <DesktopSystemBar v-if="systemBar">

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

    <div class="desktop-content">
      <slot />
    </div>
  </div>
</template>

<script>
  import { getCurrentInstance } from 'vue'
  import DesktopSystemBar from "./system-bar/DesktopSystemBar";
  import mixinServer from "../../mixins/mixinServer";
  import {useStore} from "vuex";

  export default {
    name: "Desktop",
    mixins: [mixinServer],
    components: {DesktopSystemBar},
    setup() {
      const app = getCurrentInstance()
      const store = useStore()

      const handleDesktopResize = () => {
        clearTimeout(timeoutHandleDesktopResize)

        timeoutHandleDesktopResize = setTimeout(() => {
          self.$store.dispatch('core/window/windowsHandlePageResize')
        }, 100)
      }

      let timeoutHandleDesktopResize = null

      return {
        systemBar: app.appContext.config.globalProperties.$owd.config.desktop.systemBar.active,

        coreClientInitialize: () => {
          store.dispatch('core/client/initialize')
          store.dispatch('core/window/initialize')
        },
        coreSseConnect: () => {
          store.dispatch('core/sse/connect', 'once')
        },
        handleDesktopResize
      }
    },
    beforeMount() {
      // initialize client
      this.coreClientInitialize()
    },
    mounted() {
      // on page ready, connect to SSE
      if (this.isServerAvailable) {
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
  #desktop {
    display: flex;
    flex-flow: column;
    height: 100vh;

    &.with-system-bar {
      background: $desktopSystemBarBackground;

      .desktop-content {
        border-radius: 8px 8px 0 0;
        background: $bodyBackground;
        color: $desktopSystemBarColor;
      }
    }

    .desktop-content {
      position: relative;
      flex: 1;
    }
  }
</style>