<template>
  <div class="owd-desktop__system-bar__content">
    <slot />
  </div>
</template>

<style scoped lang="scss">
.owd-desktop__system-bar__content {
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
.owd-desktop {
  &--system-bar-position-top {
    .owd-desktop__system-bar__content {
      top: 48px;
    }
  }
  &--system-bar-position-bottom {
    .owd-desktop__system-bar__content {
      bottom: 48px;
    }
  }
}
</style>