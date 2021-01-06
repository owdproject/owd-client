<template>
  <router-view />
</template>

<script>
export default {
  name: 'App',
  beforeMount() {
    // redirect to homepage on 404
    if (!this.$route.name) {
      this.$router.push({ name: 'index' })
    }
  }
}
</script>