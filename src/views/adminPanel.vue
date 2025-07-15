<template>
  <v-app-bar app>
    <v-toolbar-title v-if="isAdmin">Админка</v-toolbar-title>
    <th><H1>Heeelo</H1></th>
  </v-app-bar>
</template>

<script setup>
import { ref, onMounted } from 'vue'
/*import { getUserRoleFromCookie } from '@/services/authService'

const isAdmin = ref(false)

onMounted(() => {
  const role = getUserRoleFromCookie()
  isAdmin.value = role === 'Admin'
})*/
</script>
