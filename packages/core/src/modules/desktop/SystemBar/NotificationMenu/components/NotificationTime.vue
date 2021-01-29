<template>
  <DesktopSystemBarMenu>
    <span class="date" v-text="date" />
    <span class="time" v-text="time" />
  </DesktopSystemBarMenu>
</template>

<script lang="ts">
import { getCurrentInstance } from 'vue'
import DesktopSystemBarMenu from "../../../../../components/desktop/SystemBar/components/SystemBarMenu.vue";
import {ref} from "vue";

export default {
  components: {DesktopSystemBarMenu},
  props: {
    config: Object
  },
  setup() {
    const app = getCurrentInstance();
    const $moment = app.appContext.config.globalProperties.$moment
    const options = app.appContext.config.owd.desktop.SystemBar.options.modules.NotificationMenu

    const getDate = () => {
      return $moment().format(options.menu.dateFormat)
    }
    const getTime = () => {
      return $moment().format(options.menu.timeFormat)
    }

    let date = ref(getDate())
    let time = ref(getTime())

    setInterval(() => {
      date.value = getDate()
      time.value = getTime()
    }, 1000)

    return {
      date,
      time
    }
  }
}
</script>

<style scoped lang="scss">
.date {
  margin-right: 8px;
}
</style>