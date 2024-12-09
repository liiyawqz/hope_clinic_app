<template>
  <div>
    <h1>Create Client</h1>
    <form @submit.prevent="submitClientData">
      <div>
        <label for="lastName">Last Name:</label>
        <input v-model="clientData.lastName" id="lastName" type="text" required />
      </div>
      <div>
        <label for="firstName">First Name:</label>
        <input v-model="clientData.firstName" id="firstName" type="text" required />
      </div>
      <div>
        <label for="middleName">Middle Name:</label>
        <input v-model="clientData.middleName" id="middleName" type="text" />
      </div>
      <div>
        <label for="passportId">Passport ID:</label>
        <input v-model.number="clientData.passportId" id="passportId" type="number" required />
      </div>
      <div>
        <label for="phoneNumber">Phone Number:</label>
        <input v-model="clientData.phoneNumber" id="phoneNumber" type="text" required />
      </div>
      <div>
        <label for="email">Email:</label>
        <input v-model="clientData.email" id="email" type="email" required />
      </div>
      <button type="submit">Submit</button>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import axiosInstance from "@/api";

// Модель данных клиента
const clientData = ref({
  lastName: '',
  firstName: '',
  middleName: '',
  passportId: null,
  phoneNumber: '',
  email: '',
});

// Функция для отправки данных
const submitClientData = async () => {
  try {
    const payload = await axiosInstance.post('/api/Clients', { ...clientData.value })
    console.log('Response:', payload.data);
    alert('Client data submitted successfully!');
  } catch (error) {
    console.error('Error submitting client data:', error);
    alert('Failed to submit client data.');
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
