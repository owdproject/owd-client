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
  import DesktopSystemBar from "./SystemBar/DesktopSystemBar";
  import mixinServer from "../../mixins/mixinServer";
  import {useStore} from "vuex";

  export default {
    name: "Desktop",
    mixins: [mixinServer],
    components: {DesktopSystemBar},
    setup() {
      const app = getCurrentInstance()
      const store = useStore()

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

    .desktop-content {
      position: relative;
      flex: 1;
    }
  }
</style>