<template>
  <Window :title="data.title" :window="data">
    <div class="container">
      <h2>
        Open Web Desktop <span v-text="$store.state.core.client.version" />
      </h2>
      <a href="https://github.com/owdproject/owd-client">github.com/owdproject/owd-client</a>
    </div>
  </Window>
</template>

<script>
  import Window from '@owd-client/core/src/components/window/Window'

  export default {
    components: {Window},
    props: {
      data: Object
    }
  }
</script>

<style scoped lang="scss">
  div.container {
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
