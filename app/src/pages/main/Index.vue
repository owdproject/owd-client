<template>
  <Desktop>
    <Logo :title="$store.state['core/client'].title" />

    <WindowsContainer />
  </Desktop>
</template>

<script setup>
import Logo from '@owd-client/core/src/components/logo/Logo.vue'
import WindowsContainer from '@owd-client/core/src/components/window/container/WindowsContainer.vue'
</script>