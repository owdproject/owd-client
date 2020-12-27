<template>
  <div id="desktop" :class="{'with-system-bar': systemBar}">
    <DesktopSystemBar v-if="systemBar">
      <template v-slot:system-bar-status-prepend>
        <slot name="system-bar-status-prepend" />
      </template>
      <template v-slot:system-bar-status-append>
        <slot name="system-bar-status-append" />
      </template>
    </DesktopSystemBar>

    <div class="desktop-content">
      <slot />
    </div>
  </div>
</template>

<script>
  import DesktopSystemBar from "./system-bar/DesktopSystemBar";
  import mixinServer from "../../mixins/mixinServer";
  export default {
    name: "Desktop",
    mixins: [mixinServer],
    components: {DesktopSystemBar},
    data() {
      return {
        timeoutHandlePageResize: null
      }
    },
    computed: {
      systemBar() {
        return this.$owd.config.desktop.systemBar
      }
    },
    beforeMount() {
      const self = this

      // redirect to homepage on 404
      if (!this.$route.name) {
        this.$router.push({ name: 'index' })
      }

      // on page ready, connect to SSE
      if (this.isServerAvailable) {
        window.addEventListener('load', function() {
          self.$store.dispatch('core/sse/connect', 'once')
        })
      }

      // CREATED EVENT

      // initialize client
      this.$store.dispatch('core/client/initialize')

      // add window resize event
      window.addEventListener('resize', function () {
        clearTimeout(self.timeoutHandlePageResize)

        self.timeoutHandlePageResize = setTimeout(() => {
          self.$store.dispatch('core/windows/windowsHandlePageResize')
        }, 100)
      })
    },
    unmounted() {
      const self = this

      // remove window resize event
      window.removeEventListener('resize', function () {
        self.$store.dispatch('core/windows/windowsHandlePageResize')
      })
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