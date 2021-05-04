<template>
  <div class="owd-window-icon">
    <div
        v-if="(props.icon.image && !props.forceSvg) || (props.forceSvg && !iconName)"
        class="owd-window-icon__image"
        :style="imageStyle"
    />
    <v-icon v-else :style="iconStyle">{{iconName}}</v-icon>
  </div>
</template>

<script setup>
import {defineProps, computed} from "vue";

const props = defineProps({
  icon: [String,Object],
  isApplicationMenu: Boolean,
  forceSvg: Boolean
})

const iconName = computed(() => {
  if (typeof props.icon === 'string') {
    return props.icon
  }

  if (typeof props.icon === 'object') {
    if (props.icon.name) return props.icon.name
  }

  return ''
})

const iconStyle = computed(() => {
  const styles = []

  if (typeof props.icon === 'object') {
    if (props.icon.offset) {
      if (props.icon.offset.x) {
        styles.push(`margin-left: ${props.icon.offset.x}px;`)
      }
      if (props.icon.offset.y) {
        styles.push(`margin-top: ${props.icon.offset.y}px;`)
      }
    }
    if (props.icon.size) {
      styles.push(`font-size: ${props.icon.size};`)
    }
    if (props.icon.width) {
      styles.push(`width: ${props.icon.width};`)
    }
    if (props.icon.height) {
      styles.push(`height: ${props.icon.width};`)
    }
    if (props.icon.color && !props.isApplicationMenu) {
      styles.push(`color: ${props.icon.color};`)
    }

    return styles.join(' ')
  }

  return null
})
</script>

<style scoped lang="scss">
.owd-window-icon {
  position: relative;
  height: 100%;

  &__image {
    height: 100%;
    background-position: center;
    background-repeat: no-repeat;
    background-size: contain;
  }

  i {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 24px;
  }
}
</style>