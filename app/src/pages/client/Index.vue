<template>
  <template v-if="ready">
    <Desktop>
      <Logo :title="$store.state['core/client'].title" />
    </Desktop>
  </template>
</template>

<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import {useDesktop} from "@owd-client/core/index";
import Logo from '@owd-client/core/src/components/logo/Logo.vue'

// import common app styles
import '~/themes/index.scss'

const ready = ref(false)

onMounted(() => {
  const owd = useDesktop()

  if (owd) {
    owd.initialize()
    ready.value = true
  }
})

onUnmounted(() => {
  const owd = useDesktop()

  if (owd) {
    owd.terminate()
    ready.value = false
  }
})
</script>