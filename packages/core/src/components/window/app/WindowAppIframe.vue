<template>
  <WindowApp
      :dense="props.dense"
      :window="window"
      class="owd-window-iframe"
      v-click-outside="focusOut"
      @click="focusIn"
      @resize:start="(data) => emit('resize:start', data)"
      @resize:move="(data) => emit('resize:move', data)"
      @resize:end="(data) => emit('resize:end', data)"
      @drag:start="(data) => emit('drag:start', data)"
      @drag:move="(data) => emit('drag:move', data)"
      @drag:end="(data) => emit('drag:end', data)"
      @mount="(data) => emit('mount', data)"
      @unmount="(data) => emit('unmount', data)"
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
          v-if="iframe && iframe.src"
          :id="iframeId"
          :src="iframe.src"
          :allow="iframe.allow"
          @load="onIframeLoaded"
      />

      <div v-if="!focused" class="detect-focus-in" />
    </div>

    <!--
    <v-progress-linear
        v-if="progressBar && !loaded"
        color="#323232"
        indeterminate
    />
    -->
  </WindowApp>
</template>

<script setup>
import {ref, watch, computed, onMounted} from "vue";

const props = defineProps({
  url: String,
  window: Object,
  progressBar: Boolean,
  dense: {
    type: Boolean,
    default: undefined
  }
})

const emit = defineEmits([
  'mount',
  'unmount',
  'blur',
  'focus',
  'minimize',
  'restore',
  'maximize',
  'unmaximize',
  'iframeFocusIn',
  'iframeFocusOut',
  'iframeLoaded',
  'resize:start',
  'resize:move',
  'resize:end',
  'drag:start',
  'drag:move',
  'drag:end',
])

const iframe = ref(null)
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

watch(() => props.url, url => iframe.src.value = url)

watch(() => props.window.config, config => iframeSrc.value = config.metaData.iframeUrl, {deep: true})

watch(() => props.window.storage.focused, val => {
  focused.value = val

  if (focused.value) {
    iframeFocus()
  }
})

onMounted(() => {
  iframe.value = {
    src: props.url || props.window.config.metaData.iframe.src,
    allow: props.window.config.metaData?.iframe?.allow
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
