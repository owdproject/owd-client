<template>
  <v-icon :style="iconStyle" v-text="iconName" />
</template>

<script>
  export default {
    name: "MenuItemIcon",
    props: ['icon'],
    computed: {
      iconName() {
        if (typeof this.icon === 'string') {
          return `mdi-${this.icon}`
        }

        if (typeof this.icon === 'object') {
          if (this.icon.name) return `mdi-${this.icon.name}`
        }

        return ''
      },
      iconStyle() {
        let styles = [];

        if (typeof this.icon === 'object') {
          if (this.icon.offset) {
            if (this.icon.offset.x) {
              styles.push(`left: ${this.icon.offset.x}px;`)
            }
            if (this.icon.offset.y) {
              styles.push(`top: ${this.icon.offset.y}px;`)
            }
            if (this.icon.size) {
              styles.push(`font-size: ${this.icon.size};`)
            }

            return styles.join(' ')
          }
        }

        return null
      }
    }
  }
</script>
