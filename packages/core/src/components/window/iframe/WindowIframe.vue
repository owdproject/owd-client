<template>
  <Window class="owd-window-iframe" :title="data.config.title" :window="data">
    <div class="owd-window-iframe__content" v-click-outside="focusOut">
      <iframe
        :src="url" :id="`${data.module.moduleInfo.name+'-iframe'}`"
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
    data: Object,
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
      return this.data.storage.opened
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
          this.url = this.data.iframeUrl
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

    iframe {
      border: 0;
      padding: 0;
      margin: 0;
      width: 100%;
      height: 100%;
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
