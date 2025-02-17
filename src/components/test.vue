<template>
  <div>
    <h1>Create equipment</h1>
    <form @submit.prevent="submitEquipmentData">
      <div>
        <label for="nameType">Name:</label>
        <input v-model="equipmentData.nameType" id="nameType" type="text" required />
      </div>
      <div>
        <label for="model"> model:</label>
        <input v-model="equipmentData.model" id="model" type="text" required />
      </div>
      <div>
        <label for="model"> Count:</label>
        <input v-model="equipmentData.count" id="count" type="text" required />
      </div>
      <div>
        <v-select
          v-model="equipmentData.size"
          :items="items"
          label="Size"
        ></v-select>
      </div>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { StatusEnum } from '@/utils/statusEnum'
import { ref } from 'vue';
import axiosInstance from "@/api";

const equipmentData = ref({
  nameType: '',
  model: '',
  count: null,
  size: null,
});

const items = [
  {
    title: 'S',
    value : StatusEnum.S,
  },
  {
    title: 'M',
    value : StatusEnum.M
  },
  {
    title: 'L',
    value : StatusEnum.L
  },
  {
    title: 'XL',
    value : StatusEnum.XL
  }
]
const submitEquipmentData = async () => {
  console.log('Submitting equipment data:', equipmentData.value);
  if (!equipmentData.value.nameType || !equipmentData.value.model) {
    alert('Please fill in all required fields.');
    return;
  }
  try {
    const payload = await axiosInstance.post('/api/Equipments', { ...equipmentData.value });
    console.log(payload)
    console.log('Response:', payload.data);
    alert('Equipment data submitted successfully!');
  } catch (error) {
    console.error('Error submitting equipment data:', error.response ? error.response.data : error.message);
    alert('Failed to submit equipment data.');
  }
};

</script>

<style scoped>
form {
  max-width: 400px;
  margin: auto;
}

form div {
  margin-bottom: 15px;
}

label {
  display: block;
  font-weight: bold;
  margin-bottom: 5px;
}

input {
  width: 100%;
  padding: 8px;
  box-sizing: border-box;
}

button {
  display: block;
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}
</style>
