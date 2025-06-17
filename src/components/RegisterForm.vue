<template>
  <form @submit.prevent="register">
    <h2>Регистрация</h2>
    <input v-model="username" placeholder="Имя пользователя" required />
    <input v-model="password" type="password" placeholder="Пароль" required />
    <button type="submit">Зарегистрироваться</button>
    <p @click="$emit('switchMode', 'login')" style="cursor:pointer; color:blue;">
      Уже есть аккаунт? Вход
    </p>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const username = ref('')
const password = ref('')

const baseUrl = import.meta.env.VITE_APP_API_URL

const emit = defineEmits(['authSuccess', 'switchMode'])

async function register() {
  try {
    const response = await axios.post(`${baseUrl}/api/Auth/register`, null, {
      params: {
        username: username.value,
        password: password.value
      }
    })
    emit('authSuccess', response.data.token)
  } catch (error) {
    console.log('Туфта на регистрации', error)
    alert('Ошибка регистрации')
  }
}
</script>
