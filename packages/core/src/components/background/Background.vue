<template>
  <div
      class="owd-background"
      :style="backgroundStyle"
  />
</template>

<script setup>
import {computed} from "vue";
import {useStore} from "vuex";

const store = useStore()

const backgroundStyle = computed(() => {
  const styles = {}
  const background = {
    color: store.getters['core/background/backgroundColor'],
    image: store.getters['core/background/backgroundImage'],
    size: store.getters['core/background/backgroundSize'],
  }

  if (background.color) {
    styles['background-color'] = background.color
  }

  if (background.image) {
    styles['background-image'] = `url("${background.image}")`
  }

  if (background.size) {
    styles['background-size'] = background.size
  }

  return styles
})
</script>

<style scoped lang="scss">
  .owd-background {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--owd-background);
  }
</style>
