<template>
  <v-system-bar id="system-bar">

    <SystemBarApplications class="system-bar-applications-component" />

    <v-spacer class="system-bar-applications-component" />
    <SystemBarDate />
    <v-spacer />

    <SystemBarStatus>
      <template>
        <slot name="system-bar-status-prepend" />
      </template>
      <template v-slot:append>
        <slot name="system-bar-status-append" />
      </template>
    </SystemBarStatus>

  </v-system-bar>
</template>

<script>
import SystemBarApplications from "./system-bar-application/SystemBarApplications";
import SystemBarDate from "./system-bar-date/SystemBarDate";
import SystemBarStatus from "./system-bar-status/SystemBarStatus";
export default {
  name: "DesktopSystemBar",
  components: {SystemBarStatus, SystemBarDate, SystemBarApplications},
  props: {
    systemBar: Boolean
  }
}
</script>

<style scoped lang="scss">
#system-bar {
  display: grid;
  grid-template-columns: 30% 40% 30%;
  cursor: default;
  height: 32px;
  line-height: 33px;
  font-size: 13.5px;
  font-weight: bold;
  user-select: none;

  .system-bar-applications-component {
    @media(max-width: 768px) {
      display: none;
    }
  }
}
</style>