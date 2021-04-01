<template>
  <div
      ref="applicationMenuList"
      class="owd-desktop__application-menu__list"
      @keyup.esc="$emit('menu-close')"
      @keyup.up="selectPrevApp"
      @keyup.down="selectNextApp"
      @keyup.left="setNavigationKeys('categories')"
      @keyup.right="setNavigationKeys('apps')"
      @key.enter="windowOpen(appSelected)"
  >
    <ul v-if="apps && apps.length > 0">
      <li
          :class="{selected: appSelected === moduleAppWindow && allowKeysNavigation}"
          v-for="(moduleAppWindow, i) of apps"
          :key="i"
      >
        <button
            @mouseover="(e) => appMouseOver(e, moduleAppWindow)"
            @click="windowOpen(moduleAppWindow)"
        >
          <MenuItemIcon :icon="moduleAppWindow.icon" force-svg/>
          {{ moduleAppWindow.titleApp || moduleAppWindow.title }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {ref, watch, nextTick} from "vue";
import {useStore} from "vuex";
import MenuItemIcon from "@owd-client/core/src/components/menu/menu-item/MenuItemIcon.vue";

export default {
  components: {
    MenuItemIcon
  },
  props: {
    apps: Array,
    appSelected: Object,
    allowKeysNavigation: Boolean
  },
  emits: [
    'menu-close',
    'select',
    'set-keys-navigation-section',
  ],
  setup(props, context) {
    const store = useStore()

    // element ref
    const applicationMenuList = ref(null)

    // initial focus on buttons to enable key navigation
    watch(() => props.allowKeysNavigation, (active) => {
      selectNextApp()

      if (active) {
        if (!props.appSelected.name) {
          applicationMenuList.value.querySelector('ul > li:first-child button').focus()
        } else {
          nextTick(() => applicationMenuList.value.querySelector('ul > li.selected button').focus())
        }
      }
    })

    const selectPrevApp = () => {
      if (!props.allowKeysNavigation) return false

      const currentIndex = props.apps.indexOf(props.appSelected)

      if (currentIndex - 1 > -1) {
        context.emit('select', props.apps[currentIndex - 1])
      }
    }

    const selectNextApp = () => {
      if (!props.allowKeysNavigation) return false

      const currentIndex = props.apps.indexOf(props.appSelected)

      if (currentIndex + 1 < props.apps.length) {
        context.emit('select', props.apps[currentIndex + 1])
      }
    }

    return {
      applicationMenuList,

      windowOpen: async () => {
        context.emit('menu-close')
        await store.dispatch('core/window/windowCreate', props.appSelected.name)
      },

      appMouseOver: (e: Event, moduleAppWindow: Object) => {
        // enable key direction
        e.target.focus()

        // set key navigations on apps
        context.emit('set-keys-navigation-section', 'apps')
        context.emit('select', moduleAppWindow)
      },

      // key navigation
      selectPrevApp,
      selectNextApp,
      setNavigationKeys: (value: string) => {
        context.emit('set-keys-navigation-section', value)
      }
    }
  }
}
</script>

<style scoped lang="scss">
.owd-desktop__application-menu__list {
  overflow-y: auto;
  padding: 16px 14px 16px 0;

  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;

    li {
      width: 100%;

      button {
        display: block;
        width: 100%;
        text-align: left;
        cursor: pointer;
        line-height: $windowNavHeight;
        padding: 0 24px;
        border-radius: 4px;

        .owd-menu__item__icon {
          display: inline-block;
          width: 32px;
          height: 32px;
          line-height: 32px;
          text-align: center;
          vertical-align: middle;
          margin-top: -1px;
          margin-right: 12px;
          color: $windowColorActive;
        }
      }

      &.selected button {
        background: $windowContentItemBackgroundHover;
      }
    }
  }
}
</style>