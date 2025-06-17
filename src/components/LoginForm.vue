<template>
  <form @submit.prevent="login">
    <h2>Вход</h2>
    <input v-model="username" placeholder="Имя пользователя" required />
    <input v-model="password" type="password" placeholder="Пароль" required />
    <button type="submit">Войти</button>
    <p @click="$emit('switchMode', 'register')" style="cursor:pointer; color:blue;">
       Регистрация
    </p>
  </form>
</template>
<style scoped>
input {
  color: black;
}
</style>
<script setup>
import { ref } from 'vue'
import axios from 'axios'

const username = ref('')
const password = ref('')

const baseUrl = import.meta.env.VITE_APP_API_URL

const emit = defineEmits(['authSuccess', 'switchMode'])

async function login() {
  try {
    const response = await axios.post(`${baseUrl}/api/Auth/login`, null, {
      params: {
        username: username.value,
        password: password.value
      }
    })
    emit('authSuccess', response.data.token)
  } catch (error) {
    console.log('Лажа на логине', error)
    alert('Ошибка авторизации')
  }
}
</script>
