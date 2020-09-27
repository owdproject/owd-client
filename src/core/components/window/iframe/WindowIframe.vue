<template>
  <Window
    :title="data.title"
    :window="data"
  >
    <iframe
      @load="iframeLoaded"
      :src="url"
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
    data: Object
  },
  data() {
    return {
      url: '',
      loaded: false
    }
  },
  computed: {
    visible() {
      return !this.data.storage.closed && !this.data.storage.minimized
    }
  },
  watch: {
    'visible': function (val) {
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
    }
  }
}
</script>

<style scoped lang="scss">
  iframe {
    border: 0;
    padding: 0;
    margin: 0;
    width: 100%;
    height: 100%;
  }
</style>
