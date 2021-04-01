<template>
  <DesktopSystemBarMenu>
    <span>
      {{$t(`desktop.SystemBar.${config.name}.menu`)}}<v-icon>mdi-menu-down</v-icon>
    </span>
  </DesktopSystemBarMenu>
</template>

<script>
import DesktopSystemBarMenu from "@owd-client/core/src/components/desktop/SystemBar/components/SystemBarMenu";

export default {
  components: {DesktopSystemBarMenu},
  props: {
    config: Object
  }
}
</script>

<style scoped lang="scss">
span {
  pointer-events: none;
}
</style>