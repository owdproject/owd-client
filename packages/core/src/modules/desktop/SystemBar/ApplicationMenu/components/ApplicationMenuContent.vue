<template>
  <DesktopSystemBarMenuContent
      v-if="opened"
      class="owd-desktop__application-menu__container"
      v-click-outside="menuClose"
  >

    <div class="owd-desktop__application-menu__categories">
      <ul>
        <li v-for="(appList, category) in categories" :key="category">
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
            <MenuItemIcon :icon="moduleAppWindow.icon" force-svg />
            {{ moduleAppWindow.titleApp || moduleAppWindow.titleShort }}
          </a>
        </li>
      </ul>
    </div>

  </DesktopSystemBarMenuContent>
</template>

<script lang="ts">
import {computed, ref, getCurrentInstance} from 'vue'
import {useStore} from "vuex";
import {OwdModuleAppWindowInstance} from '@owd-client/types'
import DesktopSystemBarMenuContent from '@owd-client/core/src/components/desktop/SystemBar/components/SystemBarMenuContent'
import MenuItemIcon from '@owd-client/core/src/components/menu/menu-item/MenuItemIcon'

export default {
  components: {
    DesktopSystemBarMenuContent,
    MenuItemIcon
  },
  props: {
    opened: Boolean
  },
  emits: [
      'close'
  ],
  setup(props, context) {
    const app = getCurrentInstance();
    const store = useStore()
    const options = app.appContext.config.owd.desktop.SystemBar.options.modules.ApplicationMenu

    // categories
    const categories = computed(() => store.getters['core/windowCategory/modulesAppWindowCategories'])

    // category > apps
    const categorySelected = ref('')
    const categoryApps = computed(() => {
      if (!categorySelected.value) {
        return []
      }

      return categories.value[categorySelected.value]
    })

    const menuClose = () => {
      context.emit('close')
    }

    return {
      categories,

      categorySelected,
      categoryApps,

      categoryClick: (category: string) => {
        if (options.categoryAppsTriggerType === 'click') {
          categorySelected.value = category
        }
      },

      categoryMouseOver: (category: string) => {
        if (!options.categoryAppsTriggerType || options.categoryAppsTriggerType === 'mouseover') {
          categorySelected.value = category
        }
      },

      windowCreate: async (owdModuleAppWindow: OwdModuleAppWindowInstance) => {
        menuClose()
        await store.dispatch('core/window/windowCreate', owdModuleAppWindow.name)
      },

      menuClose
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
          line-height: $desktopSystemBarHeight;
          padding: 0 24px;
          border-radius: 4px;

          &:hover {
            background: $windowContentItemBackgroundHover;
          }

          .owd-menu__item__icon {
            display: inline-block;
            width: 32px;
            height: 32px;
            line-height: 32px;
            text-align: center;
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