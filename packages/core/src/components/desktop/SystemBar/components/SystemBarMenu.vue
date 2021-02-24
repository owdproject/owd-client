<template>
  <a class="owd-desktop__system-bar__menu">
    <slot />
  </a>
</template>

<style scoped lang="scss">
a.owd-desktop__system-bar__menu {
  display: inline-block;
  padding: 0 12px;
  font-family: $desktopTitleFontFamily;
  font-size: $desktopTitleFontSize;
  font-weight: $desktopTitleFontWeight;

  &:hover {
    color: white;
  }
}
</style>