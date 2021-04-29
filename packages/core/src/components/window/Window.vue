<template>
  <vue-resizable
    v-show="window.storage.opened && !window.storage.minimized"
    :data-window="window.config.name"
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
    drag-selector=".owd-window__nav .owd-window__nav__draggable"
    @drag:start="onDragStart"
    @drag:move="onDragMove"
    @drag:end="onDragEnd"
    @resize:start="onResizeStart"
    @resize:end="onResizeEnd"
    :class="[
      windowNameClass,
      'owd-window',
      {
        'owd-window--dense': isDense,
        // todo create computed isFocused, isMaximizable, etc
        'owd-window--focused': window.storage.focused,
        'owd-window--maximized': window.config.maximizable && window.storage.maximized,
        'owd-window--dragging': dragging,
        'owd-window--resizing': resizing,
        'owd-window--fullscreen': window.config.fullscreenable && window.storage.fullscreen,
        'owd-window--borderless': window.config.borderless,
        'owd-window--no-resizable': !window.config.resizable,
        'owd-window--no-content-spacing': window.config.noContentSpacing
      }
    ]"
  >
    <div class="owd-window__container" @mousedown="onMouseDown">

      <WindowNav :title="title || window.storage.title || window.config.titleWindow || window.config.title" @toggleMaximize="onToggleMaximize">
        <template v-slot:nav-prepend>
          <slot name="nav-prepend" />
        </template>

        <template v-slot:nav-append>
          <slot name="nav-append" />

          <div class="ml-1">
            <WindowNavButtonCommon
                v-if="typeof window.config.minimizable === 'undefined' || typeof window.config.minimizable === 'boolean' && window.config.minimizable"
                class="btn-minimize"
                :icon="$owd.config.icons.window.minimize"
                @click="onMinimize"
            />

            <WindowNavButtonCommon
                v-if="window.config.maximizable"
                class="btn-maximize"
                :icon="$owd.config.icons.window.maximize"
                @click="onToggleMaximize"
            />

            <WindowNavButtonCommon
                v-if="window.config.fullscreenable"
                class="btn-fullscreen"
                :icon="$owd.config.icons.window.fullscreen"
                @click="onToggleFullscreen"
            />

            <WindowNavButtonCommon
                v-if="window.externalUrl"
                class="btn-external-url"
                :href="window.externalUrl"
                :icon="$owd.config.icons.window.external"
                target="_blank"
            />

            <WindowNavButtonCommon
                class="btn-close"
                :icon="$owd.config.icons.window.close"
                @click.stop="onClose"
            />
          </div>

        </template>
      </WindowNav>

      <div class="owd-window__content">
        <slot />
      </div>

      <slot name="append-outer" />

    </div>
  </vue-resizable>
</template>

<script>
import {computed, ref} from 'vue'
import VueResizable from 'vue-resizable/src'
import WindowNav from './nav/WindowNav'
import WindowNavButtonCommon from "./nav/WindowNavButtonCommon";

export default {
  components: {
    VueResizable,
    WindowNav,
    WindowNavButtonCommon,
  },
  props: {
    title: {
      type: String
    },
    dense: {
      type: Boolean,
      default: true
    },
    window: Object
  },
  emits: [
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
    'unmaximize'
  ],
  setup(props) {
    const resizing = ref(false)
    const dragging = ref(false)

    const isDense = computed(() => {
      if (props.window.config.dense === false) {
        return props.window.config.dense
      }

      return props.dense
    })

    // window name class
    const windowNameClass = computed(() => {
      const kebabCase = require('kebab-case')
      const kebabCaseName = kebabCase(props.window.config.name)

      return 'owd-'+kebabCaseName.substr(1, kebabCaseName.length + 1)
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

      isDense,

      windowNameClass,
      windowMaxWidth,
      windowMaxHeight,
      windowMinWidth,
      windowMinHeight,
    }
  },
  watch: {
    'window.storage.focused': {
      handler: function (focused) {
        this.$emit(focused ? 'focus' : 'blur')
      }
    },
    'window.storage.opened': {
      handler: function (opened) {
        this.$emit(opened ? 'open' : 'close')
      }
    },
    'window.storage.minimized': {
      handler: function (minimized) {
        this.$emit(minimized ? 'minimize' : 'restore')
      }
    },
    'window.storage.maximized': {
      handler: function (maximized) {
        this.$emit(maximized ? 'maximize' : 'unmaximize')
      }
    },
    'window.storage': {
      handler: function () {
        clearTimeout(this.timeoutSaveToLocalStorage)

        this.timeoutSaveToLocalStorage = setTimeout(() => {
          this.$store.dispatch('core/window/saveWindowsStorage')
        }, 500)
      },
      deep: true
    }
  },
  mounted() {
    const self = this

    if (this.window.config.autoCloseBeforePageUnload) {
      window.addEventListener(
          'beforeunload',
          async () => {
            await self.$store.dispatch('core/window/windowClose', self.window)
            await self.$store.dispatch('core/window/saveWindowsStorage')
          }
      )
    }

    if (this.window.config.autoDestroyBeforePageUnload) {
      window.addEventListener(
          'beforeunload',
          async () => {
            await self.$store.dispatch('core/window/windowDestroy', self.window)
            await self.$store.dispatch('core/window/saveWindowsStorage')
          }
      )
    }
  },
  methods: {
    /**
     * Window minimize event
     */
    onMinimize: function () {
      this.$store.dispatch('core/window/windowMinimize', this.window)
    },

    /**
     * Window maximize event
     */
    onToggleMaximize: function () {
      if (!this.window.config.maximizable) {
        return false
      }

      this.$store.dispatch(
          this.window.storage.maximized ? 'core/window/windowUnmaximize' : 'core/window/windowMaximize',
          this.window
      )
    },

    /**
     * Window fullscreen event
     */
    onToggleFullscreen: function () {
      if (!this.window.config.fullscreenable) {
        return false
      }

      this.$store.dispatch(
          this.window.storage.fullscreen ? 'core/window/windowUnfullscreen' : 'core/window/windowFullscreen',
          this.window
      )
    },

    /**
     * Window close event
     */
    onClose: function () {
      this.$store.dispatch('core/window/windowDestroy', this.window)
    },

    /**
     * Window focus event
     */
    onFocus: function () {
      const self = this

      // prevent focus when minimizing or closing
      setTimeout(() => {
        self.$store.dispatch('core/window/windowFocus', self.window)
      }, 20)
    },

    /**
     * Window mousedown event
     */
    onMouseDown: function (e) {
      if (!e.target.closest('.owd-window__nav__btn-group')) {
        this.onFocus()
      }
    },

    /**
     * Window start resize event
     */
    onResizeStart: function (data) {
      // emit to parent component
      this.$emit('resize:start', data)

      this.resizing = true
    },

    /**
     * Window end resize event
     */
    onResizeEnd: function (data) {
      // emit to parent component
      this.$emit('resize:end', data)

      this.$store.dispatch('core/window/windowUpdateSize', {
        window: this.window,
        size: {width: data.width, height: data.height}
      })

      this.$store.dispatch('core/window/windowSetPosition', {
        window: this.window,
        position: {x: data.left, y: data.top, z: this.window.storage.position.z}
      })

      this.resizing = false
    },

    /**
     * Window start drag event
     */
    onDragStart: function (data) {
      // emit to parent component
      this.$emit('drag:start', data)

      this.dragging = true
    },

    /**
     * On drag event, force no-margin when straight to borders
     */
    onDragMove: function (data) {
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
        this.$store.dispatch('core/window/windowSetPosition', {
          window: this.window,
          position: {x: data.left, y: data.top, z: this.window.storage.position.z}
        })

        this.$store.dispatch('core/window/windowUpdateSize', {
          window: this.window,
          size: {width: data.width, height: data.height}
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

        this.$store.dispatch('core/window/windowSetPosition', {
          window: this.window,
          position: {x: data.left, y: data.top, z: this.window.storage.position.z}
        })
      }
    }
  }
}
</script>

<style lang="scss">
  .owd-window {
    background: $windowBackground;
    box-shadow: $windowShadow;
    border-radius: $windowBorderRadius;
    color: $windowColor;
    overflow: hidden;
    user-select: none;
    pointer-events: initial;
    max-width: 100% !important;
    max-height: 100%;

    @media (max-width: 768px) and (min-width: 561px) {
      //max-width: calc(100% - 76px) !important;
    }

    &.resizable-component {
      position: absolute !important;
    }

    &__container {
      display: grid;
      grid-template-rows: 100%;
      height: 100%;
      box-shadow: inset 0 0 0 1px $windowBorder;
    }

    &__content {
      position: relative;
      height: 100%;
      padding: 0 12px 12px 12px;
      box-sizing: border-box;
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

    &--dragging, &--resizing {
      .owd-window__content:after {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        content: '';
      }
    }

    &--no-resizable {
      > [class^="resizable"] {
        display: none !important;
      }
    }

    &--no-content-spacing {
      .owd-window__container {
        > .owd-window__content {
          height: 100%;
          padding: 0;
        }
      }
    }

    &:not(&--no-content-spacing) {
      .owd-window__container {
        > .owd-window__content {
          padding: 14px;
        }
      }
    }

    &--focused {
      .owd-window__container {
        > .owd-window__nav {
          &__btn-group .btn {
            color: white;
          }
        }
      }
    }

    &--borderless {
      .owd-window__container {
        > .owd-window__nav {
          display: none;
        }
      }
    }

    &--maximized {
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      width: 100% !important;
      height: 100% !important;
      margin: 0 !important;
      z-index: 999;
      background: $windowBackground;

      @media (max-width: 768px) {
        left: auto !important;
      }
    }

    &--fullscreen {
      .owd-window__container {
        > .owd-window__content {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          right: 0 !important;
          width: 100% !important;
          height: 100% !important;
          margin: 0 !important;
          z-index: 999;
          background: $windowBackground;

          @media (max-width: 768px) {
            left: auto !important;
          }
        }
      }
    }
  }

  #app.is-mobile {
    .owd-window {
      max-width: 100%;
      max-height: 100%;
      top: 0 !important;
      left: auto !important;
      right: 0 !important;
    }
  }
</style>
