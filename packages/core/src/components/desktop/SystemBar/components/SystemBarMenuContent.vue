<template>
  <div class="system-bar-menu-content">
    <slot />
  </div>
</template>

<script>
  export default {
    name: "SystemBarMenuContent"
  }
</script>

<style scoped lang="scss">
.system-bar-menu-content {
  position: absolute;
  background: $windowBackground;
  box-shadow: 0 0 0 1px $windowBorder;
  color: $windowColor;
  border-radius: 5px;
  font-weight: normal;
  font-size: 13px;
  z-index: 999;
}
</style>

<style lang="scss">
#desktop {
  &.system-bar-position-top .system-bar-menu-content {
    top: 48px;
  }
  &.system-bar-position-bottom .system-bar-menu-content {
    bottom: 48px;
  }
}
</style>