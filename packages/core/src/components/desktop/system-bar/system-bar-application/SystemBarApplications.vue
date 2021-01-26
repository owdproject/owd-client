<template>
  <ul class="system-bar-applications">
    <li>
      Activities
    </li>
    <li>
      Applications
    </li>
  </ul>
</template>

<script>
export default {
  name: "SystemBarApplications"
}
</script>

<style scoped lang="scss">
ul.system-bar-applications {
  font-size: 12px;
  font-weight: bold;

  li {
    display: inline-block;
    margin-right: 25px;

    .v-icon {
      margin-left: -2px;
    }
  }
}
</style>