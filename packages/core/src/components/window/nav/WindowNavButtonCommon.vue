<template>
  <a class="btn">
    <v-icon>{{icon}}</v-icon>
  </a>
</template>

<script>
  export default {
    props: {
      icon: String
    }
  }
</script>

<style scoped lang="scss">
.btn {
  display: inline-block;
  text-align: center;
  cursor: pointer;

  .v-icon {
    font-size: 14px;
    vertical-align: -1px;
  }
}
</style>