<template>
  <div id="menu">
    <ul class="menu-group">
      <slot name="prepend" />

      <MenuItem
        v-for="windowInstance of docks"
        :key="windowInstance.uniqueID"
        :window="windowInstance"
      />

      <slot name="append" />
    </ul>
  </div>
</template>

<script>
import {computed} from "vue"
import {useStore} from 'vuex'
import MenuItem from './MenuItem.vue'

export default {
  components: {
    MenuItem
  },
  setup() {
    const store = useStore()

    return {
      docks: computed(() => {
        return store.getters['core/modules/modulesAppWindowDocks']
      })
    }
  }
}
</script>

<style lang="scss">
#menu {
  position: absolute;
  top: 0;
  left: 24px;
  padding: 0;
  margin: 24px 0;
  z-index: 9;
  user-select: none;
  transition: transform 0.25s ease-in-out;

  &:hover {
    z-index: 12;
  }

  &:not(:hover).autohide {
    @media (min-width: 560px) {
      transform: translateX(-80px);
    }
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
