<template>
  <transition name="fade-transition">
    <v-btn
        class="btn-exit-full-screen" rounded dark disabled
        v-show="visible"
    >
      Press <kbd>ESC</kbd> to exit full screen
    </v-btn>
  </transition>
</template>

<script>
export default {
  name: "NoticePressToExitFullscreen",
  data() {
    return {
      visible: false,
      timeout: null
    }
  },
  mounted() {
    this.$store.subscribe((mutation) => {
      if (mutation.type === 'core/fullscreen/SET_FULLSCREEN_MODE') {
        if (typeof mutation.payload === 'boolean') {
          if (mutation.payload) {

            clearTimeout(this.timeout)
            this.visible = true

            this.timeout = setTimeout(() => {
              this.visible = false
            }, 3000)

          } else {

            this.visible = false

          }
        }
      }
    })
  }
}
</script>

<style scoped lang="scss">
.v-btn.btn-exit-full-screen.v-btn--disabled {
  position: absolute;
  top: 24px;
  left: 50%;
  width: 330px;
  min-height: 44px;
  margin-left: -165px;
  color: #AAA !important;
  text-align: center;
  text-transform: inherit;
  z-index: 9999;

  kbd {
    border: 1px solid #BBB;
    padding: 3px 4px;
    margin: 0 8px;
    border-radius: 2px;
  }
}
</style>