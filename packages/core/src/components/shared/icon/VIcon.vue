<script>
import { h } from 'vue'

// temporary VIcon (until Vuetify 3 is ready)
export default {
  render() {
    let iconClass = this.$attrs.textContent;
    let iconClassPrefix = ''

    if (iconClass && iconClass.startsWith('mdi-')) {
      iconClassPrefix = 'owd-icon mdi '
    }

    return h('span', {
      class: iconClassPrefix + iconClass
    })
  }
}
</script>

<style lang="scss">
.owd-icon {
  position: relative;
  display: inline-block;
  text-indent: -9999px;
  width: 100%;

  &:before {
    position: absolute;
    top: 0;
    left: 0;
    text-indent: initial;
    width: 100%;
    height: 100%;
  }
}
</style>