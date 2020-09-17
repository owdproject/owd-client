<template>
  <div id="windows-container">

    <template v-if="windows">
      <div
        class="windows-group"
        v-for="(windowsGroup, windowsGroupName) in windows"
        :key="windowsGroupName"
      >
        <component
          v-for="(window, windowIndex) in windowsGroup"
          :is="window.name"
          :data="window"
          :key="windowIndex"
        />
      </div>
    </template>

  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import Window from "../window/Window";

  export default {
    name: "WindowsContainer",
    components: {Window},
    computed: {
      ...mapGetters({
        windows: 'core/windows/windows'
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
