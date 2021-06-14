<template>
  <li :class="['file', { 'inactive': props.inactive }]">
    <a :href="props.url" :target="props.target" :title="props.title" @click="props.fn">
      <img :src="props.icon" :alt="props.title" />
      <div class="name" v-html="props.name" />
    </a>
  </li>
</template>

<script setup>
import {defineProps} from "vue";

const props = defineProps({
  name: String,
  title: String,
  icon: String,
  url: String,
  target: String,
  inactive: Boolean,
  fn: {
    type: Function,
    default: function () {}
  }
})
</script>

<style scoped lang="scss">
  li.file {
    width: 100px;
    margin: 0 5px 5px 0;
    text-align: center;
    float: left;
    border-radius: 2px;
    border: 1px solid rgba(0, 0, 0, 0);

    @media(max-width: 480px) {
      margin-right: 0;
    }

    @media(min-width: 480px) {
      &:not(.inactive):hover {
        border: 1px solid $owd-window-item-border-color;
        background: $owd-window-item-background-hover;
      }
    }

    &.inactive {
      filter: grayscale(100%);
      opacity: 0.2;
    }

    a {
      display: block;
      color: #CCC;
      text-decoration: none;
      transition: color 0.15s ease-in-out;
      padding: 10px 0;

      img {
        vertical-align: middle;
        height: 32px;
        border-radius: 2px;
      }

      div.name {
        font-size: 12px;
        letter-spacing: -0.2px;
        line-height: 10px;
        margin-top: 10px;
        cursor: pointer;
      }
    }
  }
</style>
