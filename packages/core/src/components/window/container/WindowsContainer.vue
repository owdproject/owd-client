<template>
  <div class="owd-windows-container">
    <div class="owd-windows-container__initialize-area" />

    <component
      v-for="windowInstance of windowInstances"
      :key="windowInstance.uniqueID"
      :is="windowInstance.config.name"
      :window="windowInstance"
      :data-window-id="windowInstance.uniqueID"
    />
  </div>
</template>

<script>
import {computed} from "vue";
import {useStore} from 'vuex'

export default {
  setup() {
    const store = useStore()

    return {
      windowInstances: computed(() => {
        return store.getters['core/window/modulesAppWindowInstancesList']
      })
    }
  }
}
</script>

<style lang="scss">
#app {
  .owd-windows-container {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    pointer-events: none;

    &__initialize-area {
      position: absolute;
      top: 24px;
      bottom: 24px;
      left: 96px;
      right: 24px;
    }
  }

  &.is-mobile {
    .owd-windows-container {
      top: 24px;
      bottom: 24px;
      left: 24px;
      right: 24px;

      @media(max-width: 560px) {
        top: 15px;
        bottom: 15px;
        left: 15px;
        right: 15px;
      }
    }
  }
}
</style>
