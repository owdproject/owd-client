<template>
  <div class="menu-item">
    <div
      :class="['menu-item-square', {'custom-icon': icon.image}]"
      :style="menuItemStyles"
      v-ripple.500="'rgba(255, 255, 255, 0.1)'"
    >
      <MenuItemIcon :icon="icon" />
    </div>
    <div class="menu-item-name">
      <div class="menu-item-name-inner" v-html="title" />
    </div>
  </div>
</template>

<script>
import MenuItemIcon from './MenuItemIcon'

export default {
  name: 'MenuItem',
  components: {MenuItemIcon},
  props: {
    title: String,
    icon: String|Object,
    color: String,
  },
  computed: {
    menuItemStyles() {
      if (!this.icon || (this.icon && !this.icon.image)) {
        return `background: ${this.color}`
      }

      return ''
    }
  }
}
</script>

<style scoped lang="scss">
.menu-item {
  .menu-item-square {
    width: 48px;
    height: 100%;
    font-size: 24px;
    text-align: center;
    border-radius: 2px;
    transition: background 0.6s ease-in-out;
    will-change: background;
    float: left;

    &:not(.custom-icon) {
      background: darken($colorDefault, 7.5%);
    }

    .v-icon {
      color: white;
      vertical-align: 1px;
    }
  }

  .menu-item-name {
    background: #212121;
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
      color: #EEE;
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