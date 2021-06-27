<template>
  <WindowApp
      :dense="props.dense"
      :window="window"
      class="owd-window-iframe"
      v-click-outside="focusOut"
      @click="focusIn"
      @open="windowOpen"
      @close="windowClose"
      @resize:start="(data) => emit('resize:start', data)"
      @resize:move="(data) => emit('resize:move', data)"
      @resize:end="(data) => emit('resize:end', data)"
      @drag:start="(data) => emit('drag:start', data)"
      @drag:move="(data) => emit('drag:move', data)"
      @drag:end="(data) => emit('drag:end', data)"
      @blur="(data) => emit('blur', data)"
      @focus="(data) => emit('focus', data)"
      @minimize="(data) => emit('minimize', data)"
      @restore="(data) => emit('restore', data)"
      @maximize="(data) => emit('maximize', data)"
      @unmaximize="(data) => emit('unmaximize', data)"
  >
    <template v-slot:nav-prepend>
      <slot name="nav-prepend" />
    </template>

    <template v-slot:nav-append>
      <slot name="nav-append" />
    </template>

    <div class="owd-window-iframe__content">
      <iframe
          v-if="iframeSrc"
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
  'iframeLoaded',
  'resize:start',
  'resize:move',
  'resize:end',
  'drag:start',
  'drag:move',
  'drag:end',
  'close',
  'open',
  'blur',
  'focus',
  'minimize',
  'restore',
  'maximize',
  'unmaximize',
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
  if (document.getElementById(iframeId.value)) {
    document.getElementById(iframeId.value).focus()
  }
}

function onIframeLoaded() {
  iframeFocus()

  emit('iframeLoaded')
}

watch(() => props.url, url => {
  if (props.window.storage.opened === true) {
    iframeSrc.value = url
  }
})

watch(() => props.window.config, config => {
  if (props.window.storage.opened === true) {
    iframeSrc.value = config.metaData.iframeUrl
  }
}, {deep: true})

watch(() => props.window.storage.focused, val => {
  focused.value = val

  if (focused.value) {
    iframeFocus()
  }
})

function windowOpen(data) {
  emit('open', data)

  if (props.window.storage.opened === true) {
    iframeSrc.value = props.url || props.window.config.metaData.iframeUrl
  }
}

function windowClose(data) {
  emit('close', data)

  iframeSrc.value = ''
  loaded.value = false
}
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
