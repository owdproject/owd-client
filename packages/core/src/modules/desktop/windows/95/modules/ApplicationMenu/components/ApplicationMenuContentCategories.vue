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
    <ul @mouseleave="(e) => categoryMouseOver(e, '')">
      <li
          :class="{selected: categorySelected === category}"
          v-for="(appList, category) in categories"
          :key="category"
      >
        <button
            @mouseover="(e) => categoryMouseOver(e, category)"
            v-text="$t(`desktop.SystemBar.ApplicationMenu.categories.${category}`)"
        />

        <v-icon size="20">mdi-menu-right</v-icon>

        <slot v-if="categorySelected === category" />
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

function categoryMouseOver(e: Event, category: string) {
  // enable key direction
  e.target.focus()

  // set key navigations on categories
  emit('set-navigation-keys-section', 'categories')
  emit('select', category)
}

    // key navigation
function setNavigationKeysSection(value: string) {
  if (props.allowKeysNavigation && value === 'categories') {
    return emit('menu-close')
  }

  if (props.categorySelected) {
    emit('set-navigation-keys-section', value)
  }
}
</script>

<style scoped lang="scss">
.owd-desktop__application-menu__categories {
  ul {
    margin: 0;
    padding: 0;
    list-style-type: none;

    li {
      position: relative;
      width: 100%;

      button {
        display: block;
        width: 100%;
        text-align: left;
        padding-left: 15px;
        line-height: 42px;
      }

      .v-icon {
        position: absolute;
        top: 50%;
        right: 5px;
        transform: translateY(-50%);
      }

      &.selected {
        button {
          background: $owd-window-item-background-hover;
          color: $owd-window-item-text-color-hover;
        }

        .v-icon {
          color: $owd-window-item-text-color-hover;
        }
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