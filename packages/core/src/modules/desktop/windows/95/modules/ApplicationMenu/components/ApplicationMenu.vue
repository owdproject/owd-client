<template>
  <DesktopSystemBarMenu>
    <v-btn height="26">
      <span class="start-icon" />
      Start
    </v-btn>
  </DesktopSystemBarMenu>
</template>

<script setup>
import {defineProps} from 'vue'
import DesktopSystemBarMenu from "../../../components/SystemBar/components/SystemBarMenu.vue";

defineProps({
  config: Object
})
</script>

<style scoped lang="scss">
.v-btn {
  font-weight: bold;
  padding: 0 6px;

  .start-icon {
    display: inline-block;
    background-image: url('data:image/gif;base64,R0lGODlhEAAOAMIFAAAAAAAA//8AAAD/AP//APP07/P07/P07yH+EUNyZWF0ZWQgd2l0aCBHSU1QACH5BAEKAAcALAAAAAAQAA4AAANCeLoLDiyeRyFkT7hB58waMHBXBQjh6AjRSpFsHJqOgqJP4BB5CwQ6AIH3OwSMQeCOqAAqfxTipUF7eCqY2scqmSQAADs=');
    background-position: 0 center;
    width: 16px;
    height: 14px;
    margin: 0 6px 0 0;
  }
}
</style>