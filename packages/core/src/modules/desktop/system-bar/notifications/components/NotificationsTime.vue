<template>
  <DesktopSystemBarMenu>
    <span class="date" v-text="date" />
    <span class="time" v-text="time" />
  </DesktopSystemBarMenu>
</template>

<script lang="ts">
import { getCurrentInstance } from 'vue'
import DesktopSystemBarMenu from "../../../../../components/desktop/system-bar/components/DesktopSystemBarMenu.vue";
import {ref} from "vue";

export default {
  components: {DesktopSystemBarMenu},
  props: {
    config: Object
  },
  setup() {
    const app = getCurrentInstance();

    const barDateFormat = app.appContext.config.owd.desktop.systemBar.options.notifications.bar.dateFormat
    const barTimeFormat = app.appContext.config.owd.desktop.systemBar.options.notifications.bar.timeFormat

    const calcDate = () => {
      return app.appContext.config.globalProperties.$moment(new Date()).format(barDateFormat)
    }
    const calcTime = () => {
      return app.appContext.config.globalProperties.$moment(new Date()).format(barTimeFormat)
    }

    let date = ref(calcDate())
    let time = ref(calcTime())

    setInterval(() => {
      date.value = calcDate()
      time.value = calcTime()
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