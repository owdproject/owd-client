<template>
  <div class="owd-menu__item__icon">
    <div class="owd-menu__item__icon__image" v-if="icon.image && !forceSvg" :style="imageStyle" />
    <v-icon v-else :style="iconStyle">{{iconName}}</v-icon>
  </div>
</template>

<script>
export default {
  props: {
    icon: [String,Object],
    forceSvg: Boolean
  },
  computed: {
    iconName() {
      if (typeof this.icon === 'string') {
        return this.icon
      }

      if (typeof this.icon === 'object') {
        if (this.icon.name) return this.icon.name
      }

      return ''
    },
    iconStyle() {
      const styles = []

      if (typeof this.icon === 'object') {
        if (this.icon.offset) {
          if (this.icon.offset.x) {
            styles.push(`left: ${this.icon.offset.x}px;`)
          }
          if (this.icon.offset.y) {
            styles.push(`top: ${this.icon.offset.y}px;`)
          }
        }

        if (this.icon.size) {
          styles.push(`font-size: ${this.icon.size};`)
        }
        if (this.icon.width) {
          styles.push(`width: ${this.icon.width};`)
        }
        if (this.icon.height) {
          styles.push(`height: ${this.icon.width};`)
        }
        if (this.icon.background) {
          styles.push(`background-color: ${this.icon.background};`)
        }
        if (this.icon.color) {
          styles.push(`color: ${this.icon.color};`)
        }

        return styles.join(' ')
      }

      return null
    },
    imageStyle() {
      const styles = []

      if (typeof this.icon === 'object') {
        if (this.icon.offset) {
          if (this.icon.offset.x) {
            styles.push(`left: ${this.icon.offset.x}px;`)
          }
          if (this.icon.offset.y) {
            styles.push(`top: ${this.icon.offset.y}px;`)
          }
        }
        if (this.icon.image) {
          styles.push(`background-image: url(${this.icon.image});`)
        }
        if (this.icon.size) {
          styles.push(`background-size: ${this.icon.size};`)
        }

        return styles.join(' ')
      }

      return null
    }
  }
}
</script>

<style scoped lang="scss">
.owd-menu__item__icon {
  height: 100%;

  &__image {
    height: 100%;
    background-position: center;
    background-repeat: no-repeat;
  }
}
i {
  position: relative;
  font-size: 24px;
  vertical-align: 1px;
}
</style>