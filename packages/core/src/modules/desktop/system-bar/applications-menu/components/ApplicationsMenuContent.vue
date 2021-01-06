<template>
  <DesktopSystemBarMenuContent class="applications-container" v-if="opened">

    <div class="applications-categories">
      <ul>
        <li v-for="(category, i) in Object.keys(moduleApps)" :key="i">
          <a @click="categorySelected = category" v-text="category"/>
        </li>
      </ul>
    </div>

    <div class="applications-list">
      <ul v-if="categoryApps && categoryApps.length > 0">
        <li v-for="(app, i) of categoryApps" :key="i">
          <a @click="windowToggle(app)">
            <span :class="['mdi', app.icon.name || app.icon]" :style="`color: ${app.color};`"/>
            {{ app.titleShort }}
          </a>
        </li>
      </ul>
    </div>

  </DesktopSystemBarMenuContent>
</template>

<script>
import {computed, ref} from 'vue'
import {useStore} from "vuex";
import DesktopSystemBarMenuContent from '../../../../../components/desktop/system-bar/components/DesktopSystemBarMenuContent'

export default {
  components: {
    DesktopSystemBarMenuContent
  },
  props: {
    opened: Boolean
  },
  setup() {
    const store = useStore()

    const moduleApps = computed(() => store.getters['core/modules/moduleApps'])
    const applicationDropdown = ref(false)

    const categorySelected = ref('')
    const categoryApps = computed(() => {
      if (!categorySelected.value) {
        return []
      }

      return store.getters['core/modules/moduleApps'][categorySelected.value]
    })

    const windowToggle = (owdModuleAppWindow) => {
      store.dispatch('core/windows/windowOpen', owdModuleAppWindow.name)
    }

    return {
      moduleApps,

      applicationDropdown,

      categorySelected,
      categoryApps,

      windowToggle
    }
  }
}
</script>

<style scoped lang="scss">
.applications-container {
  display: grid;
  width: 410px;
  height: 500px;
  max-height: 60vh;
  grid-template-columns: 40% 60%;
  padding: 18px 16px 18px 0;
  line-height: 32px;
  left: 16px;

  .arrow {
    border: solid $windowBorder;
    background: $windowBackground;
    border-width: 0 3px 3px 0;
    display: inline-block;
    padding: 8px;
    transform: rotate(-135deg);
  }

  .applications-categories {
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

  .applications-list {
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