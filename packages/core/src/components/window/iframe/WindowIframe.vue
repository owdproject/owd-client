<template>
  <Window class="window-iframe" :title="data.title" :window="data">
    <iframe @load="iframeLoaded" :id="`${data.module.moduleInfo.name+'-iframe'}`" :src="url" />
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
  name: 'WindowIframe',
  components: {
    Window
  },
  props: {
    data: Object,
    progressBar: Boolean
  },
  data() {
    return {
      url: '',
      loaded: false
    }
  },
  computed: {
    visible() {
      return !this.data.storage.closed
    }
  },
  watch: {
    visible(val) {
      if (val === true) {
        if (this.visible === true) {
          this.url = this.data.iframeUrl
        }
      } else {
        this.url = ''
        this.loaded = false
      }
    }
  },
  methods: {
    iframeLoaded() {
      if (this.url !== '') {
        this.loaded = true
      } else {
        if (this.visible === true) {
          this.url = this.data.iframeUrl
        }
      }

      this.$emit('iframeLoaded')
    }
  }
}
</script>

<style lang="scss">
.window-iframe {
  .window-content {
    position: relative;

    iframe {
      border: 0;
      padding: 0;
      margin: 0;
      width: 100%;
      height: 100%;
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
