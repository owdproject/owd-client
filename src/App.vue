<template>
  <div id="app" :class="appClasses">
    <router-view />
  </div>
</template>

<script>
  import mixinCommon from "./core/mixins/mixinCommon";

  export default {
    name: 'app',
    mixins: [mixinCommon],
    beforeMount() {
      // redirect to homepage on 404
      if (!this.$route.name) {
        this.$router.push({ name: 'index' });
      }

      // connect to server if available
      if (this.isServerAvailable) {
        this.$store.dispatch('core/sse/connect', 'once');
      }
    },
    computed: {
      /**
       * Manage classes on #app element
       *
       * @returns {[]}
       */
      appClasses() {
        const appClasses = [];

        let osName = null;
        let device = 'is-desktop';

        if (this.$device.mobile) {
          device = 'is-mobile'
        }

        if (navigator.appVersion.indexOf("Win") !== -1) osName = "is-windows";
        // if (navigator.appVersion.indexOf("Mac") !== -1) osName = "is-mac-os";
        // if (navigator.appVersion.indexOf("X11") !== -1) osName = "is-unix";
        // if (navigator.appVersion.indexOf("Linux") !== -1) osName = "is-linux";

        if (osName) {
          appClasses.push(osName)
        }

        if (device) {
          appClasses.push(device)
        }

        return appClasses
      }
    }
  }
</script>

<style lang="scss">
  html, body {
    background: #151515;
  }
</style>
