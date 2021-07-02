<template>
  <div
      ref="applicationMenuList"
      class="owd-desktop__application-menu__list"
      @keyup.esc="$emit('menu-close')"
      @keyup.up="selectPrevApp"
      @keyup.down="selectNextApp"
      @keyup.left="setNavigationKeysSection('categories')"
      @key.enter="windowOpen(appSelected)"
  >
    <ul v-if="apps && apps.length > 0">
      <li
          :class="{selected: appSelected.config === moduleAppWindow.config && allowKeysNavigation}"
          v-for="(moduleAppWindow, i) of apps"
          :key="i"
      >
        <button
            @mouseover="(e) => appMouseOver(e, moduleAppWindow)"
            @click="windowOpen(moduleAppWindow)"
        >
          <div class="owd-desktop__application-menu__list__icon">
            <WindowIconMenu
                v-if="moduleAppWindow.config.icon"
                :icon="moduleAppWindow.config.icon"
                :force-svg="moduleAppWindow.config.icon.forceMenuAppSvg"
                is-application-menu
            />
          </div>
          <div class="owd-desktop__application-menu__list__name">
            <div class="owd-desktop__application-menu__list__name-inner" v-html="moduleAppWindow.config.titleApp || moduleAppWindow.config.title"/>
          </div>
        </button>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {ref, watch, defineProps, defineEmit, nextTick} from "vue";
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

// element ref
const applicationMenuList = ref(null)

async function windowOpen() {
  emit('menu-close')

  await props.appSelected.module.createWindow(props.appSelected.config)
}

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

  const currentIndex = props.apps.findIndex((app) => app.config === props.appSelected.config)

  if (currentIndex - 1 > -1) {
    emit('select', props.apps[currentIndex - 1])
  }
}

const selectNextApp = () => {
  if (!props.allowKeysNavigation) return false

  const currentIndex = props.apps.findIndex((app) => app.config === props.appSelected.config)

  if (currentIndex + 1 < props.apps.length) {
    emit('select', props.apps[currentIndex + 1])
  }
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
  setTimeout(() => emit('set-navigation-keys-section', value), 20)
}
</script>

<style scoped lang="scss">
.owd-desktop__application-menu__list {
  position: absolute;
  top: -2px;
  left: calc(100% - 4px);
  background: $owd-window-button-background;
  border: 1px solid;
  border-color: $owd-window-button-border-color;
  box-shadow: $owd-window-button-box-shadow;
  width: 220px;
  overflow-y: auto;

  &__icon {
    display: inline-block;
    width: 32px;
    height: 30px;
    line-height: 30px;
    text-align: center;
    vertical-align: middle;
    color: $owd-window-item-text-color-hover;
    transform: scale(0.75);
  }

  &__name {
    display: inline-block;
    line-height: 30px;

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
        grid-template-columns: 32px calc(100% - 32px);
        width: 100%;
        text-align: left;
        cursor: pointer;
        line-height: 20px;
        padding: 0 5px;
        background: $owd-window-item-background;
        color: $owd-window-item-text-color;
      }

      &.selected button {
        background: $owd-window-item-background-hover;
        color: $owd-window-item-text-color-hover;
      }
    }
  }
}
</style>