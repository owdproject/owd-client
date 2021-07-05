<template>
  <div
      ref="categoriesMenuList"
      class="owd-desktop__application-menu__categories"
      @keyup.esc="$emit('menu-close')"
      @keyup.up="selectPrevCategory"
      @keyup.down="selectNextCategory"
      @keyup.left="setNavigationKeysSection('categories')"
      @keyup.right="setNavigationKeysSection('apps')"
  >
    <ul>
      <li
          v-for="(appList, category) in categories"
          :class="{selected: categorySelected === category && allowKeysNavigation}"
          :key="category"
      >
        <button
          @click="categoryClick(category)"
          @mouseover="(e) => categoryMouseOver(e, category)"
          v-text="$t(`desktop.SystemBar.ApplicationMenu.categories.${category}`)"
        />
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import {ref, inject, defineProps, defineEmit, nextTick, watch} from "vue";

const desktopOptions = inject('desktopOptions')

const props = defineProps({
  categories: Object,
  categorySelected: String,
  allowKeysNavigation: Boolean
})

const emit = defineEmit([
  'menu-close',
  'select',
  'set-navigation-keys-section'
])

// element ref
const categoriesMenuList = ref(null)

// keys from categories object
const categoriesKeys = Object.keys(props.categories)

// initial focus on buttons to enable key navigation
watch(() => props.allowKeysNavigation, (active) => {
  if (active) {
    if (props.categorySelected === '') {
      categoriesMenuList.value.querySelector('ul > li:first-child button').focus()
    } else {
      nextTick(() => categoriesMenuList.value.querySelector('ul > li.selected button').focus())
    }
  }
})

function selectPrevCategory() {
  if (!props.allowKeysNavigation) return false

  const currentIndex = categoriesKeys.indexOf(props.categorySelected)

  if (currentIndex - 1 > -1) {
    emit('select', categoriesKeys[currentIndex - 1])
  }
}

function selectNextCategory(e) {
  if (!props.allowKeysNavigation) return false

  const currentIndex = categoriesKeys.indexOf(props.categorySelected)

  if (currentIndex + 1 < categoriesKeys.length) {
    emit('select', categoriesKeys[currentIndex + 1])
  }
}

function categoryClick(category: string) {
  if (desktopOptions.ApplicationMenu.categoryAppsTriggerType === 'click') {
    emit('select', category)
  }
}

function categoryMouseOver(e: Event, category: string) {
  // enable key direction
  e.target.focus()

  // set key navigations on categories
  emit('set-navigation-keys-section', 'categories')

  if (!desktopOptions.ApplicationMenu.categoryAppsTriggerType || desktopOptions.ApplicationMenu.categoryAppsTriggerType === 'mouseover') {
    emit('select', category)
  }
}

    // key navigation
function setNavigationKeysSection(value: string) {
  if (props.allowKeysNavigation && value === 'categories') {
    return emit('menu-close')
  }

  emit('set-navigation-keys-section', value)
}
</script>

<style scoped lang="scss">
.owd-desktop__application-menu__categories {
  padding: 16px 0;
  overflow-y: auto;

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
        padding-left: 20px;
      }

      &.selected button {
        background: $owd-window-item-background-hover;
      }
    }
  }

  &::-webkit-scrollbar,
  &::-webkit-scrollbar-thumb {
    width: 0;
    background: transparent;
  }
}
</style>