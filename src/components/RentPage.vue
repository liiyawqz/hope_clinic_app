<template>
    <v-container class="container">
      <v-data-table
        class="table"
        :headers="headers"
        :items="filteredItems"
        item-value="id"
        :items-per-page="10"
        :loading="loading"
        loading-text="Загрузка данных..."
      >
        <template #item.factReturn="{ item }">
    <span :style="{ color: item.factReturn === 'не сдано' ? 'gray' : (item.factReturn !== item.returnDateAt ? 'red' : '') }">
      {{ item.factReturn }}
    </span>
        </template>
      </v-data-table>
    </v-container>
</template>


<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { format } from 'date-fns'

const baseUrl = import.meta.env.VITE_APP_API_URL;
const search = ref('')
const rawItems = ref([])
const loading = ref(true)

const headers = [
  { title: 'ФИО', key: 'fullName' },
  { title: 'Номер', key: 'phoneNumber' },
  { title: 'Оборудование', key: 'typeName' },
  { title: 'Модель', key: 'subType' },
  { title: 'Размер', key: 'size' },
  { title: 'Дата аренды', key: 'dateRentAt' },
  { title: 'Предварительная дата возврата', key: 'returnDateAt' },
  { title: 'Фактическая дата возврата', key: 'factReturn' },
  { title: 'Залог', key: 'pledge' },
]

const fetchData = async () => {
  try {
    loading.value = true
    const response = await axios.get(`${baseUrl}/api/ClientEquipment/list`)
    const list = response.data?.result?.dataList || []

    rawItems.value = list.map(item => {
      return {
        id: item.id,
        fullName: `${item.lastName} ${item.firstName} ${item.middleName}`,
        phoneNumber: item.phoneNumber,
        typeName: item.typeName,
        subType: item.subType,
        size: item.size,
        dateRentAt: format(new Date(item.dataRentAt), 'dd.MM.yyyy'),
        returnDateAt: format(new Date(item.returnDateAt), 'dd.MM.yyyy'),
        factReturn: item.isReturned
          ? format(new Date(item.returnDateAt), 'dd.MM.yyyy')
          : 'не сдано',
        pledge: `${item.pledge} сом`,
      }
    })
  } catch (error) {
    console.error('Ошибка загрузки:', error)
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)

const filteredItems = computed(() => {
  if (!search.value) return rawItems.value
  return rawItems.value.filter(item =>
    Object.values(item).some(val =>
      String(val).toLowerCase().includes(search.value.toLowerCase())
    )
  )
})
</script>


<style>
.container {
  background-color: var(--background-color);
  color: var(--text-color);
  margin-left: 10px;

}
.mb-4{
  margin-bottom: 50px !important;
}
.table {
  font-size: 14px;
  margin-top: 10px;
  min-width: 1350px;
  background-color: var(--card-color);
  color: var(--text-color);
  border-radius: 20px;

}
:deep(.v-data-table th:hover) {
  color: #1861FF !important;
}

</style>
