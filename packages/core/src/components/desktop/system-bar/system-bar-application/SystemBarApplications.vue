<template>
  <ul class="system-bar-applications">
    <li>
      <a @click="applicationDropdown = !applicationDropdown">Applications</a>

      <div class="applications-container" v-if="applicationDropdown">
        <div class="applications-categories">
          <ul>
            <li v-for="(category, i) of Object.keys(windowCategories)" :key="i">
              <a @click="categorySelected = category">
                {{category}}
              </a>
            </li>
          </ul>
        </div>
        <div class="applications-list">
          <ul v-if="categoryApps && categoryApps.length > 0">
            <li v-for="(app, i) of categoryApps" :key="i">
              <a @click="windowToggle(app)">
                <span :class="['mdi', app.config.icon.name]" />
                {{app.config.titleShort}}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import { ref, computed } from 'vue'
import {useStore} from "vuex";

export default {
  name: "SystemBarApplications",
  setup() {
    const store = useStore()
    const windowCategories = computed(() => store.getters['core/windows/windowCategories'])

    const applicationDropdown = ref(false)

    const categorySelected = ref('')
    const categoryApps = computed(() => {
      if (!categorySelected.value) return []

      return store.getters['core/windows/windowCategories'][categorySelected.value]
    })

    const windowToggle = function(windowInstance) {
      if (windowInstance.storage && (windowInstance.storage.closed || windowInstance.storage.minimized)) {
        store.dispatch('core/windows/windowOpen', windowInstance)
      } else {
        // don't close if window has to stay minimized
        if (windowInstance.config.menu === true) {
          store.dispatch('core/windows/windowClose', windowInstance)
        } else {
          store.dispatch('core/windows/windowMinimize', windowInstance)
        }
      }
    }

    return {
      windowCategories,

      applicationDropdown,

      categorySelected,
      categoryApps,

      windowToggle
    }
  }
}
</script>

<style scoped lang="scss">
ul.system-bar-applications {
  margin: 0;
  padding: 0;

  > li {
    display: inline-block;
    margin-right: 25px;

    > a {
      display: block;
      padding: 0 12px;
    }

    .v-icon {
      margin-left: -2px;
    }
  }
}

.applications-container {
  position: absolute;
  top: 45px;
  left: 13px;
  padding: 15px 20px;
  background: #333;
  color: white;
  border-radius: 5px;
  line-height: 25px;
  font-weight: normal;
  font-size: 13px;
  z-index: 999;
  height: 500px;
  max-height: 60vh;

  display: grid;
  width: 410px;
  grid-template-columns: 40% 60%;

  .applications-categories {
    ul {
      margin: 0;
      padding: 0;
      list-style-type: none;

      li {
        width: 100%;

        a {
          display: block;
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
          line-height: 24px;

          span {
            font-size: 24px;
            vertical-align: middle;
            margin-right: 10px;
          }
        }
      }
    }
  }
}
</style>