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

<script setup>
import {computed, ref, watch, onMounted, onUnmounted, defineEmit} from 'vue'
import {useStore} from 'vuex'
import VueResizable from 'vue-resizable/src'
import WindowNav from './nav/WindowNav'
import WindowNavButtonCommon from "./nav/WindowNavButtonCommon";

const props = defineProps({
  title: {
    type: String
  },
  dense: {
    type: Boolean,
    default: true
  },
  window: Object
})

const emit = defineEmit([
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
])

const store = useStore()

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

/**
 * Window minimize event
 */
function onMinimize() {
  store.dispatch('core/window/windowMinimize', props.window)
}

/**
 * Window maximize event
 */
function onToggleMaximize() {
  if (!props.window.config.maximizable) {
    return false
  }

  store.dispatch(
      props.window.storage.maximized ? 'core/window/windowUnmaximize' : 'core/window/windowMaximize',
      props.window
  )
}

/**
 * Window fullscreen event
 */
function onToggleFullscreen() {
  if (!props.window.config.fullscreenable) {
    return false
  }

  store.dispatch(
      props.window.storage.fullscreen ? 'core/window/windowUnfullscreen' : 'core/window/windowFullscreen',
      props.window
  )
}

/**
 * Window close event
 */
function onClose() {
  store.dispatch('core/window/windowDestroy', props.window)
}

/**
 * Window focus event
 */
function onFocus() {
  // prevent focus when minimizing or closing
  setTimeout(() => store.dispatch('core/window/windowFocus', props.window), 20)
}

/**
 * Window mousedown event
 */
function onMouseDown(e) {
  if (!e.target.closest('.owd-window__nav__btn-group')) {
    onFocus()
  }
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
 * Window end resize event
 */
function onResizeEnd(data) {
  // emit to parent component
  emit('resize:end', data)

  store.dispatch('core/window/windowUpdateSize', {
    window: props.window,
    size: {width: data.width, height: data.height}
  })

  store.dispatch('core/window/windowSetPosition', {
    window: props.window,
    position: {x: data.left, y: data.top, z: props.window.storage.position.z}
  })

  resizing.value = false
}

/**
 * Window start drag event
 */
function onDragStart(data) {
  // emit to parent component
  emit('drag:start', data)

  dragging.value = true
}

/**
 * Window stop drag event
 * @param data
 */
function onDragEnd(data) {
  // emit to parent component
  emit('drag:end', data)

  dragging.value = false

  if (
      props.window.storage.position.x !== data.left ||
      props.window.storage.position.y !== data.top ||
      props.window.storage.size.width !== data.width ||
      props.window.storage.size.height !== data.height
  ) {
    store.dispatch('core/window/windowSetPosition', {
      window: props.window,
      position: {x: data.left, y: data.top, z: props.window.storage.position.z}
    })
  }
}

async function autoCloseWindowBeforePageUnload() {
  await store.dispatch('core/window/windowClose', props.window)
  await store.dispatch('core/window/saveWindowsStorage')
}

async function autoDestroyWindowBeforePageUnload() {
  await store.dispatch('core/window/windowDestroy', props.window)
  await store.dispatch('core/window/saveWindowsStorage')
}

onMounted(() => {
  if (props.window.config.autoCloseBeforePageUnload) {
    window.addEventListener('beforeunload', () => autoCloseWindowBeforePageUnload)
  }
  if (props.window.config.autoDestroyBeforePageUnload) {
    window.addEventListener('beforeunload', () => autoDestroyWindowBeforePageUnload)
  }
})

onUnmounted(() => {
  if (props.window.config.autoCloseBeforePageUnload) {
    window.removeEventListener('beforeunload', () => autoCloseWindowBeforePageUnload)
  }
  if (props.window.config.autoDestroyBeforePageUnload) {
    window.removeEventListener('beforeunload', () => autoDestroyWindowBeforePageUnload)
  }
})

watch(
    () => props.window.storage.focused,
    (focused) => emit(focused ? 'focus' : 'blur')
)

watch(
    () => props.window.storage.opened,
    (opened) => emit(opened ? 'open' : 'close')
)

watch(
    () => props.window.storage.minimized,
    (minimized) => emit(minimized ? 'minimize' : 'restore')
)

watch(
    () => props.window.storage.maximized,
    (maximized) => emit(maximized ? 'maximize' : 'unmaximize')
)

let timeoutSaveToLocalStorage = null

watch(
    () => props.window.storage,
    (maximized) => {
      clearTimeout(timeoutSaveToLocalStorage)
      timeoutSaveToLocalStorage = setTimeout(() => store.dispatch('core/window/saveWindowsStorage'), 500)
    },
    {deep: true}
)
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
