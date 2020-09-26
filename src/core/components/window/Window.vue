<template>
  <vue-resizable
    v-show="!window.storage.closed && !window.storage.minimized"
    :data-window="window.name"
    :max-width="windowMaxWidth"
    :max-height="windowMaxHeight"
    :min-width="windowMinWidth"
    :min-height="windowMinHeight"
    :width="window.storage.width"
    :height="window.storage.height"
    :left="window.storage.x"
    :top="window.storage.y"
    :style="{
      zIndex: window.storage.z
    }"
    fit-parent
    drag-selector=".window-nav .window-nav-title"
    @drag:start="onDragStart"
    @drag:move="onDragMove"
    @drag:end="onDragEnd"
    @resize:start="onResizeStart"
    @resize:end="onResizeEnd"
    :id="windowIdName"
    :class="[
      'window', {
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
    <div class="window-container" @mousedown="onActivated">
      <WindowNav :title="title" @invertMaximize="onToggleMaximize">
        <a class="btn" @click="onMinimize" v-if="typeof window.config.minimizable === 'undefined' || typeof window.config.minimizable === 'boolean' && window.config.minimizable">
          <v-icon>mdi-window-minimize</v-icon>
        </a>
        <a class="btn" @click="onToggleMaximize" v-if="window.config.maximizable">
          <v-icon>mdi-window-maximize</v-icon>
        </a>
        <a class="btn" :href="window.externalUrl" target="_blank" v-if="window.externalUrl">
          <v-icon>mdi-open-in-new</v-icon>
        </a>
        <a class="btn" @click="onClose">
          <v-icon>mdi-window-close</v-icon>
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
  import VueResizable from 'vue-resizable'
  import WindowNav from "./WindowNav";
  import WindowContent from "./WindowContent";

  export default {
    name: "Window",
    components: {
      WindowContent,
      WindowNav,
      VueResizable
    },
    props: {
      title: String,
      window: Object,
    },
    data() {
      return {
        resizing: false,
        dragging: false
      }
    },
    computed: {
      windowIdName() {
        const kebabCase = require('kebab-case');
        const kebabCaseName = kebabCase(this.window.name);

        return kebabCaseName.substr(1, kebabCaseName.length+1);
      },
      windowMaxWidth() {
        if (!this.window.config.resizable) {
          return this.window.config.width;
        }

        if (this.window.storage.fullscreen) {
          return window.innerWidth;
        }

        if (this.window.config.maxWidth) {
          return this.window.config.maxWidth;
        }

        return undefined;
      },
      windowMaxHeight() {
        if (!this.window.config.resizable) {
          return this.window.config.height;
        }

        if (this.window.storage.fullscreen) {
          return window.innerHeight;
        }

        if (this.window.config.maxHeight) {
          return this.window.config.maxHeight;
        }

        return undefined;
      },
      windowMinWidth() {
        if (this.window.config.minWidth) {
          return this.window.config.minWidth;
        }

        return this.window.config.width;
      },
      windowMinHeight() {
        if (this.window.config.minHeight) {
          return this.window.config.minHeight;
        }

        return this.window.config.height;
      }
    },
    watch: {
      'window.storage': {
        handler: function () {
          clearTimeout(this.saveToLocalstorage);

          this.saveToLocalstorage = setTimeout(() => {
            this.$store.dispatch('core/windows/saveWindowsStorage');
          }, 500);
        },
        deep: true
      }
    },
    created() {
      const self = this;

      if (this.window.config.autoCloseBeforePageUnload) {
        window.addEventListener(
          'beforeunload',
          () => {
            self.$store.dispatch('core/windows/windowClose', self.window);
            self.$store.dispatch('core/windows/saveWindowsStorage');
          }
        )
      }

      if (this.window.config.autoDestroyBeforePageUnload) {
        window.addEventListener(
          'beforeunload',
          () => {
            self.$store.dispatch('core/windows/windowDestroy', self.window);
            self.$store.dispatch('core/windows/saveWindowsStorage');
          }
        )
      }
    },
    mounted() {
      const self = this;

      // when press ESC and a window is in full-screen mode
      window.addEventListener('keydown', function(e) {
        if (e.keyCode === 27) {
          self.$store.dispatch('core/windows/windowUnmaximizeAll');
        }
      });
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
       * Window open new link
       */
      onOpenLink: function (url) {
        window.open(url, "_blank");
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
        const self = this;

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
        this.$emit('resize:start', data);

        this.resizing = true;
      },

      /**
       * Window end resize event
       */
      onResizeEnd: function(data) {
        // emit to parent component
        this.$emit('resize:end', data);

        this.window.storage.x = data.left;
        this.window.storage.y = data.top;
        this.window.storage.width = data.width;
        this.window.storage.height = data.height;

        this.resizing = false;
      },

      /**
       * Window start drag event
       */
      onDragStart: function(data) {
        // emit to parent component
        this.$emit('drag:start', data);

        this.dragging = true;
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

        if ((data.top + this.window.storage.height) >= window.innerHeight - 15) {
          forceNoMargin = true
          data.top = window.innerHeight - this.window.storage.height
        }

        if ((data.left + this.window.storage.width) >= window.innerWidth - 15) {
          forceNoMargin = true
          data.left = window.innerWidth - this.window.storage.width
        }

        if (forceNoMargin) {
          this.$store.dispatch('core/windows/windowUpdatePosition', {
            data: this.window,
            x: data.left,
            y: data.top,
            width: data.width,
            height: data.height
          })
        }
      },


      /**
       * Window stop drag event
       * @param data
       */
      onDragEnd: function (data) {
        // emit to parent component
        this.$emit('drag:end', data);

        this.dragging = false;

        if (
          this.window.storage.x !== data.left ||
          this.window.storage.y !== data.top ||
          this.window.storage.width !== data.width ||
          this.window.storage.height !== data.height
        ) {
          if (data.top <= 15) data.top = 0
          if (data.left <= 15) data.left = 0

          this.$store.dispatch('core/windows/windowUpdatePosition', {
            data: this.window,
            x: data.left,
            y: data.top,
            width: data.width,
            height: data.height
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
    background: rgb(17, 17, 17);
    box-shadow: 0 0 0 1px rgba(21, 21, 21, 0.5);
    border-radius: 2px;
    color: #b4b4b4;
    overflow: hidden;
    user-select: none;
    pointer-events: initial;

    .window-container {
      box-shadow: inset 0 0 0 1px #292929;
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
        padding: 15px !important;
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
        margin: 0 12px 12px 12px;
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
