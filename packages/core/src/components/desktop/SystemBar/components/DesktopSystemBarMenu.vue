<template>
  <a class="system-bar-menu">
    <slot />
  </a>
</template>

<script>
  export default {
    name: "DesktopSystemBarMenu"
  }
</script>

<style scoped lang="scss">
a.system-bar-menu {
  display: inline-block;
  padding: 0 12px;

  &:hover {
    color: white;
  }
}
</style>