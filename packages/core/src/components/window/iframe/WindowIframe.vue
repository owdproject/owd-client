<template>
  <Window class="owd-window-iframe" :title="window.config.title" :window="window">
    <div class="owd-window-iframe__content" >
      <!--
      v-click-outside="focusOut"
      -->
      <iframe
        :src="url"
        @load="iframeLoaded"
      />

      <div v-if="!focus" class="detect-focus-in" @click="focusIn"/>
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
  props: {
    window: Object,
    progressBar: Boolean
  },
  data() {
    return {
      url: '',
      loaded: false,
      focus: true
    }
  },
  computed: {
    visible() {
      return this.window.storage.opened
    }
  },
  watch: {
    visible(val) {
      if (val === true) {
        if (this.visible === true) {
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
      this.focus = true
      this.$emit('iframeFocusIn')
    },
    focusOut() {
      this.focus = false
      this.$emit('iframeFocusOut')
    },
    iframeLoaded() {
      if (this.url !== '') {
        this.loaded = true
      } else {
        if (this.visible === true) {
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
