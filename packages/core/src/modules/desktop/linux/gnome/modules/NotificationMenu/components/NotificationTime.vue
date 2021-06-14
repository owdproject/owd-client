<template>
  <DesktopSystemBarMenu>
    <span class="date" v-text="date" />
    <span class="time" v-text="time" />
  </DesktopSystemBarMenu>
</template>

<script setup lang="ts">
import { getCurrentInstance, inject, ref, defineProps } from 'vue'
import DesktopSystemBarMenu from "../../../components/SystemBar/components/SystemBarMenu.vue";
import ModuleDesktopExtend from "@owd-client/core/src/libraries/module-desktop/extend/moduleDesktopExtend.class";

const desktopOptions = inject('desktopOptions')

const props = defineProps({
  config: Object
})

const app = getCurrentInstance();
const moment = app.appContext.config.globalProperties.$moment

const getDate = () => {
  return moment().format(desktopOptions.NotificationMenu.menu.dateFormat)
}
const getTime = () => {
  return moment().format(desktopOptions.NotificationMenu.menu.timeFormat)
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