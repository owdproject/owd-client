<template>
  <vue-resizable
    v-show="!window.storage.closed && !window.storage.minimized"
    :data-window="window.name"
    :max-width="windowMaxWidth"
    :max-height="windowMaxHeight"
    :min-width="windowMinWidth"
    :min-height="windowMinHeight"
    :width="window.storage.size.width"
    :height="window.storage.size.height"
    :left="window.storage.position.x"
    :top="window.storage.position.y"
    :style="{
      'z-index': window.storage.position.z
    }"
    fit-parent
    drag-selector=".window-nav .window-nav-title"
    @drag:start="onDragStart"
    @drag:move="onDragMove"
    @drag:end="onDragEnd"
    @resize:start="onResizeStart"
    @resize:end="onResizeEnd"
    :class="[
      windowNameClass,
      'window',
      {
        'expanded': window.storage.expanded,
        'maximized': window.config.maximizable && window.storage.maximized,
        'dragging': dragging,
        'resizing': resizing,
        'fullscreen': window.config.fullscreen && window.storage.fullscreen,
        'no-resizable': !window.config.resizable,
        'no-content-margin': window.config.noContentMargin,
        'no-window-margin': window.config.noWindowMargin,
        'fullscreen-mobile': window.config.forceMobileMaximized
      }
    ]"
  >
    <div
      class="window-container"
      @mousedown="onActivated"
    >
      <WindowNav :title="title" @toggleMaximize="onToggleMaximize">
        <a
          class="btn btn-minimize"
          @click="onMinimize"
          v-if="typeof window.config.minimizable === 'undefined' || typeof window.config.minimizable === 'boolean' && window.config.minimizable"
        >
          <v-icon v-text="$owd.config.icons.windows.minimize" />
        </a>
        <a
          class="btn btn-maximize"
          @click="onToggleMaximize"
          v-if="window.config.maximizable"
        >
          <v-icon v-text="$owd.config.icons.windows.maximize" />
        </a>
        <a
          class="btn btn-external-url"
          :href="window.externalUrl"
          target="_blank"
          v-if="window.externalUrl"
        >
          <v-icon v-text="$owd.config.icons.windows.external" />
        </a>
        <a
          class="btn btn-close"
          @click="onClose"
        >
          <v-icon v-text="$owd.config.icons.windows.close" />
        </a>
      </WindowNav>
      <WindowContent>
        <slot />
      </WindowContent>

      <slot name="append-outer" />
    </div>
  </vue-resizable>
</template>

<script>
import {ref, computed} from 'vue'
import VueResizable from '../../../../vue-resizable/src/components/vue-resizable'
import WindowNav from './WindowNav'
import WindowContent from './WindowContent'

export default {
  name: 'Window',
  components: {
    WindowContent,
    WindowNav,
    VueResizable
  },
  props: {
    title: {
      type: String,
      default: 'Empty title'
    },
    window: Object
  },
  setup(props) {
    const resizing = ref(false)
    const dragging = ref(false)

    // window name class
    const windowNameClass = computed(() => {
      const kebabCase = require('kebab-case')
      const kebabCaseName = kebabCase(props.window.config.name)

      return kebabCaseName.substr(1, kebabCaseName.length+1)
    })

    // window max width
    const windowMaxWidth = computed(() => {
      if (!props.window.config.resizable) return props.window.config.size.width
      if (props.window.storage.fullscreen) return window.innerWidth
      if (props.window.config.maxWidth) return props.window.config.maxWidth

      return undefined
    })

    // window max height
    const windowMaxHeight = computed(() => {
      if (!props.window.config.resizable) return props.window.config.size.height
      if (props.window.storage.fullscreen) return window.innerHeight
      if (props.window.config.maxHeight) return props.window.config.maxHeight

      return undefined
    })

    // window min width
    const windowMinWidth = computed(() => {
      if (props.window.config.minWidth) return props.window.config.minWidth

      return props.window.config.size.width
    })

    // window min height
    const windowMinHeight = computed(() => {
      if (props.window.config.minHeight) return props.window.config.minHeight

      return props.window.config.size.height
    })

    return {
      resizing,
      dragging,

      windowNameClass,
      windowMaxWidth,
      windowMaxHeight,
      windowMinWidth,
      windowMinHeight,
    }
  },
  watch: {
    'window.storage': {
      handler: function () {
        clearTimeout(this.timeoutSaveToLocalStorage)

        this.timeoutSaveToLocalStorage = setTimeout(() => {
          this.$store.dispatch('core/windows/saveWindowsStorage')
        }, 500)
      },
      deep: true
    }
  },
  mounted() {
    const self = this

    // when press ESC and a window is in full-screen mode
    window.addEventListener('keydown', function(e) {
      if (e.keyCode === 27) {
        self.$store.dispatch('core/windows/windowUnmaximizeAll')
      }
    })

    if (this.window.config.autoCloseBeforePageUnload) {
      window.addEventListener(
          'beforeunload',
          async () => {
            await self.$store.dispatch('core/windows/windowClose', self.window)
            await self.$store.dispatch('core/windows/saveWindowsStorage')
          }
      )
    }

    if (this.window.config.autoDestroyBeforePageUnload) {
      window.addEventListener(
          'beforeunload',
          async () => {
            await self.$store.dispatch('core/windows/windowDestroy', self.window)
            await self.$store.dispatch('core/windows/saveWindowsStorage')
          }
      )
    }
  },
  methods: {
    /**
     * Window minimize event
     */
    onMinimize: function () {
      this.$store.dispatch('core/windows/windowMinimize', this.window)
    },

    /**
     * Window maximize event
     */
    onToggleMaximize: function () {
      this.$store.dispatch('core/windows/windowToggleMaximize', this.window)
    },

    /**
     * Window close event
     */
    onClose: function () {
      this.$store.dispatch('core/windows/windowDestroy', this.window)
    },

    /**
     * Window focus event
     */
    onFocus: function () {
      const self = this

      // prevent focus when minimizing or closing
      setTimeout(() => {
        self.$store.dispatch('core/windows/windowFocus', self.window)
      }, 100)
    },

    /**
     * Window actived event
     */
    onActivated: function () {
      if (!this.window.storage.closed) this.onFocus()
    },

    /**
     * Window start resize event
     */
    onResizeStart: function(data) {
      // emit to parent component
      this.$emit('resize:start', data)

      this.resizing = true
    },

    /**
     * Window end resize event
     */
    onResizeEnd: function(data) {
      // emit to parent component
      this.$emit('resize:end', data)

      this.$store.dispatch('core/windows/windowUpdatePosition', {
        data: this.window,
        position: { x: data.left, y: data.top, z: this.window.storage.position.z }
      })

      this.$store.dispatch('core/windows/windowUpdateSize', {
        data: this.window,
        size: { width: data.width, height: data.height }
      })

      this.resizing = false
    },

    /**
     * Window start drag event
     */
    onDragStart: function(data) {
      // emit to parent component
      this.$emit('drag:start', data)

      this.dragging = true
    },

    /**
     * On drag event, force no-margin when straight to borders
     */
    onDragMove: function(data) {
      let forceNoMargin = false

      if (data.top <= 15) {
        forceNoMargin = true
        data.top = 0
      }
      if (data.left <= 15) {
        forceNoMargin = true
        data.left = 0
      }

      if ((data.top + this.window.storage.size.height) >= window.innerHeight - 15) {
        forceNoMargin = true
        data.top = window.innerHeight - this.window.storage.size.height
      }

      if ((data.left + this.window.storage.size.width) >= window.innerWidth - 15) {
        forceNoMargin = true
        data.left = window.innerWidth - this.window.storage.size.width
      }

      if (forceNoMargin) {
        this.$store.dispatch('core/windows/windowUpdatePosition', {
          data: this.window,
          position: { x: data.left, y: data.top, z: this.window.storage.position.z }
        })

        this.$store.dispatch('core/windows/windowUpdateSize', {
          data: this.window,
          size: { width: data.width, height: data.height }
        })
      }
    },

    /**
     * Window stop drag event
     * @param data
     */
    onDragEnd: function (data) {
      // emit to parent component
      this.$emit('drag:end', data)

      this.dragging = false

      if (
        this.window.storage.position.x !== data.left ||
        this.window.storage.position.y !== data.top ||
        this.window.storage.size.width !== data.width ||
        this.window.storage.size.height !== data.height
      ) {
        if (data.top <= 15) data.top = 0
        if (data.left <= 15) data.left = 0

        this.$store.dispatch('core/windows/windowUpdatePosition', {
          data: this.window,
          position: { x: data.left, y: data.top, z: this.window.storage.position.z }
        })
      }
    }
  }
}
</script>

<style lang="scss">
  .resizable-component {
    position: absolute !important;
  }

  .window {
    background: $windowBackground;
    box-shadow: $windowShadow;
    border-radius: $windowBorderRadius;
    color: $windowColor;
    overflow: hidden;
    user-select: none;
    pointer-events: initial;

    .window-container {
      box-shadow: inset 0 0 0 1px $windowBorder;
    }

    &.dragging, &.resizing {
      .window-content:after {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        content: '';
      }
    }

    &.no-resizable {
      > [class^="resizable"] {
        display: none !important;
      }
    }

    &.no-window-margin .window-container > .window-content {
      height: 100%;
      margin: -34px 0 0 0;
      padding: 0;
    }

    &.no-content-margin .window-container > .window-content {
      height: 100%;
      margin: -34px 0 0 0;
    }

    &.maximized {
      .window-content {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        right: 0 !important;
        width: 100% !important;
        height: 100% !important;
        margin: 0 !important;
        padding: 15px;
        z-index: 12;
        background: #111111;

        @media (max-width: 768px) {
          left: auto !important;
        }
      }
    }

    @media (max-width: 768px) and (min-width: 561px) {
      max-width: calc(100% - 76px) !important;
    }

    .window-container {
      height: 100%;

      .window-content {
        height: calc(100% - 44px);
        padding: 0 12px 12px 12px;
        overflow: hidden;

        &:before {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          background-size: cover;
          content: '';
        }
      }
    }
  }

  #app.is-mobile {
    .window {
      max-width: 100%;
      max-height: 100%;
      top: 0 !important;
      left: auto !important;
      right: 0 !important;

      &.fullscreen-mobile {
        @media (max-width: 823px) and (max-height: 823px) {
          width: auto !important;
          min-width: 100%;
          max-width: 100%;
          height: 100% !important;
          max-height: 100% !important;
        }
      }
    }
  }
</style>
