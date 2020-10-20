<template>
  <v-system-bar id="system-bar" :dark="systemBar.dark">

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
  name: "SystemBar",
  components: {SystemBarStatus, SystemBarDate, SystemBarApplications},
  props: {
    systemBar: {
      type: Object,
      default: {
        enabled: false,
        dark: true
      }
    }
  }
}
</script>

<style scoped lang="scss">
#system-bar {
  cursor: default;
  user-select: none;

  .system-bar-applications-component {
    @media(max-width: 768px) {
      display: none;
    }

  }
}
</style>