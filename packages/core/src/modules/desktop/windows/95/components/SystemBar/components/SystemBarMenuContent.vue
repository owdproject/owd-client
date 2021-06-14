<template>
  <div class="owd-desktop__system-bar__content">
    <slot />
  </div>
</template>

<script setup>
const props = defineProps({
  config: Object
})
</script>

<style scoped lang="scss">
.owd-desktop__system-bar__content {
  position: absolute;
  background: $owd-window-button-background;
  border: 1px solid;
  border-color: $owd-window-button-border-color;
  box-shadow: $owd-window-button-box-shadow;
  color: $owd-desktop-system-bar-menu-content-color;
  z-index: 999;
}
</style>

<style lang="scss">
.owd-desktop {
  &__system-bar {
    &--position-top {
      .owd-desktop__system-bar__content {
        top: $owd-desktop-system-bar-height - 3px;
      }
    }

    &--position-bottom {
      .owd-desktop__system-bar__content {
        bottom: $owd-desktop-system-bar-height - 3px;
      }
    }
  }
}
</style>