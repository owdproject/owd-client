<template>
  <DesktopSystemBarMenuContent
      v-if="opened"
      arrow-position="left"
      class="owd-desktop__application-menu__container"
  >

    <div class="owd-desktop__application-menu__categories">
      <ul>
        <li v-for="(category, i) in Object.keys(appWindowCategories)" :key="i">
          <a
            @mouseover="categoryMouseOver(category)"
            @click="categoryClick(category)"
            v-text="$t(`desktop.SystemBar.ApplicationMenu.categories.${category}`)"
          />
        </li>
      </ul>
    </div>

    <div class="owd-desktop__application-menu__list">
      <ul v-if="categoryApps && categoryApps.length > 0">
        <li v-for="(moduleAppWindow, i) of categoryApps" :key="i">
          <a @click="windowCreate(moduleAppWindow)">
            <span
              :class="['mdi', moduleAppWindow.icon.name || moduleAppWindow.icon]"
              :style="`color: ${moduleAppWindow.color};`"
            />
            {{ moduleAppWindow.titleShort }}
          </a>
        </li>
      </ul>
    </div>

  </DesktopSystemBarMenuContent>
</template>

<script>
import {computed, ref, getCurrentInstance} from 'vue'
import {useStore} from "vuex";
import DesktopSystemBarMenuContent
  from '../../../../../components/desktop/SystemBar/components/SystemBarMenuContent'

export default {
  components: {
    DesktopSystemBarMenuContent
  },
  props: {
    opened: Boolean
  },
  setup() {
    const app = getCurrentInstance();
    const store = useStore()
    const options = app.appContext.config.owd.desktop.SystemBar.options.modules.ApplicationMenu

    const appWindowCategories = computed(() => store.getters['core/window/modulesAppWindowCategories'])

    const categorySelected = ref('')
    const categoryAppsTriggerType = options.categoryAppsTriggerType
    const categoryApps = computed(() => {
      if (!categorySelected.value) {
        return []
      }

      return appWindowCategories.value[categorySelected.value]
    })

    return {
      appWindowCategories,

      categorySelected,
      categoryApps,

      categoryClick: (category) => {
        if (categoryAppsTriggerType === 'click') {
          categorySelected.value = category
        }
      },

      categoryMouseOver: (category) => {
        if (!categoryAppsTriggerType || categoryAppsTriggerType === 'mouseover') {
          categorySelected.value = category
        }
      },

      windowCreate: async (owdModuleAppWindow) => {
        await store.dispatch('core/window/windowCreate', owdModuleAppWindow.name)
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
    height: 500px;
    max-height: 60vh;
    grid-template-columns: 40% 60%;
    line-height: 32px;
    left: 16px;
  }

  &__categories {
    padding: 16px 0;

    ul {
      margin: 0;
      padding: 0;
      list-style-type: none;

      li {
        width: 100%;

        a {
          display: block;
          padding-left: 20px;
          border-radius: 0 4px 4px 0;

          &:hover {
            background: $windowContentItemBackgroundHover;
          }
        }
      }
    }
  }

  &__list {
    overflow-y: auto;
    padding: 16px 14px 16px 0;

    ul {
      margin: 0;
      padding: 0;
      list-style-type: none;

      li {
        width: 100%;

        a {
          display: block;
          cursor: pointer;
          line-height: 40px;
          padding: 0 24px;
          border-radius: 4px;

          &:hover {
            background: $windowContentItemBackgroundHover;
          }

          span {
            font-size: 24px;
            vertical-align: middle;
            margin-right: 12px;
            color: $windowColorActive;
          }
        }
      }
    }
  }
}
</style>