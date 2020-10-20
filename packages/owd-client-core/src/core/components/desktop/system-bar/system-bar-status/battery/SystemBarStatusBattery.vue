<template>
  <div v-if="$device.mobile">
    <v-icon>mdi-battery</v-icon>
  </div>
</template>

<script>
export default {
  name: "SystemBarStatusBattery",
  data() {
    return {
      batteryStatus: 'idle',
      batteryLevel: 55
    }
  },
  methods: {
    async updateBatteryLevel() {
      const self = this

      return window.navigator.getBattery()
        .then((battery) => {
          this.batteryStatus = battery.charging
          this.batteryLevel = battery.level

          // .. and for any subsequent updates.
          battery.onchargingchange = function () {
            self.batteryStatus = battery.charging
          };

          battery.onlevelchange = function () {
            self.batteryLevel = battery.level
          };
        })
        .catch(e => {
          console.log(e)
        })
    }
  },
  mounted() {
    if (this.$device.mobile) this.updateBatteryLevel()
  }
}
</script>