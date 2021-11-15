<template>
  <transition name="fade-transition">
    <v-btn
      class="owd-notice-fullscreen-exit"
      rounded
      dark
      disabled
      v-show="visible"
    >
      <slot />
    </v-btn>
  </transition>
</template>

<script setup>
import {ref, onBeforeMount, onMounted, onUnmounted} from 'vue'
import {useStore} from "vuex";

const store = useStore()

const visible = ref(false)
const timeout = ref(0)

function handleWindowInstanceFullscreen(e) {
  if (e.keyCode === 27) {
    store.dispatch('core/window/windowUnfullscreenAll')
    store.dispatch('core/window/windowUnmaximizeAll')
  }
}

// detect window instance fullscreen/maximize event
onBeforeMount(() => {
  store.subscribe((mutation) => {
    if (mutation.type === 'core/windowFullscreen/SET_FULLSCREEN_MODE') {
      if (typeof mutation.payload === 'boolean') {
        if (mutation.payload) {
          clearTimeout(timeout.value)
          visible.value = true
          timeout.value = setTimeout(() => visible.value = false, 3000)
        } else {
          visible.value = false
        }
      }
    }
  })
})

// when press ESC and a window is in full-screen mode
onMounted(() => window.addEventListener('keydown', handleWindowInstanceFullscreen))
onUnmounted(() => window.removeEventListener('keydown', handleWindowInstanceFullscreen))
</script>

<style scoped lang="scss">
.v-btn.owd-notice-fullscreen-exit {
  position: absolute;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  max-width: 90vw;
  width: 330px;
  min-height: 44px;
  z-index: 999;
}
</style>