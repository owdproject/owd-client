<template>
  <div>
    <slot name="prepend" />

    <SystemBarStatusBattery />

    <slot name="append" />
  </div>
</template>

<script setup>
import SystemBarStatusBattery from "./SystemBarStatusBattery";
</script>