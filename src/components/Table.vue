<template>
  <div>
    <v-table>
      <thead>
      <tr>
        <th class="text-left">Name</th>
        <th class="text-left">Calories</th>
        <th class="text-left">Actions</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in testData" :key="item.id">
        <td>{{ item.name }}</td>
        <td>{{ item.calories }}</td>
        <td>
          <button @click="editItem(item)">Edit</button>
        </td>
      </tr>
      </tbody>
    </v-table>

    <form @submit.prevent="submitForm">
      <input v-model="formData.name" placeholder="Name" required />
      <input v-model="formData.calories" placeholder="Calories" type="number" required />
      <button type="submit">Save</button>
    </form>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import axios from 'axios';

// Данные для таблицы
const testData = reactive([]);

// Форма для добавления/редактирования
const formData = reactive({
  id: null,
  name: '',
  calories: null,
});

// Получение данных с сервера
async function fetchData() {
  try {
    const response = await axios.get('http://localhost:5000/api/data');
    testData.splice(0, testData.length, ...response.data);
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Редактирование элемента
function editItem(item) {
  formData.id = item.id;
  formData.name = item.name;
  formData.calories = item.calories;
}

// Отправка данных на сервер (добавление/обновление)
async function submitForm() {
  try {
    await axios.post('http://localhost:5000/api/data', formData);
    formData.id = null;
    formData.name = '';
    formData.calories = null;
    fetchData();
  } catch (error) {
    console.error('Error submitting data:', error);
  }
}

// Загружаем данные при монтировании компонента
onMounted(fetchData);
</script>

<style scoped>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>

