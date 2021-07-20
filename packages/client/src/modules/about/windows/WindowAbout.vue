<template>
  <Window :title="data.title" :window="data">
    <div class="about-container">
      <h2>
        Open Web Desktop <span v-text="$store.state.core.client.version" />
      </h2>
      <a href="https://github.com/owdproject/owd-client">github.com/owdproject/owd-client</a>

      <div class="powered-by">
        <ul>
          <li>
            Powered by
          </li>
          <li><v-icon style="color: darkgrey;">mdi-vuejs</v-icon></li>
          <li><v-icon style="color: darkgrey;">mdi-language-javascript</v-icon></li>
        </ul>
      </div>
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
  div.about-container {
    text-align: center;
    margin-top: 40px;

    h2 {
      margin-bottom: 6px;

      span {
        opacity: 0.65;
      }
    }

    a {
      color: #5198ca;
    }

    .powered-by {
      ul {
        display: grid;
        grid-template-columns: 64% 18% 18%;
        margin: 20px auto 0 auto;
        max-width: 208px;
        line-height: 23px;
        opacity: 0.4;
        text-align: right;
        text-transform: uppercase;
        list-style-type: none;

        li:first-child {
          text-align: left;
        }
      }
    }
  }
</style>
