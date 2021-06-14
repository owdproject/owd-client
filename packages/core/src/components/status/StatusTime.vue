<template>
  <div>
    <span class="date" v-text="date" v-if="showDate" />
    <span class="time" v-text="time" />
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, inject, ref, defineProps } from 'vue'

const desktopOptions = inject('desktopOptions')

const props = defineProps({
  showDate: Boolean
})

const app = getCurrentInstance();
const moment = app.appContext.config.globalProperties.$moment

const getDate = () => {
  return moment().format(desktopOptions.StatusMenu.menu.dateFormat)
}
const getTime = () => {
  return moment().format(desktopOptions.StatusMenu.menu.timeFormat)
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

<style scoped>

</style>