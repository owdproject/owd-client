<template>
  <div class="owd-desktop__system-bar__content">
    <div
        :class="['owd-desktop__system-bar__content__arrow', contentAdditionalClass]"
        :style="contentStyle"
    />

    <slot />
  </div>
</template>

<script setup>
import {computed} from 'vue'

const props = defineProps({
  config: Object,
  arrowPosition: {
    type: [String, Number],
    default: 'center'
  }
})

const contentAdditionalClass = computed(() => {
  if (typeof props.arrowPosition === 'string') {
    return `owd-desktop__system-bar__content__arrow--${props.arrowPosition}`
  }

  if (typeof props.arrowPosition === 'number') {
    if (props.arrowPosition > 0) {
      return `owd-desktop__system-bar__content__arrow--left`
    }
    if (props.arrowPosition < 0) {
      return `owd-desktop__system-bar__content__arrow--right`
    }
  }

  return ''
})

const contentStyle = computed(() => {
  if (typeof props.arrowPosition === 'number') {
    if (props.config && props.config.position === 'right') {
      return `left: auto; right: ${props.arrowPosition}px;`
    }

    return `left: ${props.arrowPosition}px;`
  }
  return ''
})
</script>

<style scoped lang="scss">
.owd-desktop__system-bar__content {
  position: absolute;
  background: $windowBackground;
  box-shadow: 0 0 0 1px $windowBorder;
  color: $windowColor;
  border-radius: 5px;
  z-index: 999;

  &__arrow, &__arrow:before {
    position: absolute;
    top: -12.5px;
    left: 50%;
    margin-left: -12.5px;

    width: 0;
    height: 0;
    border-left: 12.5px solid transparent;
    border-right: 12.5px solid transparent;
    border-bottom: 12.5px solid $windowBackground;

    content: '';

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

  &__arrow:before {
    top: -1px;
    border-bottom: 12px solid #1b1b1b;
    z-index: -1;
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

      &__arrow, &__arrow:before {
        top: auto;
        bottom: -11px;
        border-top: 12.5px solid $windowBackground;
        border-bottom: 0;
      }

      &__arrow:before {
        bottom: -1px;
        border-top: 12px solid #1b1b1b;
        z-index: -1;
      }
    }
  }
}
</style>