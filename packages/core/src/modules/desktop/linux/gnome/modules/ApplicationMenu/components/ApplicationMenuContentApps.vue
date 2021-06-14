<template>
  <div
      ref="applicationMenuList"
      class="owd-desktop__application-menu__list"
      @keyup.esc="$emit('menu-close')"
      @keyup.up="selectPrevApp"
      @keyup.down="selectNextApp"
      @keyup.left="setNavigationKeysSection('categories')"
      @keyup.right="setNavigationKeysSection('apps')"
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
          <div class="owd-desktop__application-menu__list__icon">
            <WindowIconMenu
                v-if="moduleAppWindow.icon"
                :icon="moduleAppWindow.icon"
                :force-svg="moduleAppWindow.icon.forceMenuAppSvg"
                is-application-menu
            />
          </div>
          <div class="owd-desktop__application-menu__list__name">
            <div class="owd-desktop__application-menu__list__name-inner" v-html="moduleAppWindow.titleApp || moduleAppWindow.title"/>
          </div>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {ref, watch, defineProps, defineEmit, nextTick} from "vue";
import {useStore} from "vuex";
import WindowIconMenu from "@owd-client/core/src/components/window/icon/WindowIconMenu.vue";

const props = defineProps({
  apps: Array,
  appSelected: Object,
  allowKeysNavigation: Boolean
})

const emit = defineEmit([
  'menu-close',
  'select',
  'set-navigation-keys-section'
])

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
    emit('select', props.apps[currentIndex - 1])
  }
}

const selectNextApp = () => {
  if (!props.allowKeysNavigation) return false

  const currentIndex = props.apps.indexOf(props.appSelected)

  if (currentIndex + 1 < props.apps.length) {
    emit('select', props.apps[currentIndex + 1])
  }
}

async function windowOpen() {
  emit('menu-close')
  await store.dispatch('core/window/windowCreate', props.appSelected.name)
}

function appMouseOver(e: Event, moduleAppWindow: Object) {
  // enable key direction
  e.target.focus()

  // set key navigations on apps
  emit('set-navigation-keys-section', 'apps')
  emit('select', moduleAppWindow)
}

// key navigation
function setNavigationKeysSection(value: string) {
  emit('set-navigation-keys-section', value)
}
</script>

<style scoped lang="scss">
.owd-desktop__application-menu__list {
  overflow-y: auto;
  padding: 16px 14px 16px 0;

  &__icon {
    display: inline-block;
    width: 32px;
    height: 32px;
    line-height: 32px;
    text-align: center;
    vertical-align: middle;
    margin-top: 6px;
    margin-right: 12px;
    color: $owd-window-text-active;
  }

  &__name {
    display: inline-block;

    &-inner {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;

    li {
      width: 100%;

      button {
        display: grid;
        grid-template-columns: 44px calc(100% - 44px);
        width: 100%;
        text-align: left;
        cursor: pointer;
        line-height: $owd-window-nav-height;
        padding: 0 24px;
        border-radius: 4px;
      }

      &.selected button {
        background: $owd-window-item-background-hover;
      }
    }
  }
}
</style>