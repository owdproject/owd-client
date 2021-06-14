<template>
  <div v-if="isMobile">
    <v-icon>{{$owd.config.icons.systemBar.battery}}</v-icon>
  </div>
</template>

<script setup>
import {ref, onMounted} from 'vue'

const batteryStatus = ref('idle')
const batteryLevel = ref(55)

// todo implement using vuetify
const isMobile = false

onMounted(() => {
  if (isMobile) updateBatteryLevel()
})

async function updateBatteryLevel() {
  return window.navigator.getBattery()
    .then((battery) => {
      batteryStatus.value = battery.charging
      batteryLevel.value = battery.level

      // .. and for any subsequent updates.
      battery.onchargingchange = function () {
        batteryStatus.value = battery.charging
      };

      battery.onlevelchange = function () {
        batteryLevel.value = battery.level
      };
    })
    .catch(e => {
      console.log(e)
    })
}
</script>