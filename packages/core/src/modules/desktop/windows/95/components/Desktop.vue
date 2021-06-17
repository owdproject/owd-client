<template>
  <DesktopBase :class="{
    'owd-desktop__system-bar--position-top': desktopOptions.SystemBar.position === 'top',
    'owd-desktop__system-bar--position-bottom': desktopOptions.SystemBar.position === 'bottom',
  }">
    <SystemBar v-if="desktopOptions.SystemBar.enabled">

      <!-- additional slots for left area system-bar -->
      <template v-slot:system-bar-left-append>
        <slot name="system-bar-left-append"/>
      </template>

      <!-- additional slots for right area system-bar -->
      <template v-slot:system-bar-right-prepend>
        <slot name="system-bar-right-prepend"/>
      </template>
      <template v-slot:system-bar-right-append>
        <slot name="system-bar-right-append"/>
      </template>

    </SystemBar>

    <div class="owd-desktop__content">
      <slot/>
    </div>
  </DesktopBase>
</template>

<script setup>
import {inject} from 'vue'
import DesktopBase from '@owd-client/core/src/components/desktop/DesktopBase.vue'
import SystemBar from "./SystemBar/SystemBar.vue";

const desktopOptions = inject('desktopOptions')
</script>

<style scoped lang="scss">
.owd-desktop {
  background: $owd-desktop-system-bar-background;

  &__system-bar {
    &--position-bottom {
      flex-direction: column-reverse;
    }
  }

  &__content {
    background: $owd-background;
  }
}
</style>