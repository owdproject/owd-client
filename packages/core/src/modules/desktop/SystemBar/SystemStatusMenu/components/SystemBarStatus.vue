<template>
  <div>
    <slot name="prepend" />

    <SystemBarStatusBattery />

    <slot name="append" />
  </div>
</template>

<script>
import SystemBarStatusBattery from "./battery/SystemBarStatusBattery";

export default {
  components: {SystemBarStatusBattery}
}
</script>