<template>
  <DesktopSystemBarMenuContent
      class="owd-desktop__application-menu__container"
      v-click-outside="menuClose"
  >

    <ApplicationMenuContentCategories
      :allow-keys-navigation="navigationKeysSection === 'categories'"
      :categories="categories"
      :category-selected="categorySelected"
      @select="(category) => categorySelected = category"
      @setNavigationKeysSection="(value) => navigationKeysSection = value"
      @menuClose="menuClose"
    />

    <ApplicationMenuContentApps
      :allow-keys-navigation="navigationKeysSection === 'apps'"
      :apps="categoryApps"
      :app-selected="appSelected"
      @select="(app) => appSelected = app"
      @setNavigationKeysSection="(value) => navigationKeysSection = value"
      @menuClose="menuClose"
    />

  </DesktopSystemBarMenuContent>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, defineEmit} from 'vue'
import {useStore} from "vuex";
import DesktopSystemBarMenuContent from '../../../components/SystemBar/components/SystemBarMenuContent.vue'
import ApplicationMenuContentCategories from './ApplicationMenuContentCategories.vue'
import ApplicationMenuContentApps from './ApplicationMenuContentApps.vue'

const emit = defineEmit([
  'close'
])

const store = useStore()

const appSelected = ref({})
const categorySelected = ref('')

// categories
const categories = computed(() => store.getters['core/windowCategory/modulesAppWindowCategories'])

// category > apps
const categoryApps = computed(() => {
  if (!categorySelected.value) return []

  return categories.value[categorySelected.value]
})

// key navigation section
const navigationKeysSection = ref('');

// set default key navigation section on mounted
// (just to trigger the watcher in ApplicationMenuContentCategories.vue)
onMounted(() => navigationKeysSection.value = 'categories')

function selectNavigationKeysSection(value: string) {
  navigationKeysSection.value = value
}

function menuClose() {
  categorySelected.value = ''
  emit('close')
}
</script>

<style scoped lang="scss">
.owd-desktop__application-menu {
  &__container {
    display: grid;
    width: 410px;
    max-width: calc(100% - 32px);
    height: 500px;
    max-height: 60vh;
    grid-template-columns: 40% 60%;
    line-height: 32px;
    font-size: 13px;
    left: 16px;

    @media(max-height: 400px) {
      max-height: calc(100vh - 60px);
    }
  }
}
</style>