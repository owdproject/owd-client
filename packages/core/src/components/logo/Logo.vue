<template>
  <div class="owd-logo" v-if="enabled">
    <h2 v-text="title" />
  </div>
</template>

<script>
import {getCurrentInstance} from "vue";

export default {
  props: {
    title: {
      type: String,
      default: 'owd-client'
    }
  },
  setup() {
    const app = getCurrentInstance()
    const logoOptions = app.appContext.config.owd.desktop.Logo.options

    return {
      enabled: logoOptions.enabled
    }
  }
}
</script>

<style lang="scss">
  .owd-logo {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 24px;
    cursor: default;
    user-select: none;
    transition: transform 1s;

    @media (max-width: 768px) {
      padding: 17px 24px;
      display: none;
    }

    @media (max-width: 560px) {
      padding: 26px 24px;
      display: block;
    }

    @media (min-width: 561px) and (max-width: 768px) and (max-height: 414px) {
      display: none;
    }

    @media (max-width: 430px) {
      display: none;
    }

    h2 {
      position: relative;
      display: block;
      color: #DCDCDC;
      height: 28px;
      line-height: 24px;
      margin: 0 0 0 -1px;
      font-size: 28px;

      sup {
        color: #3C3C3C;
        font-size: 12px;
        font-weight: bold;
        position: absolute;
        height: 11px;
        line-height: 11px;
        top: -5px;
        margin-left: 5px;
      }

      .typed {
        color: white;
      }
    }
  }
</style>
