<template>
  <div class="owd-window__nav">

    <div
      class="owd-window__nav__title"
      v-text="title"
      @dblclick="$emit('toggleMaximize')"
    />

    <div class="owd-window__nav__btn-group">
      <slot />
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

<style scoped lang="scss">
  .owd-window__nav {
    position: relative;
    display: flex;
    height: $desktopSystemBarHeight;
    line-height: $desktopSystemBarHeight;
    user-select: none;

    &__title {
      display: inline-block;
      width: 100%;
      padding-left: 12px;
      color: $windowNavTitleColor;
      cursor: default;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      a {
        color: inherit;
        text-decoration: none;
        margin-right: 8px;
      }
    }

    &__btn-group {
      display: flex;
      position: absolute;
      right: 0;

      .btn {
        display: inline-block;
        width: $desktopSystemBarHeight;
        text-align: center;
        cursor: pointer;

        .v-icon {
          color: $windowNavTitleColor;
          font-size: 19px;
        }
      }
    }
  }
</style>
