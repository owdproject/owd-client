<template>
  <DesktopSystemBarMenu v-text="$t(`desktop.system-bar.${config.name}.menu`)" />
</template>

<script>
import DesktopSystemBarMenu from "../../../../../components/desktop/system-bar/components/DesktopSystemBarMenu";

export default {
  components: {DesktopSystemBarMenu},
  props: {
    config: Object
  }
}
</script>