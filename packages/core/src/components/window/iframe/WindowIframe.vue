<template>
  <Window
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
    url: String,
    window: Object,
    progressBar: Boolean
  },
  data() {
    return {
      iframeSrc: '',
      loaded: false,
      focused: false
    }
  },
  computed: {
    iframeId() {
      return this.window.uniqueID
    }
  },
  watch: {
    url: function(val) {
      if (this.window.storage.opened === true) {
        this.iframeSrc = val
      }
    },
    'window.storage.focused': async function (val) {
      this.focused = val

      if (val) {
        this.iframeFocus()
      }
    },
    'window.storage.opened': function (val) {
      if (val === true) {
        if (this.window.storage.opened === true) {
          this.iframeSrc = this.url || this.window.config.metaData.iframeUrl
        }
      } else {
        this.iframeSrc = ''
        this.loaded = false
      }
    }
  },
  methods: {
    focusIn() {
      this.focused = true
      this.$emit('iframeFocusIn')
      this.iframeFocus()
    },
    focusOut() {
      this.focused = false
      this.$emit('iframeFocusOut')
    },
    iframeFocus() {
      document.getElementById(this.iframeId).focus()
    },
    onIframeLoaded() {
      if (this.iframeSrc !== '') {
        this.loaded = true
      } else {
        if (this.window.storage.opened === true) {
          this.iframeSrc = this.url || this.window.metaData.iframeUrl
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
