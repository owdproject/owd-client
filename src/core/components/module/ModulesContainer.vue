<template>
  <div
    id="windows-container"
    v-if="windowInstances"
  >
    <template
      v-for="windowName in Object.keys(windowInstances)"
    >
      <template v-for="(moduleWindow, moduleWindowUniqueID) in windowInstances[windowName]">
        <component
          :is="moduleWindow.name"
          :data="moduleWindow"
          :data-window-id="moduleWindowUniqueID"
          :key="windowName + ' ' + moduleWindowUniqueID"
        />
      </template>
    </template>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import Window from '../window/Window'

export default {
  name: 'WindowsContainer',
  components: {Window},
  computed: {
    ...mapGetters({
      windowInstances: 'core/windows/windowInstances'
    })
  }
}
</script>

<style lang="scss">
  #app {
    #windows-container {
      position: fixed;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      pointer-events: none;
      z-index: 10;

      .windows-group {
        min-height: 100%;
      }
    }

    &.is-mobile {
      #windows-container {
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
