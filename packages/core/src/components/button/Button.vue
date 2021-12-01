<template>
  <button class="owd-btn">
    <slot />
  </button>
</template>

<style scoped lang="scss">
.owd-btn {
  position: relative;
  min-width: 32px;
  height: 32px;
  padding: 0;
  line-height: 32px;
  font-size: 12px;
  text-align: center;
  overflow: hidden;
}
</style>