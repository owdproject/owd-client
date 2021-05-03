<template>
  <div
      ref="categoriesMenuList"
      class="owd-desktop__application-menu__categories"
      @keyup.esc="$emit('menu-close')"
      @keyup.up="selectPrevCategory"
      @keyup.down="selectNextCategory"
      @keyup.left="setNavigationKeys('categories')"
      @keyup.right="setNavigationKeys('apps')"
  >
    <ul>
      <li
          :class="{selected: categorySelected === category && allowKeysNavigation}"
          v-for="(appList, category) in categories"
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
import {getCurrentInstance, nextTick, ref, watch, defineProps, defineEmit} from "vue";

const props = defineProps({
  categories: Object,
  categorySelected: String,
  allowKeysNavigation: Boolean
})

const emit = defineEmit([
  'menu-close',
  'select',
  'set-keys-navigation-section'
])

const app = getCurrentInstance();
const options = app.appContext.config.owd.desktop.SystemBar.options.modules.ApplicationMenu

// element ref
const categoriesMenuList = ref(null)

// keys from categories object
const categoriesKeys = Object.keys(props.categories)

// initial focus on buttons to enable key navigation
watch(() => props.allowKeysNavigation, (active) => {
  if (active) {
    if (props.categorySelected == '') {
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
  if (options.categoryAppsTriggerType === 'click') {
    emit('select', category)
  }
}

function categoryMouseOver(e: Event, category: string) {
  // enable key direction
  e.target.focus()

  // set key navigations on categories
  emit('set-keys-navigation-section', 'categories')

  if (!options.categoryAppsTriggerType || options.categoryAppsTriggerType === 'mouseover') {
    emit('select', category)
  }
}

    // key navigation
function setNavigationKeys(value: string) {
  if (props.allowKeysNavigation && value === 'categories') {
    return emit('menu-close')
  }

  emit('set-keys-navigation-section', value)
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
        border-radius: 0 4px 4px 0;
      }

      &.selected button {
        background: $windowContentItemBackgroundHover;
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