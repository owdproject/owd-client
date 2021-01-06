<template>
  <DesktopSystemBarMenu v-text="time" />
</template>

<script lang="ts">
import DesktopSystemBarMenu from "../../../../../components/desktop/system-bar/components/DesktopSystemBarMenu.vue";
import {ref} from "vue";

export default {
  components: {DesktopSystemBarMenu},
  props: {
    config: Object
  },
  setup() {
    const calcTime = () => {
      let currentHours: any = new Date().getHours();
      currentHours = ("0" + currentHours).slice(-2);

      let currentMinutes: any = new Date().getMinutes();
      currentMinutes = ("0" + currentMinutes).slice(-2);

      return `${currentHours}:${currentMinutes}`
    }

    let time = ref(calcTime())

    setInterval(() => {
      time.value = calcTime()
    }, 1000)

    return {
      time
    }
  }
}
</script>