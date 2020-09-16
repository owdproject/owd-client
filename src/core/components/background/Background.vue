<template>
  <div id="background-image" />
</template>

<script>
  export default {
    name: "Background"
  }
</script>

<style scoped lang="scss">
  #background-image {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-size: cover;
    background: #161616;
  }
</style>
