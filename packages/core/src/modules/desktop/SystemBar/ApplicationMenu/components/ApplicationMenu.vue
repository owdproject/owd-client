<template>
  <DesktopSystemBarMenu>
    <span>
      {{$t(`desktop.SystemBar.${config.name}.menu`)}}
    </span>
  </DesktopSystemBarMenu>
</template>

<script setup>
import {defineProps} from 'vue'
import DesktopSystemBarMenu from "@owd-client/core/src/components/desktop/SystemBar/components/SystemBarMenu";

defineProps({
  config: Object
})
</script>