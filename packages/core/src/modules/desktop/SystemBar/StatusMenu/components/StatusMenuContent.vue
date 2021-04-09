<template>
  <DesktopSystemBarMenuContent
      class="owd-desktop__patreon-menu__container"
      v-click-outside="menuClose"
  >

    <template v-if="desktopModules && desktopModules.default">
      <component
          v-for="(desktopModule, i) of desktopModules.default" :key="i"
          :is="desktopModule.components.content"
          @close="menuClose"
      />
    </template>

  </DesktopSystemBarMenuContent>
</template>

<script>
import DesktopSystemBarMenuContent from '@owd-client/core/src/components/desktop/SystemBar/components/SystemBarMenuContent'
import ModuleDesktopExtend from "@owd-client/core/src/libraries/moduleDesktop/extend/moduleDesktopExtend.class";
import {reactive} from "vue";

export default {
  components: {DesktopSystemBarMenuContent},
  emits: [
    'close'
  ],
  setup() {
    const desktopModules = reactive(ModuleDesktopExtend.getDesktopModules('StatusSystemBar'))

    return {
      desktopModules
    }
  },
  methods: {
    menuClose() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped lang="scss">
.owd-desktop__patreon-menu {
  &__container {
    display: grid;
    width: 300px;
    max-width: calc(100% - 32px);
    right: 16px;
    padding: 20px 18px;
    text-align: center;
  }
}

.overline {
  height: 9px;
  line-height: 12px;
  margin-bottom: 12px;
}

.patreon-goal {
  text-align: left;
  margin-bottom: 22px;

  .progress-bar {
    width: 100%;
    height: 8px;
    margin-top: 5px;
    border-radius: 4px;
    background: #282828;
    overflow: hidden;

    &__value {
      height: 100%;
      background-color: $menuItemSquareBackground;
      border-radius: 4px;
    }
  }
}
</style>