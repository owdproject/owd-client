<template>
  <span class="system-bar-date" v-text="time" />
</template>

<script>
export default {
  name: "SystemBarDate",
  data() {
    return {
      now: new Date()
    }
  },
  created () {
    const self = this

    setInterval(() => self.now = new Date(), 1000)
  },
  computed: {
    time() {
      let currentHours = this.now.getHours();
      currentHours = ("0" + currentHours).slice(-2);

      let currentMinutes = this.now.getMinutes();
      currentMinutes = ("0" + currentMinutes).slice(-2);

      return `${currentHours}:${currentMinutes}`
    }
  }
}
</script>

<style scoped lang="scss">
.system-bar-date {
  @media(min-width: 768px) {
    position: absolute;
    left: 50%;
    transform: translateX(-50%)
  }
}
</style>