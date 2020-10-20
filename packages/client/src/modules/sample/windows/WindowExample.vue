<template>
  <Window :title="data.title" :window="data">
    <p>
      Hello world! I'm an empty window.
    </p>
  </Window>
</template>

<script>
  import Window from "@owd-client/core/src/components/window/Window";
  export default {
    name: "WindowExample",
    components: {Window},
    props: {
      data: Object
    }
  }
</script>

<style scoped lang="scss">
  p {
    color: #AAA;
  }
</style>
