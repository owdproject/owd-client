<template>
  <div class="owd-desktop__system-bar__content">
    <div :class="['owd-desktop__system-bar__content__arrow', contentAdditionalClass]" />

    <slot />
  </div>
</template>

<script>
export default {
  props: {
    arrowPosition: {
      type: [String, Number],
      default: 'center'
    }
  },
  computed: {
    contentAdditionalClass() {
      if (typeof this.arrowPosition === 'string') {
        return `owd-desktop__system-bar__content__arrow--${this.arrowPosition}`
      }

      if (typeof this.arrowPosition === 'number') {
        if (this.arrowPosition > 0) {
          return `owd-desktop__system-bar__content__arrow--left`
        }
        if (this.arrowPosition < 0) {
          return `owd-desktop__system-bar__content__arrow--right`
        }
      }

      return ''
    },
    contentStyle() {
      if (typeof this.arrowPosition === 'number') {
        return `owd-desktop__system-bar__content__arrow--right`
      }
    }
  }
}
</script>

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

  &__arrow {
    position: absolute;
    top: -12.5px;
    left: 50%;
    margin-left: -12.5px;

    width: 0;
    height: 0;
    border-left: 12.5px solid transparent;
    border-right: 12.5px solid transparent;
    border-bottom: 12.5px solid $windowBackground;

    &--left {
      left: 20px;
      margin-left: 0;
    }

    &--right {
      left: 0;
      right: 20px;
      margin-left: 0;
    }
  }
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