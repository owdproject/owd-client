<template>
  <Window
    :window="window"
    class="owd-window-iframe"
  >
    <div
      class="owd-window-iframe__content"
      v-click-outside="focusOut"
    >
      <iframe
        :id="iframeId"
        :src="url"
        @load="iframeLoaded"
      />

      <div v-if="!window.storage.focused" class="detect-focus-in" @click="focusIn" />
    </div>

    <v-progress-linear
      v-if="progressBar && !loaded"
      color="#323232"
      indeterminate
    />
  </Window>
</template>

<script>
import Window from '../Window'

export default {
  components: {
    Window
  },
  emits: [
    'iframeFocusIn',
    'iframeFocusOut',
    'iframeLoaded'
  ],
  props: {
    window: Object,
    progressBar: Boolean
  },
  data() {
    return {
      url: '',
      loaded: false
    }
  },
  computed: {
    iframeId() {
      return this.window.module.moduleInfo.name+'-iframe'
    }
  },
  watch: {
    'window.storage.focused': async function (val) {
      if (val) {
        document.getElementById(this.iframeId).focus()
      }
    },
    'window.storage.opened': function (val) {
      if (val === true) {
        if (this.window.storage.opened === true) {
          this.url = this.window.config.iframeUrl
        }
      } else {
        this.url = ''
        this.loaded = false
      }
    }
  },
  methods: {
    focusIn() {
      this.$emit('iframeFocusIn')
    },
    focusOut() {
      this.$emit('iframeFocusOut')
    },
    iframeLoaded() {
      if (this.url !== '') {
        this.loaded = true
      } else {
        if (this.window.storage.opened === true) {
          this.url = this.window.iframeUrl
        }
      }

      this.$emit('iframeLoaded')
    }
  }
}
</script>

<style lang="scss">
.owd-window-iframe {
  &__content {
    position: relative;
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
