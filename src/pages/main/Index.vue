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

      // initialize client
      this.$store.dispatch('core/client/initialize')

      // add window resize event
      window.addEventListener("resize", function () {
        clearTimeout(this.handlePageResize);

        this.handlePageResize = setTimeout(() => {
          self.$store.commit('core/windows/SET_DESKTOP_WIDTH', window.innerWidth);
          self.$store.commit('core/windows/SET_DESKTOP_HEIGHT', window.innerHeight);

          // windows position
          self.$store.dispatch('core/windows/windowsHandlePageResize');
        }, 100);
      });
    },
    destroyed() {
      const self = this;

      // remove window resize event
      window.removeEventListener('resize', function () {
        self.$store.dispatch('core/windows/windowsHandlePageResize');
      })
    }
  }
</script>