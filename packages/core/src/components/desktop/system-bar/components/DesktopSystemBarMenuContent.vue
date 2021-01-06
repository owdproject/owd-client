<template>
  <div class="system-bar-menu-content">
    <slot />
  </div>
</template>

<script>
  export default {
    name: "DesktopSystemBarMenuContent"
  }
</script>

<style scoped lang="scss">
.system-bar-menu-content {
  position: absolute;
  top: 48px;
  background: $windowBackground;
  box-shadow: 0 0 0 1px $windowBorder;
  color: $windowColor;
  border-radius: 5px;
  font-weight: normal;
  font-size: 13px;
  z-index: 999;
}
</style>