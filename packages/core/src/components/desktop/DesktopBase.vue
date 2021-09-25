<template>
  <div class="owd-desktop">
    <slot />
  </div>
</template>

<script setup>
import { getCurrentInstance, onMounted, onUnmounted } from 'vue'
import {useStore} from "vuex";

const app = getCurrentInstance()
const store = useStore()

// handle desktop resize event
onMounted(() => window.addEventListener('resize', handleDesktopResize))
onUnmounted(() => window.removeEventListener('resize', handleDesktopResize))

let timeoutHandleDesktopResize = null

function handleDesktopResize() {
  clearTimeout(timeoutHandleDesktopResize)

  timeoutHandleDesktopResize = setTimeout(() => {
    store.dispatch('core/window/windowsAdjustPosition')
  }, 100)
}
</script>

<style lang="scss">
.owd-desktop {
  display: flex;
  flex-flow: column;
  height: 100vh;

  &__content {
    position: relative;
    overflow: hidden;
    flex: 1;
  }
}
</style>