<template>
  <li>
    <div
        :class="['menu-item', { active: window.storage.opened && !window.storage.minimized }]"
        @click="(e) => windowToggle(e, window)"
    >
      <div class="menu-item-square" :style="menuItemStyles">
        <MenuItemIcon :icon="window.config.icon"/>
      </div>
      <div class="menu-item-name">
        <div class="menu-item-name-inner" v-html="window.config.titleShort || window.config.title"/>
      </div>
    </div>

  </li>
</template>

<script>
import MenuItemIcon from './MenuItemIcon'
import {getCurrentInstance} from "vue";
import {useStore} from "vuex";

export default {
  name: 'MenuItem',
  components: {MenuItemIcon},
  props: {
    window: Object
  },
  setup() {
    const app = getCurrentInstance();
    const store = useStore()
    const $device = app.appContext.config.globalProperties.$device

    return {
      menuItemStyles: () => {
        if (!this.window.icon || (this.window.color && !this.window.icon.image)) {
          return `background: ${this.window.color}`
        }

        return ''
      },
      windowToggle: (event, window) => {
        // from mobile
        if ($device.mobile) {

          if (window.storage.opened) {
            store.dispatch('core/window/windowClose', window)
          } else {
            store.dispatch('core/window/windowCloseAll')
            store.dispatch('core/window/windowOpen', window)
          }

        }

        // from desktop
        if (event.shiftKey) {

          // force close with shiftkey
          store.dispatch('core/window/windowMinimize', window)

        } else {

          if (window.dummy) {

            // create new window
            store.dispatch('core/window/windowCreate', window.config.name)

          } else {

            if (window.storage && (!window.storage.opened || window.storage.minimized)) {
              store.dispatch('core/window/windowOpen', window)
            } else {
              store.dispatch('core/window/windowMinimize', window)
            }

          }

        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.menu-item {
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

  .menu-item-square {
    width: 48px;
    height: 48px;
    font-size: 24px;
    text-align: center;
    border-radius: 2px;
    background: darken($menuItemSquareBackground, 7.5%);
    transition: background 0.6s ease-in-out;
    will-change: background;
    float: left;

    .v-icon {
      color: $menuItemSquareColor;
      vertical-align: 1px;
    }
  }

  .menu-item-name {
    background: $menuItemTitleBackground;
    transition: width 0.3s ease-in-out;
    overflow: hidden;
    float: left;
    width: 0;
    height: 48px;
    line-height: 48px;
    border-radius: 2px;
    word-spacing: -1px;
    font-size: 18px;
    margin-left: 4px;

    .menu-item-name-inner {
      padding: 0 12px;
    }
  }

  @media (max-width: 560px) {
    .menu-square {
      position: relative !important;
      width: 48px;
      z-index: 3;
      float: none;
      margin: 0 0 0 4px;
      box-shadow: -4px 0 0 0 #171717;
    }

    .menu-item-name {
      position: fixed;
      left: 15px;
      right: 15px;
      bottom: 15px;
      margin: 0;
      box-shadow: 1px 0 0 0 #141416, -20px 0 15px 0 #141416;
      transition: none;
      width: auto;
      height: 48px;
      line-height: 48px;
      display: none;
    }

    &:hover {
      .menu-item-name {
        display: block;
      }
    }
  }
}
</style>