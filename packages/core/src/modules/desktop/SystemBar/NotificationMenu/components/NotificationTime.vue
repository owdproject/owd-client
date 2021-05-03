<template>
  <DesktopSystemBarMenu>
    <span class="date" v-text="date" />
    <span class="time" v-text="time" />
  </DesktopSystemBarMenu>
</template>

<script setup lang="ts">
import { getCurrentInstance } from 'vue'
import DesktopSystemBarMenu from "@owd-client/core/src/components/desktop/SystemBar/components/SystemBarMenu.vue";
import {ref, defineProps} from "vue";

const props = defineProps({
  config: Object
})

const app = getCurrentInstance();
const owdConfig = app.appContext.config.owd
const moment = app.appContext.config.globalProperties.$moment

const notificationMenuOptions = owdConfig.desktop.SystemBar.options.modules.NotificationMenu

const getDate = () => {
  return moment().format(notificationMenuOptions.menu.dateFormat)
}
const getTime = () => {
  return moment().format(notificationMenuOptions.menu.timeFormat)
}

let date = ref(getDate())
let time = ref(getTime())

setInterval(() => {
  date.value = getDate()
  time.value = getTime()
}, 1000)
</script>

<style scoped lang="scss">
.date {
  margin-right: 8px;
}
</style>