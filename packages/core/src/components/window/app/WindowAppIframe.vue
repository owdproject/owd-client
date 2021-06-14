<template>
  <WindowApp
      :dense="props.dense"
      :window="window"
      class="owd-window-iframe"
      v-click-outside="focusOut"
      @click="focusIn"
  >
    <template v-slot:nav-prepend>
      <slot name="nav-prepend" />
    </template>

    <template v-slot:nav-append>
      <slot name="nav-append" />
    </template>

    <div class="owd-window-iframe__content">
      <iframe
          :id="iframeId"
          :src="iframeSrc"
          @load="onIframeLoaded"
      />

      <div v-if="!focused" class="detect-focus-in" />
    </div>

    <v-progress-linear
        v-if="progressBar && !loaded"
        color="#323232"
        indeterminate
    />
  </WindowApp>
</template>

<script setup>
import {ref, watch, computed, defineProps, defineEmit} from "vue";
import WindowApp from './WindowApp.vue'

const props = defineProps({
  url: String,
  window: Object,
  progressBar: Boolean,
  dense: {
    type: Boolean,
    default: undefined
  }
})

const emit = defineEmit([
  'iframeFocusIn',
  'iframeFocusOut',
  'iframeLoaded'
])

const iframeSrc = ref('')
const loaded = ref(false)
const focused = ref(false)

const iframeId = computed(() => props.window.uniqueID)

function focusIn() {
  focused.value = true
  emit('iframeFocusIn')
  iframeFocus()
}

function focusOut() {
  focused.value = false
  emit('iframeFocusOut')
}

function iframeFocus() {
  document.getElementById(iframeId.value).focus()
}

function onIframeLoaded() {
  if (iframeSrc.value !== '') {
    loaded.value = true
  } else {
    if (props.window.storage.opened === true) {
      iframeSrc.value = this.url || props.window.metaData.iframeUrl
    }
  }

  emit('iframeLoaded')
}

watch(() => props.url, url => {
  if (props.window.storage.opened === true) {
    iframeSrc.value = url
  }
})

watch(() => props.window.storage.focused, val => {
  focused.value = val

  if (focused.value) {
    iframeFocus()
  }
})

watch(() => props.window.storage.opened, val => {
  if (val === true) {
    if (props.window.storage.opened === true) {
      iframeSrc.value = props.url || props.window.config.metaData.iframeUrl
    }
  } else {
    iframeSrc.value = ''
    loaded.value = false
  }
})
</script>

<style lang="scss">
.owd-window-iframe {
  &__content {
    height: 100%;

    iframe {
      border: 0;
      padding: 0;
      margin: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .detect-focus-in {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }

    .v-progress-linear {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
    }
  }
}
</style>
