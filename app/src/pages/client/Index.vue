<template>
  <Desktop>
    <Logo :title="$store.state['core/client'].title" />
  </Desktop>
</template>

<script setup>
import Logo from '@owd-client/core/src/components/logo/Logo.vue'
</script>