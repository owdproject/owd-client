<template>
  <div class="owd-desktop__dock-menu">

    <template
      v-for="windowInstance of dock.items"
      :key="windowInstance.uniqueID"
    >
      <v-btn
          height="26"
          :class="{'v-btn--active': !windowInstance.storage.minimized}"
          @click="windowToggle(windowInstance)"
      >
        {{windowInstance.config.titleMenu || windowInstance.config.title}}
      </v-btn>
    </template>


  </div>
</template>

<script setup>
import {reactive} from "vue";
import {useStore} from "vuex";
import DesktopSystemBarMenu from "../../../components/SystemBar/components/SystemBarMenu.vue";
import StatusTime from "@owd-client/core/src/components/status/StatusTime.vue"

const store = useStore()

const dock = reactive({
  items: []
})

store.subscribe((mutation) => {
  if (mutation.type === `core/windowDock/ADD`) {
    const windowInstance = mutation.payload
    dock.items.push(windowInstance)
  }
})

store.subscribe((mutation) => {
  if (mutation.type === `core/windowDock/REMOVE`) {
    const windowInstance = mutation.payload
    dock.items.splice(dock.items.indexOf(windowInstance), 1)
  }
})

async function windowToggle(windowInstance) {
  await store.dispatch('core/window/windowMinimizeToggle', windowInstance)
}
</script>

<style scoped lang="scss">
.owd-desktop__dock-menu {
  display: inline-block;
  width: calc(100% - 100px);

  .v-btn {
    display: inline-flex;
    font-weight: bold;
    margin: 0 0 0 6px;
    padding: 0 6px;

    &--active {
      border: 1px solid;
      border-color: #828282 #c3c3c3 #c3c3c3 #828282;
      box-shadow: -1px -1px 0 0 black, 0 -1px 0 0 black, -1px 0 0 0 black, 1px 1px 0 0 white, 0 1px 0 0 white, 1px 0 0 0 white;

      // Colors
      $bg-color: #ffffff;
      $dot-color: #c3c3c3;

      // Dimensions
      $dot-size: 1px;
      $dot-space: 2px;

      background:
          linear-gradient(90deg, $bg-color ($dot-space - $dot-size), transparent 1%) center,
          linear-gradient($bg-color ($dot-space - $dot-size), transparent 1%) center,
          $dot-color;
      background-size: $dot-space $dot-space;
    }
  }
}
</style>