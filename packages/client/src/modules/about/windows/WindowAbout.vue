<template>
  <Window :window="window">
    <div class="container">
      <h2>
        Open Web Desktop <span>2.0.0-alpha</span>
      </h2>
      <a href="https://github.com/owdproject/owd-client/tree/next">github.com/owdproject/owd-client</a>
    </div>
  </Window>
</template>

<script>
  import Window from "@owd-client/core/src/components/window/Window";

  export default {
    components: {Window},
    props: {
      window: Object
    }
  }
</script>

<style scoped lang="scss">
.container {
  text-align: center;
  margin-top: 50px;

  h2 {
    margin-bottom: 6px;

    span {
      opacity: 0.65;
    }
  }

  a {
    color: #5198ca;
  }
}
</style>
