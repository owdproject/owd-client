<template>
  <div class="owd-folder">
    <ul>
      <slot />
    </ul>
  </div>
</template>

<script>
export default {
  props: {
    projects: Object
  }
}
</script>

<style scoped lang="scss">
  .owd-folder {
    ul {
      margin: 0;
      padding: 0;
      list-style-type: none;
      width: calc(100% + 5px);
    }
  }
</style>
