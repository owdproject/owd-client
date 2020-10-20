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
    height: 34px;
    line-height: 34px;
    user-select: none;
    z-index: 10;

    > .window-nav-title {
      display: inline-block;
      width: 100%;
      padding-left: 12px;
      font-family: monospace, FreeMono;
      color: #FFF;
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

    > .window-nav-btn-group {
      display: flex;
      text-align: right;
      margin-right: 1px;

      .btn {
        display: inline-block;
        width: 33px;
        height: 34px;
        line-height: 34px;
        text-align: center;
        cursor: pointer;

        .v-icon {
          color: #aaa;
          font-size: 19px;
        }

        .mdi-open-in-new {
          font-size: 15px;
        }

        .mdi-window-maximize {
          font-size: 18px;
          vertical-align: -3px;
        }
      }
    }
  }
</style>
