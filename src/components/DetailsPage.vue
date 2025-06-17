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
        <tr>
          <td>{{ client.email }}</td>
          <td>{{ client.phoneNumber }}</td>
          <td>{{ client.passportId }}</td>
        </tr>
        </tbody>
      </v-table>

      <v-btn @click="dialog = true" class="mt-4" color="primary">Привязать оборудование</v-btn>

      <v-dialog v-model="dialog" max-width="500">
        <v-card>
          <v-card-title>Привязка оборудования</v-card-title>
          <v-card-text>
            <v-form ref="formRef" v-model="formValid">
              <v-select
                label="Оборудование"
                :items="equipments"
                v-model="formData.equipmentId"
                item-value="equipmentId"
                :item-title="item => `${item.subType} | ${item.size} | ${item.serialNum}`"
                :rules="[required]"
                clearable
              />

              <v-text-field
                label="Дата возврата"
                v-model="formData.returnDateAt"
                type="date"
                :rules="[required, dateNotInPast]"
              />

              <v-text-field
                label="Залог"
                v-model="formData.pledge"
                type="number"
                :rules="[required, nonNegative]"
              />
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
const baseUrl = import.meta.env.VITE_APP_API_URL

const dialog = ref(false)
const client = ref(null)
const equipments = ref([])

const formRef = ref(null)
const formValid = ref(false)

const formData = ref({
  clientId: Number(route.params.id),
  equipmentId: null,
  returnDateAt: new Date().toISOString().slice(0, 10),
  pledge: 0,
})

// Валидации
const required = value => !!value || 'Обязательное поле'
const dateNotInPast = value => {
  if (!value) return true
  const selected = new Date(value)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return selected >= today || 'Дата не может быть в прошлом'
}
const nonNegative = value => value >= 0 || 'Значение должно быть 0 или больше'

onMounted(async () => {
  const clientRes = await axios.get(`${baseUrl}/api/Clients/list`)
  client.value = clientRes.data.dataList.find(c => c.id === formData.value.clientId)

  const eqRes = await axios.get(`${baseUrl}/api/Equipments/list`)
  equipments.value = eqRes.data.dataListEquipment.filter(e => e.isAvailable)
})

const submit = async () => {
  const isValid = await formRef.value.validate()
  if (!isValid.valid) return

  await axios.post(`${baseUrl}/api/ClientEquipment`, formData.value)
  dialog.value = false
}
</script>
