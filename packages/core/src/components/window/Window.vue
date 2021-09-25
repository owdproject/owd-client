<template>
  <vue-resizable
      :max-width="props.maxWidth"
      :max-height="props.maxHeight"
      :min-width="props.minWidth"
      :min-height="props.minHeight"
      :width="props.width"
      :height="props.height"
      :top="props.top"
      :left="props.left"
      :style="{
        'z-index': props.zIndex
      }"
      fit-parent
      drag-selector=".owd-window__nav .owd-window__nav__draggable"
      @drag:start="onDragStart"
      @drag:end="onDragEnd"
      @resize:start="onResizeStart"
      @resize:end="onResizeEnd"
      @resize:move="onResizeMove"
      :class="[
      props.name,
      'owd-window',
      {
        'owd-window--dense': props.isDense,
        'owd-window--focused': props.isFocused,
        'owd-window--maximized': props.isMaximized,
        'owd-window--dragging': dragging,
        'owd-window--resizing': resizing,
        'owd-window--no-resizable': !props.isResizable,
        'owd-window--fullscreen': props.isFullscreen,
        'owd-window--borderless': props.isBorderless,
        'owd-window--rounded': props.isRounded,
        'owd-window--no-content-spacing': props.hasNoContentSpacing,
        'owd-window--preserve-material': props.preserveMaterial
      }
    ]"
  >
    <div class="owd-window__container">

      <WindowNav :title="props.title" @toggleMaximize="emit('toggle-maximize')">
        <template v-slot:nav-prepend>
          <slot name="nav-prepend" />
        </template>

        <template v-slot:nav-append>
          <slot name="nav-append" />
        </template>
      </WindowNav>

      <div class="owd-window__content">
        <slot />
      </div>

      <slot name="outer-append" />
      
    </div>
  </vue-resizable>
</template>

<script setup>
import {ref} from "vue";
import VueResizable from 'vue-resizable/src/components/vue-resizable.vue'
import WindowNav from './nav/WindowNav.vue'

const props = defineProps({
  name: {
    type: String,
    default: 'unnamed'
  },
  title: {
    type: String,
    default: 'Window'
  },
  maxWidth: {
    type: Number
  },
  maxHeight: {
    type: Number
  },
  minWidth: {
    type: Number
  },
  minHeight: {
    type: Number
  },
  width: {
    type: Number
  },
  height: {
    type: Number
  },
  top: {
    type: Number
  },
  left: {
    type: Number
  },
  zIndex: {
    type: Number
  },
  isDense: {
    type: Boolean,
    default: true
  },
  isFocused: {
    type: Boolean
  },
  isResizable: {
    type: Boolean
  },
  isMaximized: {
    type: Boolean
  },
  isFullscreen: {
    type: Boolean
  },
  isBorderless: {
    type: Boolean
  },
  isRounded: {
    type: Boolean
  },
  hasNoContentSpacing: {
    type: Boolean
  },
  preserveMaterial: {
    type: Boolean
  },
})

const emit = defineEmits([
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
  'unmaximize',
  'toggle-maximize'
])

const resizing = ref(false)
const dragging = ref(false)

/**
 * Window start drag event
 */
function onDragStart(data) {
  // emit to parent component
  emit('drag:start', data)

  dragging.value = true
}

/**
 * Window move drag event
 * @param data
 */
function onDragMove(data) {
  // emit to parent component
  emit('drag:move', data)
}

/**
 * Window stop drag event
 * @param data
 */
function onDragEnd(data) {
  // emit to parent component
  emit('drag:end', data)

  dragging.value = false
}

/**
 * Window start resize event
 */
function onResizeStart(data) {
  // emit to parent component
  emit('resize:start', data)

  resizing.value = true
}

/**
 * Window move resize event
 */
function onResizeMove(data) {
  // emit to parent component
  emit('resize:move', data)
}

/**
 * Window end resize event
 */
function onResizeEnd(data) {
  // emit to parent component
  emit('resize:end', data)

  resizing.value = false
}
</script>

<style lang="scss">
.owd-window {
  background: $owd-window-background;
  border-width: $owd-window-border-width;
  border-style: $owd-window-border-style;
  border-color: $owd-window-border-color-inactive;
  box-shadow: $owd-window-box-shadow-inactive;
  border-radius: $owd-window-border-radius;
  color: $owd-window-text;
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

  & &__container {
    display: grid;
    grid-template-rows: 100%;
    height: 100%;
    box-shadow: $owd-window-container-box-shadow;
  }

  & &__content {
    position: relative;
    height: 100%;
    padding: $owd-window-content-padding;
    background-color: $owd-window-content-background;
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
    .owd-window__content {
      height: 100%;
      padding: $owd-window-content-padding-no-spacing;
    }
  }

  &--focused {
    box-shadow: $owd-window-box-shadow;
    border-color: $owd-window-border-color;
  }

  &--borderless {
    .owd-window__nav {
      display: none;
    }
  }

  &:not(&--borderless) {
    .owd-window__container {
      grid-template-rows: $owd-window-nav-height calc(100% - #{$owd-window-nav-height});
    }

    &.owd-window--dense {
      .owd-window__container {
        grid-template-rows: $owd-window-nav-height-dense calc(100% - #{$owd-window-nav-height-dense});
      }

      .owd-window__nav {
        height: $owd-window-nav-height-dense;
        line-height: $owd-window-nav-height-dense;
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
    background: $owd-window-background;

    @media (max-width: 768px) {
      left: auto !important;
    }
  }

  &--fullscreen {
    .owd-window__content {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      width: 100% !important;
      height: 100% !important;
      margin: 0 !important;
      z-index: 999;
      background: $owd-window-background;

      @media (max-width: 768px) {
        left: auto !important;
      }
    }
  }
}
</style>