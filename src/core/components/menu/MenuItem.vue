<template>
  <li
    v-if="window.config.menu || typeof window.config.menu === 'boolean' && window.storage.menu"
    :class="{ active: !window.storage.closed && !window.storage.minimized }"
    :data-window="window.name"
    @click="windowToggle"
  >
    <div
      class="menu-square"
      :style="`background: ${window.color}`"
      v-ripple.500="'rgba(255, 255, 255, 0.1)'"
    >
      <MenuItemIcon :icon="window.icon" />
    </div>
    <div class="name">
      <div
        class="name-inner"
        v-html="(window.titleShort || window.title)"
      />
    </div>
  </li>
</template>

<script>
import MenuItemIcon from './MenuItemIcon'

export default {
  name: 'MenuItem',
  components: {MenuItemIcon},
  props: {
    window: Object // window object data
  },
  methods: {
    /**
       * Toggle window visibility
       */
    windowToggle: function (event) {
      if (this.$device.mobile) {

        if (!this.window.storage.closed) {
          this.$store.dispatch('core/windows/windowClose', this.window)
        } else {
          this.$store.dispatch('core/windows/windowCloseAll')
          this.$store.dispatch('core/windows/windowOpen', this.window)
        }

      } else {

        if (event.shiftKey) {

          // force close with shiftkey
          this.$store.dispatch('core/windows/windowMinimize', this.window)

        } else {

          if (this.window.storage && (this.window.storage.closed || this.window.storage.minimized)) {
            this.$store.dispatch('core/windows/windowOpen', this.window)
          } else {
            // don't close if window has to stay minimized
            if (this.window.config.menu === true) {
              this.$store.dispatch('core/windows/windowClose', this.window)
            } else {
              this.$store.dispatch('core/windows/windowMinimize', this.window)
            }
          }
        }

      }
    }
  }
}
</script>
