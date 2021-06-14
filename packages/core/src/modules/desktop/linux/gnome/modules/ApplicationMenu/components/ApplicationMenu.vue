<template>
  <DesktopSystemBarMenu>
    <span>
      {{$t(`desktop.SystemBar.${config.name}.menu`)}}
    </span>
  </DesktopSystemBarMenu>
</template>

<script setup>
import {defineProps} from 'vue'
import DesktopSystemBarMenu from "../../../components/SystemBar/components/SystemBarMenu.vue";

defineProps({
  config: Object
})
</script>