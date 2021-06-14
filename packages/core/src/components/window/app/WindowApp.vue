<template>
  <Window
    v-show="window.storage.opened && !window.storage.minimized"
    :name="windowNameClass"
    :title="title || window.storage.title || window.config.titleWindow || window.config.title"
    :max-width="windowMaxWidth"
    :max-height="windowMaxHeight"
    :min-width="windowMinWidth"
    :min-height="windowMinHeight"
    :width="window.storage.size.width"
    :height="window.storage.size.height"
    :left="window.storage.position.x"
    :top="window.storage.position.y"
    :z-index="window.storage.position.z"
    :is-dense="typeof props.dense !== 'undefined' ? props.dense : window.config.theme.dense"
    :is-focused="window.storage.focused"
    :is-maximized="window.config.maximizable && window.storage.maximized"
    :is-resizable="window.config.resizable"
    :is-fullscreen="window.config.fullscreenable && window.storage.fullscreen"
    :is-borderless="window.config.borderless"
    :is-rounded="window.config.theme.rounded"
    :has-no-content-spacing="window.config.theme.noContentSpacing"
    :preserve-material="window.config.theme.preserveMaterial"
    @drag:start="onDragStart"
    @drag:end="onDragEnd"
    @resize:start="onResizeStart"
    @resize:end="onResizeEnd"
    @mousedown="onMouseDown"
    @toggleMaximize="onToggleMaximize"
  >
    <template v-slot:nav-prepend>
      <slot name="nav-prepend" />
    </template>

    <template v-slot:nav-append>
      <div class="ml-1">
        <v-btn
            v-if="typeof window.config.minimizable === 'undefined' || typeof window.config.minimizable === 'boolean' && window.config.minimizable"
            class="v-btn--essential btn-minimize" tile
            @click="onMinimize"
        >
          <v-icon>{{desktopOptions.Window.icons.minimize}}</v-icon>
        </v-btn>

        <v-btn
            v-if="window.config.maximizable"
            class="v-btn--essential btn-maximize" tile
            @click="onToggleMaximize"
        >
          <v-icon>{{desktopOptions.Window.icons.maximize}}</v-icon>
        </v-btn>

        <v-btn
            v-if="window.config.fullscreenable"
            class="v-btn--essential btn-fullscreen" tile
            @click="onToggleFullscreen"
        >
          <v-icon>{{desktopOptions.Window.icons.fullscreen}}</v-icon>
        </v-btn>

        <v-btn
            class="v-btn--essential btn-close" tile
            @click.stop="onClose"
        >
          <v-icon>{{desktopOptions.Window.icons.close}}</v-icon>
        </v-btn>
      </div>

      <slot name="nav-append" />
    </template>

    <template v-slot:append-outer>
      <slot name="outer-append" />
    </template>

    <slot />

  </Window>
</template>

<script setup>
import {computed, ref, watch, inject, onMounted, onUnmounted, defineProps, defineEmit} from 'vue'
import {useStore} from 'vuex'
import kebabCase from '@owd-client/core/src/libraries/kebab-case/index'
import Window from '../Window.vue'

const props = defineProps({
  title: {
    type: String
  },
  dense: {
    type: Boolean,
    default: undefined
  },
  window: Object
})

const emit = defineEmit([
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
])

const store = useStore()
const desktopOptions = inject('desktopOptions')

const resizing = ref(false)
const dragging = ref(false)

// window name class
const windowNameClass = computed(() => {
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