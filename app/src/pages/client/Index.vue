<template>
  <Desktop v-if="owd.booted.desktop">
    <Logo :title="$store.state['core/client'].title" />
  </Desktop>
</template>

<script setup>
import {onBeforeMount, onUnmounted} from "vue";
import {useDesktop} from "@owd-client/core";
import Logo from '@owd-client/core/src/components/logo/Logo.vue'

const owd = useDesktop()

// initialize desktop
onBeforeMount(() => {
  owd.initialize()
})

// terminate desktop
onUnmounted(() => {
  owd.terminate()
})
</script>