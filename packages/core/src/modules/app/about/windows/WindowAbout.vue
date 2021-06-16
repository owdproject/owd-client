<template>
  <WindowApp :window="window">
    <div class="container">
      <h2>
        Open Web Desktop <span v-text="clientVersion" />
      </h2>
      <a href="https://github.com/owdproject/owd-client/tree/next" target="_blank">github.com/owdproject/owd-client</a>

      <div class="powered-by">
        <ul>
          <li>
            Powered by
          </li>
          <li><v-icon size="24">mdi-vuejs</v-icon></li>
          <li><v-icon size="24">mdi-language-typescript</v-icon></li>
        </ul>
      </div>
    </div>
  </WindowApp>
</template>

<script setup>
  import {defineProps} from 'vue'
  import {useStore} from "vuex";

  const store = useStore()

  const props = defineProps({
    window: Object
  })

  const clientVersion = store.state['core/client'].version
</script>

<style lang="scss">
.owd-window-about {
  .owd-window__content {
    display: flex;
    align-items: center;
  }
}

#app[os-name="windows"][os-version="95"] {
  .owd-window-about {
    .powered-by .v-icon {
      color: #777 !important;
    }
  }
}
</style>

<style scoped lang="scss">
.container {
  margin: 0 auto;
  text-align: center;

  h2 {
    margin-bottom: 6px;

    span {
      opacity: 0.65;
    }
  }

  a {
    color: var(--v-primary);
    font-size: 14px;
  }

  .powered-by {
    ul {
      display: grid;
      grid-template-columns: 64% 18% 18%;
      margin: 20px auto 0 auto;
      padding: 0 0 0 3px;
      max-width: 210px;
      line-height: 23px;
      opacity: 0.4;
      text-align: right;
      text-transform: uppercase;
      list-style-type: none;

      li:first-child {
        text-align: left;
      }

      .v-icon {
        color: darkgrey;
      }
    }
  }
}
</style>
