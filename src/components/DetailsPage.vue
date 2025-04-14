<template>
  <v-card v-if="client">
    <v-card-title>
      {{ client.lastName }} {{ client.firstName }} {{ client.middleName }}
    </v-card-title>
    <v-card-text>
      <v-table>
        <thead>
        <tr>
          <th>Email</th>
          <th>Телефон</th>
          <th>Паспорт</th>
        </tr>
        </thead>
        <tbody>
<!--        Саламалекум-->
        <tr>
          <td>{{ client.email }}</td>
          <td>{{ client.phoneNumber }}</td>
          <td>{{ client.passportId }}</td>
        </tr>
        </tbody>
      </v-table>
      <v-btn @click="dialog = true">Привязать оборудование</v-btn>

      <v-dialog v-model="dialog" max-width="500">
        <v-card>
          <v-card-title>Привязка оборудования</v-card-title>
          <v-card-text>
            <v-form ref="form">
              <v-select label="Модель" :items="models" v-model="formData.model" />
              <v-select label="Размер" :items="sizes" v-model="formData.size" />
              <v-select label="Наименование" :items="names" v-model="formData.name" />
              <v-text-field label="Дата возврата" v-model="formData.returnDate" type="date" />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="submit">Сохранить</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const dialog = ref(false)

const baseUrl = import.meta.env.VITE_APP_API_URL

const client = ref(null)

const formData = ref({
  model: null,
  size: null,
  name: null,
  returnDate: new Date().toISOString().slice(0, 10),
})

const models = ['Model A', 'Model B']
const sizes = ['Small', 'Medium', 'Large']
const names = ['Название 1', 'Название 2']

const fetchClient = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/Clients/list`)
    const dataList = response.data.dataList
    const foundClient = dataList.find(item => item.id === Number(route.params.id))

    if (foundClient) {
      client.value = foundClient
    } else {
      console.warn('Клиент не найден')
    }
  } catch (error) {
    console.error('Ошибка загрузки клиента:', error)
  }
}

const submit = async () => {
  await axios.post(`/api/item/${route.params.id}/attach`, formData.value)
  dialog.value = false
}

onMounted(() => {
  fetchClient()
})
</script>
