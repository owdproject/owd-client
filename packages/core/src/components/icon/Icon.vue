<template>
  <div :class="`owd-icon ${name}`" :style="style" />
</template>

<script setup>
const props = defineProps({
  name: String,
  size: [Number, String]
})

const style = {
  'font-size': props.size + 'px'
}
</script>

<style scoped lang="scss">
.owd-icon {

}
</style>