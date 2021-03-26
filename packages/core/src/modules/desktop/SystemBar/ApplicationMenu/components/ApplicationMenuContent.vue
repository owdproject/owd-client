<template>
  <DesktopSystemBarMenuContent
      class="owd-desktop__application-menu__container"
      v-click-outside="menuClose"
  >

    <ApplicationMenuContentCategories
      :allow-keys-navigation="keysNavigationSection === 'categories'"
      :categories="categories"
      :category-selected="categorySelected"
      @select="(category) => categorySelected = category"
      @setKeysNavigationSection="(value) => keysNavigationSection = value"
      @menuClose="menuClose"
    />

    <ApplicationMenuContentApps
      :allow-keys-navigation="keysNavigationSection === 'apps'"
      :apps="categoryApps"
      :app-selected="appSelected"
      @select="(app) => appSelected = app"
      @setKeysNavigationSection="(value) => keysNavigationSection = value"
      @menuClose="menuClose"
    />

  </DesktopSystemBarMenuContent>
</template>

<script lang="ts">
import {computed, onMounted, ref} from 'vue'
import {useStore} from "vuex";
import DesktopSystemBarMenuContent from '@owd-client/core/src/components/desktop/SystemBar/components/SystemBarMenuContent'
import ApplicationMenuContentCategories from './ApplicationMenuContentCategories'
import ApplicationMenuContentApps from './ApplicationMenuContentApps'

export default {
  components: {
    DesktopSystemBarMenuContent,
    ApplicationMenuContentCategories,
    ApplicationMenuContentApps
  },
  emits: [
    'close'
  ],
  setup(props, context) {
    const store = useStore()

    const appSelected = ref({})
    const categorySelected = ref('')

    // key navigation section
    const keysNavigationSection = ref('');

    // categories
    const categories = computed(() => store.getters['core/windowCategory/modulesAppWindowCategories'])

    // category > apps
    const categoryApps = computed(() => {
      if (!categorySelected.value) return []

      return categories.value[categorySelected.value]
    })

    // set default key navigation section on mounted
    // (just to trigger the watcher in ApplicationMenuContentCategories.vue)
    onMounted(() => keysNavigationSection.value = 'categories')

    return {
      categories,

      appSelected,
      categorySelected,
      categoryApps,

      keysNavigationSection,

      selectkeysNavigationSection: (value: string) => {
        keysNavigationSection.value = value
      },

      menuClose: () => {
        categorySelected.value = ''
        context.emit('close')
      }
    }
  }
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
    left: 16px;
  }
}
</style>