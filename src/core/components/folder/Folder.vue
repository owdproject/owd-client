<template>
  <div class="folder">
    <ul>
      <slot />
    </ul>
  </div>
</template>

<script>
  export default {
    name: "Folder",
    props: {
      projects: Object
    }
  }
</script>

<style scoped lang="scss">
  .folder {
    ul {
      margin: 0;
      padding: 0;
      list-style-type: none;
      width: calc(100% + 5px);
    }
  }
</style>
