<template>
  <v-system-bar id="desktop-system-bar">

    <div id="desktop-system-bar-left">
      <slot name="system-bar-left-prepend" />

      <template v-for="(module, i) of modules.left" :key="i">
        <component :is="module.components.menu" :config="module.config" @click="openSystemBarModule(module)" />
        <component :is="module.components.content" :opened="module.config.opened" />
      </template>

      <slot name="system-bar-left-append" />
    </div>

    <div id="desktop-system-bar-center">
      <template v-for="(module, i) of modules.center" :key="i">
        <component :is="module.components.menu" :config="module.config" @click="openSystemBarModule(module)" />
        <component :is="module.components.content" :opened="module.config.opened" />
      </template>
    </div>

    <div id="desktop-system-bar-right">
      <slot name="system-bar-right-prepend" />

      <template v-for="(module, i) of modules.right" :key="i">
        <component :is="module.components.menu" :config="module.config" @click="openSystemBarModule(module)" />
        <component :is="module.components.content" :opened="module.config.opened" />
      </template>

      <slot name="system-bar-right-append" />
    </div>

  </v-system-bar>
</template>

<script>
import {reactive} from 'vue';
import ModulesDesktop from '../../../libraries/modules-desktop/extend/modulesDesktopExtend.class'

export default {
  props: {
    systemBar: Boolean
  },
  setup() {
    const modulesDesktopSystemBar = reactive(ModulesDesktop.getModules('system-bar'))

    const openSystemBarModule = (module) => {
      module.config.opened = !module.config.opened
    }

    return {
      modules: modulesDesktopSystemBar,
      openSystemBarModule
    }
  }
}
</script>

<style scoped lang="scss">
#desktop-system-bar {
  display: grid;
  grid-template-columns: 30% 40% 30%;
  cursor: default;
  height: 32px;
  line-height: 33px;
  font-size: 13.5px;
  font-weight: bold;
  user-select: none;

  #desktop-system-bar-center {
    text-align: center;
  }

  #desktop-system-bar-right {
    text-align: right;
  }
}
</style>