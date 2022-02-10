<template>
  <div class="owd-window__nav" @dblclick="$emit('toggleMaximize')">

    <div class="owd-window__nav__draggable" />

    <div class="owd-window__nav__btn-group owd-window__nav__btn-group--prepend">
      <slot name="nav-prepend" />
    </div>

    <div
        v-if="hasNavTitle"
        class="owd-window__nav__title"
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
  title: String,
  hasNavTitle: Boolean
})
</script>

<style scoped lang="scss">
.owd-window {
  &__nav {
    position: relative;
    display: flex;
    height: var(--owd-window-nav-height);
    line-height: var(--owd-window-nav-height);
    padding: var(--owd-window-nav-padding);
    border: var(--owd-window-nav-border);
    border-color: var(--owd-window-nav-border-color-inactive);
    background: var(--owd-window-nav-background-inactive);
    box-shadow: var(--owd-window-nav-box-shadow-inactive);
    box-sizing: content-box;
    font-family: var(--owd-window-nav-title-font-family);
    font-weight: var(--owd-window-nav-title-font-weight);
    font-size: var(--owd-window-nav-title-font-size);
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
      text-align: var(--owd-window-nav-title-align);
      padding: var(--owd-window-nav-title-padding);
      color: var(--owd-window-nav-color-inactive);
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

      &--prepend {
        width: 100%;
      }

      &--prepend + &__title {
        width: auto;
      }

      &--append {
        right: 0;
      }
    }
  }

  &--focused {
    .owd-window__nav {
      background: var(--owd-window-nav-background);
      box-shadow: var(--owd-window-nav-box-shadow);
      border-color: var(--owd-window-nav-border-color);

      &__title {
        color: var(--owd-window-nav-color);
      }
    }
  }
}
</style>
