<template>
  <v-dialog v-model="isShowModal" max-width="425px" class="bg-white">
    <v-card class="pa-6 rounded-x bg-white">
      <v-card-title class="text-h5 text-center">Добавить оборудование</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submitEquipmentData">
          <v-text-field v-model="equipmentData.nameType" label="Наименование" required></v-text-field>
          <v-text-field v-model="equipmentData.model" label="Модель" required></v-text-field>
          <v-text-field v-model="equipmentData.count" label="Количество" type="number" required></v-text-field>
          <v-select v-model="equipmentData.size" :items="items" item-title="title" item-value="value" label="Размер"></v-select>
        </v-form>
      </v-card-text>
      <v-card-actions class="justify-end">
        <v-btn color="grey" @click="isShowModal = false">Отмена</v-btn>
        <v-btn color="blue-darken-1" @click="submitEquipmentData">Добавить</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script setup>
import { StatusEnum } from '@/utils/statusEnum'
import {computed, ref} from 'vue';
import axiosInstance from "@/api";

const props = defineProps({
  isShowModal: {
    type: Boolean,
    default: false
  }
});

const isShowModal = computed({
  get: () => props.isShowModal,
  set: (value) => emit('update:isShowModal', value)
});
const equipmentData = ref({
  nameType: '',
  model: '',
  count: null,
  size: null,
});

const items = [
  {title: 'S', value : StatusEnum.S,},
  {title: 'M', value : StatusEnum.M},
  {title: 'L', value : StatusEnum.L},
  {title: 'XL', value : StatusEnum.XL}
]
const emit = defineEmits(['update:isShowModal', 'addEquipment']);

const submitEquipmentData = async () => {
  console.log('Submitting equipment data:', equipmentData.value);

  if (!equipmentData.value.nameType || !equipmentData.value.model) {
    alert('Пожалуйста, заполните все обязательные поля.');
    return;
  }

  try {
    const payload = await axiosInstance.post('/api/Equipments', { ...equipmentData.value });
    // const payload = { ...equipmentData.value };
    emit('addEquipment', payload);
    emit('update:isShowModal', false);
    console.log('Response:', payload);
    alert('Оборудование успешно добавлено!');
  } catch (error) {
    console.error('Error submitting equipment data:', error.response ? error.response.data : error.message);
    alert('Не удалось добавить оборудование.');
  }
};
</script>
<style scoped>
v-dialog {
  padding: 24px;
  border-radius: 12px;
}

h1 {
  font-size: 23px;
  font-weight: bold;
  margin-bottom: 16px;
  margin-left: 38px;
  margin-top: 25px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 22px;
  max-width: 350px;
  margin: 0 auto;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #dcdcdc;
  border-radius: 6px;
  font-size: 14px;
  background-color: #F1F5F9;
}
.submit-button {
  background-color: #1861FF;
  color: white;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  margin-bottom: 25px;
  margin-left: 255px;
}
.card{
  border: 1px solid #dcdcdc;
  border-radius: 30px;
}
.select-size{
  background-color: #F1F5F9;
}
</style>
