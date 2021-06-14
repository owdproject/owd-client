<template>
  <div class="owd-menu">
    <ul class="owd-menu__group">
      <slot name="prepend" />

      <DockItem
        v-for="windowInstance of docks"
        :key="windowInstance.uniqueID"
        :window="windowInstance"
      />

      <slot name="append" />
    </ul>
  </div>
</template>

<script setup>
import {computed} from "vue"
import {useStore} from 'vuex'
import DockItem from './dock-item/DockItem.vue'

const store = useStore()

const docks = computed(() => Object.values(store.getters['core/windowDock/modulesAppWindowDocks']))
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
