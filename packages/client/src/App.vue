<template>
  <div id="app" :class="appClasses">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  computed: {
    /**
     * Manage classes on #app element
     */
    appClasses() {
      const appClasses = []

      let device = 'is-desktop'
      if (this.$device.mobile) device = 'is-mobile'

      if (device) {
        appClasses.push(device)
      }

      let osName = null
      if (navigator.appVersion.indexOf('Win') !== -1) osName = 'is-windows'
      if (navigator.appVersion.indexOf('Mac') !== -1) osName = 'is-mac'
      if (navigator.appVersion.indexOf('X11') !== -1) osName = 'is-unix'
      if (navigator.appVersion.indexOf('Linux') !== -1) osName = 'is-linux'

      if (osName) {
        appClasses.push(osName)
      }

      return appClasses
    }
  }
}
</script>