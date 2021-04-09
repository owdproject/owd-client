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

<script>
export default {
  props: {
    title: String
  }
}
</script>

<style lang="scss">
  .owd-window__nav {
    position: relative;
    display: flex;
    height: $windowNavHeight;
    line-height: $windowNavHeight;
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
      padding-left: 12px;
      color: $windowNavTitleColor;
      cursor: default;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      pointer-events: none;

      &-inner {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        max-width: 65%;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      a {
        color: inherit;
        text-decoration: none;
      }
    }

    &__btn-group {
      display: flex;
      position: absolute;
      height: 100%;
      align-items: center;

      &--prepend {
        left: 7px;

        a, button {
          margin-right: 6px;
        }
      }

      &--append {
        right: 7px;

        a, button {
          margin-left: 6px;
        }
      }
    }

    .v-btn {
      position: relative;
      height: 31px;
      min-width: 36px;
      padding: 0;
      text-transform: initial;
      box-shadow: none;
      overflow: hidden;

      &__overlay,
      .v-ripple__container {
        display: none;
      }
    }
  }
</style>
