<template>
  <v-container fluid>
    <v-row align="center" justify="center">
      <v-col cols="8" sm="8" md="3">
        <v-card class="v-card">
          <v-card-title class="text-center">Авторизация</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleLogin" v-model="form">
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                required
                class="v-text-field"
              ></v-text-field>
              <v-text-field
                v-model="password"
                label="Пароль"
                type="password"
                required
              ></v-text-field>
              <v-btn
                :loading="loading"
                type="submit"
                color="primary"
                block
                class="mt-2"
              >
                Войти
              </v-btn>
              <v-alert v-if="error" type="error" class="mt-3" border="start" prominent>
                {{ error }}
              </v-alert>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useTheme } from 'vuetify';
import { login } from '@/services/authService';

const theme = useTheme();
const router = useRouter();

onMounted(() => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  theme.global.name = savedTheme;
});

const email = ref('');
const password = ref('');
const error = ref('');
const loading = ref(false);
const form = ref(false);

async function handleLogin() {
  try {
    loading.value = true;
    error.value = '';
    console.log('Попытка входа:', { email: email.value, password: password.value });
    await login(email.value, password.value);
    console.log('Успешный вход, редирект на /');
    router.push('/');
  } catch (err) {
    error.value = err.message || 'Ошибка входа. Проверьте данные.';
    console.error('Ошибка входа:', err);
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.v-card {
  background-color: var(--background-color);
  color: var(--text-color);
}
.v-container {
  background-color: var(--background-color);
  color: var(--text-color);
}
.v-text-field {
  background-color: var(--background-color);
  color: var(--text-color);
}
</style>
