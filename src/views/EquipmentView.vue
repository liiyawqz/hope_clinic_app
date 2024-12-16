<template>
  <v-container>
    <AnalysisBoxes @addEquipment="addEquipment" />
    <EquipmentTable :equipments="equipmentData" />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import EquipmentTable from '@/components/EquipmentTable.vue'
import AnalysisBoxes from '@/components/AnalysisBoxes.vue'
const baseUrl = import.meta.env.VITE_APP_API_URL
const equipmentData = ref([])
const fetchEquipments = async () => {
  try {
    const response = await axios.get('/api/equipments') // Ваш эндпоинт
    equipmentData.value = response.data
  } catch (error) {
    console.error('Ошибка при загрузке данных оборудования:', error)
  }
}
const addEquipment = async (newEquipment) => {
  try {
    const response = await axios.post('/api/equipments', newEquipment)
    equipmentData.value.push(response.data)
  } catch (error) {
    console.error('Ошибка при добавлении оборудования:', error)
  }
}

onMounted(() => {
  fetchEquipments()
})
</script>

<style scoped>
.v-container {
  background-color: #F9FAFB;
  padding: 20px;
}
</style>
