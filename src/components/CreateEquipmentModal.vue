<template>
<!--  <v-dialog v-model="isShowModal" max-width="425px" min-height="500px">-->
<!--    <div class="card">-->
<!--    <h1>Добавить оборудование</h1>-->
<!--    <form @submit.prevent="submitEquipmentData">-->
<!--      <div>-->
<!--        <label for="nameType">Наименование:</label>-->
<!--        <input v-model="equipmentData.nameType" id="nameType" type="text" required />-->
<!--      </div>-->
<!--      <div>-->
<!--        <label for="model"> Модель:</label>-->
<!--        <input v-model="equipmentData.model" id="model" type="text" required />-->
<!--      </div>-->
<!--      <div>-->
<!--        <label for="model"> Количество:</label>-->
<!--        <input v-model="equipmentData.count" id="count" type="text" required />-->
<!--      </div>-->
<!--      <div>-->
<!--        <v-select-->
<!--          class="select-size"-->
<!--          v-model="equipmentData.size"-->
<!--          :items="items"-->
<!--          label="Размер"-->
<!--        ></v-select>-->
<!--      </div>-->
<!--      <div>-->
<!--        <button class="submit-button" type="submit">Добавить</button>-->
<!--      </div>-->
<!--    </form>-->
<!--    </div>-->
<!--</v-dialog>-->


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
    alert('Please fill in all required fields.');
    return;
  }

  try {
    const payload = await axiosInstance.post('/api/Equipments', { ...equipmentData.value });
    // const payload = { ...equipmentData.value };
    emit('addEquipment', payload);
    emit('update:isShowModal', false);
    console.log('Response:', payload);
    alert('Equipment data submitted successfully!');
  } catch (error) {
    console.error('Error submitting equipment data:', error.response ? error.response.data : error.message);
    alert('Failed to submit equipment data.');
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
