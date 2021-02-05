<template>
  <a class="owd-desktop__system-bar__menu">
    <slot />
  </a>
</template>

<style scoped lang="scss">
a.owd-desktop__system-bar__menu {
  display: inline-block;
  padding: 0 12px;

  &:hover {
    color: white;
  }
}
</style>