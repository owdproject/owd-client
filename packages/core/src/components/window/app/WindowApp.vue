<template>
  <Window
      v-show="!window.storage.minimized"
      :name="windowNameClass"
      :title="title || window.storage.title || window.config.titleWindow || window.config.title"
      :max-width="windowMaxWidth"
      :max-height="windowMaxHeight"
      :min-width="windowMinWidth"
      :min-height="windowMinHeight"
      :width="window.config.resizable ? window.storage.size.width : window.config.size.width"
      :height="window.config.resizable ? window.storage.size.height : window.config.size.height"
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
      :has-nav-title="window.config.theme.nav.title"
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
      <owd-btn
          v-if="typeof window.config.minimizable === 'undefined' || typeof window.config.minimizable === 'boolean' && window.config.minimizable"
          class="owd-btn--essential owd-btn-minimize"
          @click="onMinimize"
      >
        <owd-icon :name="desktopOptions.Window.icons.minimize" />
      </owd-btn>

      <owd-btn
          v-if="window.config.maximizable"
          class="owd-btn--essential owd-btn-maximize"
          @click="onToggleMaximize"
      >
        <owd-icon :name="desktopOptions.Window.icons.maximize" />
      </owd-btn>

      <owd-btn
          v-if="window.config.fullscreenable"
          class="owd-btn--essential owd-btn-fullscreen"
          @click="onToggleFullscreen"
      >
        <owd-icon :name="desktopOptions.Window.icons.fullscreen" />
      </owd-btn>

      <owd-btn
          class="owd-btn--essential owd-btn-close"
          @click.stop="onClose"
      >
        <owd-icon :name="desktopOptions.Window.icons.close" />
      </owd-btn>

      <slot name="nav-append" />
    </template>

    <template v-slot:append-outer>
      <slot name="outer-append" />
    </template>

    <slot />

  </Window>
</template>

<script setup>
import {computed, ref, watch, inject, onMounted, onUnmounted} from 'vue'
import {useStore} from 'vuex'
import {kebabCase} from "../../../helpers/helperStrings";

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

const emit = defineEmits([
  'mount',
  'unmount',
  'blur',
  'focus',
  'minimize',
  'restore',
  'maximize',
  'unmaximize',
  'resize:start',
  'resize:move',
  'resize:end',
  'drag:start',
  'drag:move',
  'drag:end'
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
  props.window.minimize()
}

/**
 * Window maximize event
 */
function onToggleMaximize() {
  if (!props.window.config.maximizable) {
    return false
  }

  if (props.window.storage.maximized) {
    props.window.maximize(false)
  } else {
    props.window.maximize(true)
  }
}

/**
 * Window fullscreen event
 */
function onToggleFullscreen() {
  if (!props.window.config.fullscreenable) {
    return false
  }

  if (props.window.storage.fullscreen) {
    props.window.fullscreen(false)
  } else {
    props.window.fullscreen(true)
  }
}

/**
 * Window close event
 */
function onClose() {
  props.window.destroy()
}

/**
 * Window focus event
 */
function onFocus() {
  props.window.focus()
}

/**
 * Window mousedown event
 */
function onMouseDown(e) {
  if (!e.target.closest('.owd-window__nav__btn-group')) {
    props.window.focus()
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

  props.window.setSize({width: data.width, height: data.height})
  props.window.setPosition({x: data.left, y: data.top, z: props.window.storage.position.z})

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
    props.window.setPosition({x: data.left, y: data.top, z: props.window.storage.position.z})
  }
}

onMounted(() => {
  watch(
      () => props.window.storage.focused,
      (focused) => emit(focused ? 'focus' : 'blur')
  )

  watch(
      () => props.window.storage.minimized,
      (minimized) => emit(minimized ? 'minimize' : 'restore')
  )

  watch(
      () => props.window.storage.maximized,
      (maximized) => emit(maximized ? 'maximize' : 'unmaximize')
  )

  props.window.mount()

  // emit event to moduleApp window
  emit('mount')
})

onUnmounted(async () => {
  // emit event to moduleApp window
  await emit('unmount')
})

watch(() => props.window.storage, () => props.window.save(), {deep: true})
</script>