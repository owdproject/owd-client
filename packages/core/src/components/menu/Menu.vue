<template>
  <div id="menu">
    <ul class="menu-group">
      <slot name="prepend" />

      <template v-for="windowInstance of windowInstances">
        <li
          v-if="windowInstance.config.menu || typeof windowInstance.config.menu === 'boolean' && windowInstance.storage.menu"
          :class="{ active: !windowInstance.storage.closed && !windowInstance.storage.minimized }"
          :data-window="windowInstance.name"
        >
          <MenuItem
            :title="windowInstance.config.titleShort || windowInstance.config.title"
            :color="windowInstance.config.color"
            :icon="windowInstance.config.icon"
            :data-menu-id="windowInstance.uniqueID"
            :key="windowInstance.uniqueID"
            @click="(e) => windowToggle(e, windowInstance)"
          />
        </li>
      </template>

      <slot name="append" />
    </ul>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import MenuItem from './MenuItem.vue'

export default {
  name: 'Menu',
  components: {
    MenuItem
  },
  computed: {
    ...mapGetters({
      windowInstances: 'core/window/windowInstances'
    })
  },
  methods: {
    /**
     * Toggle window visibility
     */
    windowToggle: function (event, windowInstance) {
      if (this.$device.mobile) {

        if (!windowInstance.storage.closed) {
          this.$store.dispatch('core/window/windowClose', windowInstance)
        } else {
          this.$store.dispatch('core/window/windowCloseAll')
          this.$store.dispatch('core/window/windowOpen', windowInstance)
        }

      } else {

        if (event.shiftKey) {

          // force close with shiftkey
          this.$store.dispatch('core/window/windowMinimize', windowInstance)

        } else {

          if (windowInstance.storage && (windowInstance.storage.closed || windowInstance.storage.minimized)) {
            this.$store.dispatch('core/window/windowOpen', windowInstance)
          } else {
            // don't close if window has to stay minimized
            if (windowInstance.config.menu === true) {
              this.$store.dispatch('core/window/windowClose', windowInstance)
            } else {
              this.$store.dispatch('core/window/windowMinimize', windowInstance)
            }
          }
        }

      }
    }
  }
}
</script>

<style lang="scss">
#menu {
  position: absolute;
  top: 0;
  left: 24px;
  padding: 0;
  margin: 24px 0;
  z-index: 9;
  user-select: none;
  transition: transform 0.25s ease-in-out;

  &:hover {
    z-index: 12;
  }

  &:not(:hover).autohide {
    @media (min-width: 560px) {
      transform: translateX(-80px);
    }
  }

  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;

    li {
      color: $menuItemTitleColor;
      height: 48px;
      line-height: 48px;
      margin-bottom: 4px;
      padding: 0;
      font-family: $fontTitle;
      font-size: 17px;
      text-align: left;
      cursor: pointer;

      &:after {
        display: block;
        content: '';
        clear: both;
      }

      @media (min-width: 559px) {
        &:hover {
          .menu-item-name {
            width: 148px;
          }
        }
      }

      &.active .menu-item-square:not(.custom-icon) {
        background: $menuItemSquareBackground;
      }
    }
  }

  @media (max-width: 560px) {
    top: auto;
    left: 15px;
    right: 15px;
    bottom: 15px;
    margin: 0;
    padding: 0;

    ul {
      float: right;

      li {
        height: 48px;
        line-height: 48px;
        float: left;
        margin: 4px 0 0 0;
      }
    }
  }
}
</style>
