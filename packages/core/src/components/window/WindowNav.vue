<template>
  <div class="window-nav">
    <div
      class="window-nav-title"
      v-text="title"
      @dblclick="$emit('toggleMaximize')"
    />
    <div class="window-nav-btn-group">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'WindowNav',
  props: {
    title: String
  }
}
</script>

<style scoped lang="scss">
  .window-nav {
    position: relative;
    display: flex;
    height: 38px;
    line-height: 40px;
    user-select: none;

    .window-nav-title {
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

    .window-nav-btn-group {
      display: flex;
      text-align: right;

      .btn {
        display: inline-block;
        width: 38px;
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
