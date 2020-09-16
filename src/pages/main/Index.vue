<template>
  <div>

    <Background />
    <Logo />
    <Menu />

    <WindowsList />

    <Notifications />

  </div>
</template>

<script>
  import Logo from "../../core/components/logo/Logo";
  import Background from "../../core/components/background/Background";
  import Menu from "../../core/components/menu/Menu";
  import Notifications from "../../core/components/notification/NotificationList";
  import WindowsList from "../../core/components/module/ModulesContainer";

  export default {
    name: "index",
    components: {
      Background,
      Logo,
      Menu,
      WindowsList,
      Notifications,
    },
    created() {
      const self = this;

      this.$store.commit('core/debug/LOG', 'App initialized');

      // # VUEX WINDOWS INIT

      // load windows positions from local storage
      this.$store.dispatch('core/windows/getWindowsStorage').then(windowsData => {
        this.$store.dispatch('core/windows/loadWindowsStorage', windowsData);
      });

      // check windows position on load
      this.$store.dispatch('core/windows/windowsHandlePageResize');

      // load client customization
      this.$store.dispatch('core/client/storageLoad');

      window.addEventListener("resize", function () {
        clearTimeout(this.handlePageResize);

        this.handlePageResize = setTimeout(() => {
          self.$store.commit('core/windows/SET_PAGE_WIDTH', window.innerWidth);
          self.$store.commit('core/windows/SET_PAGE_HEIGHT', window.innerHeight);

          // windows position
          self.$store.dispatch('core/windows/windowsHandlePageResize');
        }, 100);
      });
    },
    destroyed() {
      const self = this;

      window.removeEventListener('resize', function () {
        self.$store.dispatch('core/windows/windowsHandlePageResize');
      })
    }
  }
</script>