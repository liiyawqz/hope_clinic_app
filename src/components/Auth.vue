<template>
  <div class="auth-container">
    <div v-if="mode === 'login'">
      <LoginForm @switchMode="switchMode" @authSuccess="handleAuthSuccess" />
    </div>
    <div v-else>
      <RegisterForm @switchMode="switchMode" @authSuccess="handleAuthSuccess" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LoginForm from './LoginForm.vue'
import RegisterForm from './RegisterForm.vue'

const mode = ref('login')

function switchMode(newMode) {
  mode.value = newMode
}

function handleAuthSuccess(token) {
  // Базара нет, сохраняем токен или что надо
  localStorage.setItem('token', token)
  // Тут можешь заредиректить на другую страницу, если надо
  console.log('Успех авторизации!', token)
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
