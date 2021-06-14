<template>
  <li>
    <div
        :class="['owd-menu__item', {
          'owd-menu__item--active': window.storage.opened && !window.storage.minimized
        }]"
        @click="(e) => windowToggle(e, window)"
    >
      <div class="owd-menu__item__icon" :style="menuItemStyles">
        <WindowIconMenu :icon="window.config.icon" />
      </div>
      <div class="owd-menu__item__name">
        <div class="owd-menu__item__name-inner" v-html="window.config.titleMenu || window.config.title"/>
      </div>
    </div>

  </li>
</template>

<script setup>
import {getCurrentInstance, defineProps, computed} from "vue";
import {useStore} from "vuex";
import WindowIconMenu from '../../window/icon/WindowIconMenu.vue'

const props = defineProps({
  window: Object
})

const app = getCurrentInstance();
const store = useStore()

// todo implement using vuetify
const isMobile = false

const menuItemStyles = computed(() => {
  let background = null

  if (props.window.config.theme) {
    background = props.window.config.theme
  }

  if (props.window.config.icon && props.window.config.icon.background) {
    background = props.window.config.icon.background
  }

  if (!props.window.config.icon || (background && !props.window.config.icon.image)) {
    return `background: ${background}`
  }

  return ''
})

const windowToggle = async (event, window) => {
  // from mobile
  if (isMobile) {
    await store.dispatch('core/window/windowMinimizeAll')
  }

  if (window.dummy) {

    // create new window
    await store.dispatch('core/window/windowCreate', window.config.name)

  } else {

    if (window.storage.minimized || !window.storage.opened) {
      await store.dispatch('core/window/windowCreate', window)
    } else {
      await store.dispatch('core/window/windowMinimize', window)
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
  font-family: $owd-font-title;
  font-size: 17px;
  text-align: left;
  cursor: pointer;

  &:hover {
    .owd-menu__item__name {
        width: 148px;

        @media (max-width: 560px) {
          width: auto;
        }
    }
  }

  &__name {
    background: $owd-dock-item-title-background;
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

  &__icon {
    width: 48px;
    height: 48px;
    line-height: 45px;
    font-size: 24px;
    text-align: center;
    border: $owd-dock-item-square-border;
    border-color: $owd-dock-item-square-border-color;
    border-radius: $owd-dock-item-square-border-radius;
    background: darken($owd-dock-item-square-background, 8%);
    color: $owd-dock-item-square-icon;
    transition: background 0.5s ease-in-out;
    will-change: background;
    float: left;
  }

  &--active &__icon {
    background: $owd-dock-item-square-background;
  }

  @media (max-width: 560px) {
    &__icon {
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