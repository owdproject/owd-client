<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup>
import { onBeforeMount } from 'vue'
import { useRoute, useRouter } from 'vue-router';

const route = useRoute()
const router = useRouter()

onBeforeMount(() => {
  if (!route.name) {
    router.push({ name: 'index' })
  }
})
</script>