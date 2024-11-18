<template>
  <v-container>
    <AnalysisBoxes @addEquipment="addEquipment" />
    <EquipmentTable :equipments="equipmentData" />
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import EquipmentTable from '@/components/EquipmentTable.vue'
import AnalysisBoxes from '@/components/AnalysisBoxes.vue'
const equipmentData = ref([])
const addEquipment = (newEquipment) => {
  equipmentData.value.push(newEquipment)
}
</script>
