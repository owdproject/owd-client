<template>
  <DesktopSystemBarMenu v-text="$t(`desktop.SystemBar.${config.name}.menu`)" />
</template>

<script>
import DesktopSystemBarMenu from "../../../../../components/desktop/SystemBar/components/DesktopSystemBarMenu";

export default {
  components: {DesktopSystemBarMenu},
  props: {
    config: Object
  }
}
</script>