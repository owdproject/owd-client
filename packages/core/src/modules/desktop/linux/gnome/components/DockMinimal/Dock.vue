<template>
  <div class="owd-menu">
    <ul class="owd-menu__group">
      <slot name="prepend" />

      <template v-for="(windowInstances, windowName) of dock.itemsFavorite" :key="windowName">
        <template v-for="(windowInstance, uniqueID) of windowInstances" :key="uniqueID">
          <DockItem
            v-if="uniqueID === 'dummy' && Object.keys(windowInstances).length === 1 || uniqueID !== 'dummy'"
            :dummy="uniqueID === 'dummy'"
            :window="windowInstance"
          />
        </template>
      </template>

      <template v-for="(windowInstances, windowName) of dock.items" :key="windowName">
        <template v-for="(windowInstance, uniqueID) of windowInstances" :key="uniqueID">
          <DockItem :window="windowInstance" />
        </template>
      </template>


      <slot name="append" />
    </ul>
  </div>
</template>

<script setup>
import {onMounted, reactive} from "vue"
import {useStore} from 'vuex'
import DockItem from './dock-item/DockItem.vue'

const store = useStore()

const dock = reactive({
  itemsFavorite: {},
  items: {}
})

onMounted(() => {
  for (const owdModuleApp of store.getters['core/modulesApp/modulesAppList']) {

    // does module contain any windows?
    if (owdModuleApp.moduleInfo.windows && owdModuleApp.moduleInfo.windows.length > 0) {

      // skip if module doesn't have any window
      if (!owdModuleApp.moduleInfo.windows) {
        continue
      }

      for (const owdModuleAppWindowConfig of owdModuleApp.moduleInfo.windows) {

        if (!owdModuleAppWindowConfig.favorite) {
          continue
        }

        if (!Object.prototype.hasOwnProperty.call(dock.itemsFavorite, owdModuleAppWindowConfig.name)) {
          dock.itemsFavorite[owdModuleAppWindowConfig.name] = {}
        }

        dock.itemsFavorite[owdModuleAppWindowConfig.name]['dummy'] = {
          config: owdModuleAppWindowConfig,
          storage: {
            opened: false,
            minimized: false
          }
        }

      }

    }

  }
})

store.subscribe((mutation) => {
  if (mutation.type === `core/windowDock/ADD`) {
    const windowInstance = mutation.payload
    const dockTarget = dock[!windowInstance.config.favorite ? 'items': 'itemsFavorite']

    if (windowInstance.config.menu === true) {
      if (!Object.prototype.hasOwnProperty.call(dockTarget, windowInstance.config.name)) {
        dockTarget[windowInstance.config.name] = {}
      }

      dockTarget[windowInstance.config.name][windowInstance.uniqueID] = windowInstance
    }
  }
})

store.subscribe((mutation) => {
  if (mutation.type === `core/windowDock/REMOVE`) {
    const windowInstance = mutation.payload
    const dockTarget = dock[!windowInstance.config.favorite ? 'items': 'itemsFavorite']

    delete dockTarget[windowInstance.config.name][windowInstance.uniqueID]
  }
})
</script>

<style lang="scss">
.owd-menu {
  position: absolute;
  top: 0;
  left: 24px;
  padding: 0;
  margin: 24px 0;
  user-select: none;
  transition: transform 0.25s ease-in-out;

  &:hover {
    z-index: 12;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }

  @media (max-width: 560px) {
    top: auto;
    left: 15px;
    right: 15px;
    bottom: 15px;
    margin: 0;
    padding: 0;

    ul {
      float: right;

      li {
        height: 48px;
        line-height: 48px;
        float: left;
        margin: 4px 0 0 0;
      }
    }
  }
}
</style>
