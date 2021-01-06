<template>
  <DesktopSystemBarMenu v-text="config.name" />
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