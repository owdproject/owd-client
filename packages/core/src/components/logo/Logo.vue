<template>
  <div class="owd-logo" v-if="desktopConfig && desktopConfig.options.Logo.enabled">
    <h2 v-text="props.title" />
  </div>
</template>

<script setup>
import {inject} from "vue";

const desktopConfig = inject('desktopConfig')

const props = defineProps({
  title: {
    type: String,
    default: 'owd-client'
  }
})
</script>

<style lang="scss">
  .owd-logo {
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
