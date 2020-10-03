<template>
  <div id="app" :class="appClasses">
    <router-view />
  </div>
</template>

<script>
import mixinServer from '@/core/mixins/mixinServer'

export default {
  name: 'App',
  mixins: [mixinServer],
  computed: {
    /**
       * Manage classes on #app element
       *
       * @returns {[]}
       */
    appClasses() {
      const appClasses = []

      let device = 'is-desktop'
      if (this.$device.mobile) device = 'is-mobile'

      let osName = null
      if (navigator.appVersion.indexOf('Win') !== -1) osName = 'is-windows'
      if (navigator.appVersion.indexOf('Mac') !== -1) osName = 'is-mac'
      if (navigator.appVersion.indexOf('X11') !== -1) osName = 'is-unix'
      if (navigator.appVersion.indexOf('Linux') !== -1) osName = 'is-linux'

      if (osName) {
        appClasses.push(osName)
      }

      if (device) {
        appClasses.push(device)
      }

      return appClasses
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
  },
  created() {
    const self = this

    // initialize client
    this.$store.dispatch('core/client/initialize')

    // add window resize event
    window.addEventListener('resize', function () {
      clearTimeout(this.handlePageResize)

      this.handlePageResize = setTimeout(() => {
        self.$store.commit('core/windows/SET_DESKTOP_WIDTH', window.innerWidth)
        self.$store.commit('core/windows/SET_DESKTOP_HEIGHT', window.innerHeight)

        // windows position
        self.$store.dispatch('core/windows/windowsHandlePageResize')
      }, 100)
    })
  },
  destroyed() {
    const self = this

    // remove window resize event
    window.removeEventListener('resize', function () {
      self.$store.dispatch('core/windows/windowsHandlePageResize')
    })
  }
}
</script>