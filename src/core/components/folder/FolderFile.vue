<template>
  <li class="file" :class="{ inactive }">
    <a :target="target" :href="url" :title="title" @click="fn">
      <img :src="icon" :alt="title" />
      <div class="name" v-html="name" />
    </a>
  </li>
</template>

<script>
  export default {
    name: "FolderFile",
    props: {
      name: String,
      title: String,
      icon: String,
      url: String,
      target: String,
      inactive: Boolean,
      fn: {
        type: Function,
        default: function () {}
      },
    }
  }
</script>

<style lang="scss">
  li.file a div.name span.sup {
    display: inline-block;
    font-size: 9px;
    height: 14px;
    line-height: 12px;
    transform: translateY(-3px);
    color: rgba(255, 255, 255, 0.15);
    margin-left: 1px;
  }
</style>

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
        border: 1px solid rgba(255, 255, 255, 0.2);
        background: rgba(255, 255, 255, 0.08);
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
