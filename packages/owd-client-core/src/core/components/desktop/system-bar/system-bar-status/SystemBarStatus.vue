<template>
  <div>
    <slot name="prepend" />

    <v-icon>mdi-signal-cellular-outline</v-icon>

    <SystemBarStatusBattery />

    <slot name="append" />
  </div>
</template>

<script>
import SystemBarStatusBattery
  from "./battery/SystemBarStatusBattery";
export default {
  name: "SystemBarStatus",
  components: {SystemBarStatusBattery}
}
</script>