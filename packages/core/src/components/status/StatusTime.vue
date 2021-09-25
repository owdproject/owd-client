<template>
  <div class="owd-desktop__system-bar__date-time">
    <span class="date" v-text="date" v-if="showDate" />
    <span class="time" v-text="time" />
  </div>
</template>

<script setup lang="ts">
import { getCurrentInstance, inject, ref } from 'vue'

const desktopOptions = inject('desktopOptions')

const props = defineProps({
  showDate: Boolean,
  dateFormat: {
    type: String,
    default: 'HH:mm'
  },
  timeFormat: {
    type: String,
    default: 'MMMM D YYYY'
  }
})

const app = getCurrentInstance();
const moment = app.appContext.config.globalProperties.$moment

const getDate = () => {
  return moment().format(props.dateFormat)
}
const getTime = () => {
  return moment().format(desktopOptions.Status.menu.timeFormat)
}

let date = ref(getDate())
let time = ref(getTime())

setInterval(() => {
  date.value = getDate()
  time.value = getTime()
}, 1000)
</script>

<style scoped lang="scss">
.owd-desktop__system-bar__date-time {
  .date {
    margin-right: 8px;
  }
}
</style>