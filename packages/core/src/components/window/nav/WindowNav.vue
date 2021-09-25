<template>
  <div class="owd-window__nav">

    <div class="owd-window__nav__draggable" />

    <div class="owd-window__nav__btn-group owd-window__nav__btn-group--prepend">
      <slot name="nav-prepend" />
    </div>

    <div
        class="owd-window__nav__title"
        @dblclick="$emit('toggleMaximize')"
    >
      <div class="owd-window__nav__title-inner" v-text="title" />
    </div>

    <div class="owd-window__nav__btn-group owd-window__nav__btn-group--append">
      <slot name="nav-append" />
    </div>

  </div>
</template>

<script setup>
const props = defineProps({
  title: String
})
</script>

<style lang="scss">
.owd-window {
  &__nav {
    position: relative;
    display: flex;
    height: $owd-window-nav-height;
    line-height: $owd-window-nav-height;
    padding: $owd-window-nav-padding;
    border: $owd-window-nav-border;
    border-color: $owd-window-nav-border-color-inactive;
    background: $owd-window-nav-background-inactive;
    box-shadow: $owd-window-nav-box-shadow-inactive;
    box-sizing: content-box;
    font-family: $owd-window-nav-title-font-family;
    font-weight: $owd-window-nav-title-font-weight;
    font-size: $owd-window-nav-title-font-size;
    user-select: none;
    z-index: 1;

    &__draggable {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 100%;
    }

    &__title {
      display: inline-block;
      width: 100%;
      text-align: $owd-window-nav-title-align;
      padding: $owd-window-nav-title-padding;
      color: $owd-window-nav-color-inactive;
      cursor: default;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      pointer-events: none;

      a {
        color: inherit;
        text-decoration: none;
      }
    }

    &__btn-group {
      display: flex;
      height: 100%;
      align-items: center;

      &--append {
        right: 0;
      }
    }

    .v-btn.v-btn--density-default {
      position: relative;
      min-width: $owd-window-button-width;
      height: $owd-window-button-height;
      padding: $owd-window-button-padding;
      line-height: $owd-window-button-height;
      font-size: $owd-window-nav-button-font-size;
      overflow: hidden;

      a {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
    }
  }

  &--focused {
    .owd-window__nav {
      background: $owd-window-nav-background;
      box-shadow: $owd-window-nav-box-shadow;
      border-color: $owd-window-nav-border-color;

      &__title {
        color: $owd-window-nav-color;
      }
    }
  }
}
</style>
