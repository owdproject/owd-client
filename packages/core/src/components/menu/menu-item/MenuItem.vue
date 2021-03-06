<template>
  <li>
    <div
        :class="['owd-menu__item', {
          'owd-menu__item--active': window.storage.opened && !window.storage.minimized
        }]"
        @click="(e) => windowToggle(e, window)"
    >
      <div class="owd-menu__item__square" :style="menuItemStyles">
        <MenuItemIcon :icon="window.config.icon"/>
      </div>
      <div class="owd-menu__item__name">
        <div class="owd-menu__item__name-inner" v-html="window.config.titleShort || window.config.title"/>
      </div>
    </div>

  </li>
</template>

<script>
import MenuItemIcon from './MenuItemIcon'
import {getCurrentInstance, computed} from "vue";
import {useStore} from "vuex";

export default {
  components: {MenuItemIcon},
  props: {
    window: Object
  },
  setup(props) {
    const app = getCurrentInstance();
    const store = useStore()
    const $device = app.appContext.config.globalProperties.$device

    return {
      menuItemStyles: computed(() => {
        if (!props.window.config.icon || (props.window.config.color && !props.window.config.icon.image)) {
          return `background: ${props.window.config.color}`
        }

        return ''
      }),
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
              store.dispatch('core/window/windowFocus', window)
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
.owd-menu__item {
  height: 48px;
  line-height: 48px;
  margin-bottom: 4px;
  padding: 0;
  font-family: $fontTitle;
  font-size: 17px;
  text-align: left;
  cursor: pointer;

  &:hover {
    .owd-menu__item__name {
        width: 148px;
    }
  }

  &__name {
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

    &-inner {
      padding: 0 12px;
    }
  }

  &__square {
    width: 48px;
    height: 48px;
    line-height: 45px;
    font-size: 24px;
    text-align: center;
    border-radius: 2px;
    background: darken($menuItemSquareBackground, 8%);
    transition: background 0.5s ease-in-out;
    will-change: background;
    float: left;

    .v-icon {
      color: $menuItemSquareColor;
      vertical-align: 1px;
    }
  }

  &--active &__square {
    background: $menuItemSquareBackground;
  }

  @media (max-width: 560px) {
    &__square {
      position: relative !important;
      width: 48px;
      z-index: 3;
      float: none;
      margin: 0 0 0 4px;
      box-shadow: -4px 0 0 0 #171717;
    }

    &__name {
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
      .owd-menu__item__name {
        display: block;
      }
    }
  }
}
</style>