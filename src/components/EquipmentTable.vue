<template>
  <div>
    <h2>Поиск оборудования</h2>
    <div class="filter-container">
      <div>
        <input v-model="filters.name" placeholder="Наименование" />
      </div>
      <div>
        <input v-model="filters.model" placeholder="Модель" />
      </div>
      <div>
        <label>Размер</label>
        <select v-model="filters.size">
          <option value="">Все</option>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select>
      </div>
      <div>
        <label>Статус</label>
        <select v-model="filters.status">
          <option value="">Все</option>
          <option value="Активен">Активен</option>
          <option value="Удален">Удален</option>
        </select>
      </div>
    </div>

    <div class="table-container">
      <v-table class="rounded-table">
        <thead>
        <tr>
          <td class="text-left">Наименование</td>
          <td class="text-center">Модель</td>
          <td class="text-center">Размер</td>
          <td class="text-center">Кол-во свободных</td>
          <td class="text-center">Кол-во занятых</td>
          <td class="text-center">Статус</td>
        </tr>
        </thead>
        <tbody>

        <tr v-for="item in paginatedEquipments" :key="item.name">
          <th class="text-left">{{ item.name }}</th>
          <th class="text-center">{{ item.model }}</th>
          <th class="text-center">{{ item.size }}</th>
          <th class="text-center">{{ item.empty }}</th>
          <th class="text-center">{{ item.occupied }}</th>
          <th class="text-center">
              <span :class="{'status-active': item.status === 'Активен', 'status-deleted': item.status === 'Удален'}">
                {{ item.status }}
              </span>
          </th>
          <td>
            <button @click="toggleActions(item)">...</button>
            <div v-if="item.showActions" class="dropdown">
              <button @click="editItem(item)">Изменить</button>
              <button @click="deleteItem(item)">Удалить</button>
            </div>
          </td>
        </tr>
        </tbody>
      </v-table>
    </div>

    <div class="text-center">
      <v-container>
        <v-row justify="center">
          <v-col cols="8">
            <v-container class="max-width">
              <v-pagination
                v-model="page"
                :length="totalPages"
                :total-visible="7"
                class="my-4"
              ></v-pagination>
            </v-container>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <div class="elements-on-page text-right">
      <span class="text-grey-darken-1"> Кол-во элементов на странице: {{itemPerPage}} </span>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, computed, onMounted} from 'vue'

const props = defineProps({
  equipments: {
    type: Array,
    required: true,
  },
})
console.log(props.equipments);


const filters = ref({
  name: '',
  model: '',
  size: '',
  status: ''
})

const page = ref(1)
const itemPerPage = 10

// Вычисляем отфильтрованные данные
const filteredEquipments = computed(() => {
  return props.equipments.filter(item => {
    const matchesName = item.name.toLowerCase().includes(filters.value.name.toLowerCase());
    const matchesModel = item.model.toLowerCase().includes(filters.value.model.toLowerCase());
    const matchesSize = filters.value.size ? item.size === filters.value.size : true;
    const matchesStatus = filters.value.status ? item.status === filters.value.status : true;

    return matchesName && matchesModel && matchesSize && matchesStatus;
  });
})

// Вычисляем данные для текущей страницы
const paginatedEquipments = computed(() => {
  const start = (page.value - 1) * itemPerPage;
  const end = start + itemPerPage;
  return filteredEquipments.value.slice(start, end);
})

// Вычисляем общее количество страниц
const totalPages = computed(() => {
  return Math.ceil(filteredEquipments.value.length / itemPerPage);
})

function toggleActions(item) {
  item.showActions = !item.showActions;
}

function editItem(item) {
  console.log("Edit", item);
}


function deleteItem(item) {
  console.log("Delete", item);
}
import axios from 'axios';

const equipmentList = ref([]);

const fetchEquipment = async () => {
  try {
    const response = await axios.get(import.meta.env.VITE_API_URL);
    equipmentList.value = response.data;
  } catch (error) {
    console.error('Ошибка при получении оборудования:', error);
  }
};

onMounted(() => {
  fetchEquipment();
});

</script>

<style scoped>
.filter-container {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 50px;
  margin-top: 20px;
  gap: 20px;
}

.filter-container div {
  width: 49%;
}

.filter-container label {
  display: block;
  margin-bottom: 5px;
}

.filter-container input,
.filter-container select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.table-container {
  background-color: white;
  overflow: hidden;
  border-radius: 10px;
  max-width: 1200px;
  margin: 0 auto;
}
.table-container {
  background-color: white;
  overflow: hidden;
  border-radius: 10px;
  max-width: 1200px;
  margin: 0 auto;
}
.text-center{
  color: #181818;

}
h2,label, input{
  color: black;
}

.rounded-table {
  background-color: white;
  border-radius: 10px;
  max-width: 1100px;
  margin: auto;
}

thead tr {
  border-bottom: 2px solid #000000;
}

td, th {
  color: #605C5C;
  padding: 8px;
}

th {
  color: #000000;
}

.status-active {
  color: green;
  font-weight: bold;
  font-size: 15px;
}

.status-deleted {
  color: black;
  font-weight: bold;
  font-size: 15px;
}

.dropdown {
  position: absolute;
  background: white;
  margin-top: 10px;
  padding: 5px;
  display: flex;
  align-items: start;
  flex-direction: column;
  min-height: 70px;
}


.pagination button {
  padding: 5px;
  margin: 0 2px;
}

td, th {
  padding: 8px;
  border-bottom: 0.5px solid #605C5C !important;
}
input, select{
  background-color: white;
}
select{
  color: #605C5C;
}
</style>
