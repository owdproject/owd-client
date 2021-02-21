<template>
  <DesktopSystemBarMenu v-text="$t(`desktop.SystemBar.${config.name}.menu`)" />
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