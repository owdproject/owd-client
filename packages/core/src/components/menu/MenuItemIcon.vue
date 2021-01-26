<template>
  <div class="menu-icon-image" v-if="icon.image" :style="imageStyle" />
  <v-icon v-else :style="iconStyle" v-text="iconName" />
</template>

<script>
export default {
  name: 'MenuItemIcon',
  props: {
    icon: [String,Object]
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
.menu-icon-image {
  background-position: center;
  width: 100%;
  height: 100%;
}
</style>