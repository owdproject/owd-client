<template>
  <div>
    <slot name="prepend" />

    <SystemBarStatusBattery />

    <slot name="append" />
  </div>
</template>

<script>
import SystemBarStatusBattery from "./SystemBarStatusBattery";

export default {
  components: {SystemBarStatusBattery}
}
</script>