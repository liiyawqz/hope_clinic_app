<template data-theme="light">
  <div class="v-table equipment-table">
    <div class="equipment-container">
      <div class="equipment-box">
        <h3>Оборудование</h3>
        <p>Для того чтобы добавить новое оборудование нажмите на кнопку "Добавить новое"</p>
        <button @click="openModal('add')" class="add-button">Добавить новое</button>
      </div>
      <div class="stats-box">
        <div class="stats-item">
          <h3>На этой неделе</h3>
          <p class="stat-number">{{ weeklyStat }}</p>
          <p class="stat-change">+{{ weeklyChange }}% from last week</p>
        </div>
        <div class="stats-item">
          <h3>В этом месяце</h3>
          <p class="stat-number">{{ monthlyStat }}</p>
          <p class="stat-change">+{{ monthlyChange }}% from last month</p>
        </div>
      </div>
      </div>
    </div>

      <input
        v-model="search"
        placeholder="Поиск"
        class="search-input"
      />


  <v-table class = "equipment-table">
      <thead>
      <tr>
        <th class="text-left">Наименование</th>
        <th class="text-center">Модель</th>
        <th class="text-center">Размер</th>
        <th class="text-center">Кол-во свободных</th>
        <th class="text-center">Кол-во занятых</th>
        <th class="text-center">Статус</th>
      </tr>
      </thead>
      <tbody>
      <tr
        v-for="(row, index) in paginatedRows"
        :key="index"
      >
        <td>{{ row.name }}</td>
        <td>{{ row.type}}</td>
        <td>{{ row.size }}</td>
        <td>{{ row.empty }}</td>
        <td>{{ row.occupied }}</td>
        <td>
          <button @click="openModal('edit', index)">Изменить</button>
          <button @click="deleteRow(index)">Удалить</button>
        </td>
      </tr>
      </tbody>
    </v-table>
      <v-pagination :length="4"></v-pagination>


   <div v-if="isShowModal" class="modal" >
      <div class="modal-content">
        <h3 v-if="modalType === 'add'" class="add-text">Добавить оборудование </h3>
        <h3 v-else>Изменить запись</h3>
        <form @submit.prevent="modalType === 'add' ? addRow() : saveEdit(editIndex)">
          <label>Введите наименование:</label>
          <input class="modal-content-item" v-model="activeRow.name" placeholder="наименование" required />
          <label>Введите модель:</label>
          <input class="modal-content-item" v-model="activeRow.type" placeholder="модель" required />
          <label>Введите размер:</label>
          <input class="modal-content-item" v-model="activeRow.size" placeholder="размер" required />
          <div class="canc-sub-button">
          <button type="button" class="cancel-btn" @click="closeModal">Отмена</button>
          <button type="submit" class="save-btn">Сохранить</button>
        </div>
        </form>
      </div>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import axios from "axios";
import axiosInstance from "@/api";
const baseUrl = import.meta.env.VITE_APP_API_URL;
const search = ref('');
const itemsPerPage = ref(10);
const currentPage = ref(1);

const rows = reactive([]);
const activeRow = reactive([]);

const isShowModal = ref(false);
const modalType = ref("");
const editIndex = ref(null);

const filteredRows = computed(() => {
  if (!search.value) return rows;
  return rows.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(search.value.toLowerCase())
    )
  );
});

const paginatedRows = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = itemsPerPage.value === -1 ? filteredRows.value.length : start + itemsPerPage.value;
  return filteredRows.value.slice(start, end);
});

const totalPages = computed(() =>
  itemsPerPage.value === -1 ? 1 : Math.ceil(filteredRows.value.length / itemsPerPage.value)
);

// Загружаем данные с сервера
onMounted(() => fetchRows());

async function fetchRows() {
  try {
    const response = await axiosInstance.get('/api/Equipment/list', { params: { clientId: 3 } });
    rows.push(...response.data);
    console.log(rows, 'rows');
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
  }
}



function openModal(type, index = null) {
  modalType.value = type;
  isShowModal.value = true;
  if (type === "edit" && index !== null) {
    editIndex.value = index;
    Object.assign(activeRow, rows[index]);
  } else {
    resetActiveRow();
  }
}

function closeModal() {
  isShowModal.value = false;
  resetActiveRow();
}

function resetActiveRow() {
  Object.keys(activeRow).forEach((key) => {
    activeRow[key] = "";
  });
}

async function addRow() {
  try {
    const response = await axios.post(`${baseUrl}/api/Equipment`, activeRow);
    rows.push(response.data);
    closeModal();
  } catch (error) {
    console.error("Ошибка при добавлении строки:", error);
    alert('Failed to add client data.');
  }
}

async function saveEdit(index) {
  if (index !== null) {
    try {
      const response = await axios.put(`${baseUrl}/api/Equipment/${rows[index].id}`, activeRow);
      rows[index] = response.data; // Обновляем строку
      closeModal();
    } catch (error) {
      console.error("Ошибка при сохранении изменения:", error);
      alert('Failed to save changes.');
    }
  }
}

async function deleteRow(index) {
  try {
    await axios.delete(`${baseUrl}/api/Equipment/${rows[index].id}`);
    rows.splice(index, 1); // Удаляем строку
  } catch (error) {
    console.error("Ошибка при удалении строки:", error);
    alert('Failed to delete equipment data.');
  }
}

function changePage(page) {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
  }
}
const weeklyChange = ref(25)
const monthlyChange = ref(25)
const weeklyStat = ref(10)
const monthlyStat = ref(175)

</script>


<style scoped>
.search-input {
  background-color: #ffffff;
  padding: 9px;
  margin-left: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color:black;

}

* {
  transition: background-color 0.3s ease, color 0.3s ease;
}
.v-table{
  background-color:#F1F5F9;

}
.v-table {
  font-family: Arial, sans-serif;
  margin: 30px;
  background-color: var(--background-color);
  color: var(--text-color);
  border-radius: 10px;
}

tr {
  border-bottom: 2px solid #605C5C;
}


table {
  width: 100%;
  border-collapse: collapse;
  margin: 20px;
  background-color: #ffffff;
  color: black;
}

th,
td {
  border: 1px solid #ffffff;
  padding: 8px;
  text-align: left;
  color: black !important;
}
td {
  color: black;
}
th {
  color: black;
}
th {
  background-color: #ffffff;
}
button {
  margin-right: 5px;
  padding: 5px 10px;
  cursor: pointer;
  color: black;
  background-color: #ffffff;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(66, 66, 66, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;

}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
  background: #ffffff;
  padding: 20px;
  width: 425px;
  color: black;
  border-radius: 30px;
  height: 500px;
}
.add-text{
  padding-top: 20px;
}
.modal-content h3 {
  margin-top: 0;
  color: black;
}
.modal-content input {
  width: 100%;
  margin-bottom: 10px;
  padding: 8px;
  box-sizing: border-box;
  color: black;
}

.serach_button_container > p {
  color: #888;
  font-size: 11px;
}

button {
  margin-right: 5px;
  padding: 5px 10px;
  cursor: pointer;
  color: #ffffff;
  background-color: #007BFF;
  border: none;
  border-radius: 3px;
  transition: background-color 0.3s ease;
}


button:active {
  background-color: #003f7f;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}



.modal-content input {
  color: black;
  background-color: white;
  border: 1px solid #ccc;
  padding: 8px;
  border-radius: 3px;
  width: calc(100% - 16px);
}

.modal-content input::placeholder {
  color: #888;
}

.modal-content {
  color: black;
}

button {
  color: white;
  border-radius: 10px;
}


label{
  display: block;
  margin-bottom: 15px !important;
  color: #3d3b3b;
}

.equipment-container {
  max-width: 1000px;
  display: flex;
  gap: 100px;
  background-color: #F1F5F9;
  padding:40px 0px;

}
.equipment-container{
  background-color: var(--background-color);
  color: var(--text-color);
  transition: background-color 0.3s, color 0.3s;
}
.equipment-box {
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 30px;
  padding: 15px 0px 0px 20px;
  flex: 0.4;
  line-height: 2;
}

.save-btn{
  background-color: #1861FF;
  color: white;

}
.cancel-btn{
  background-color: #efecec;
  color: black;
  margin-right: 10px ;

}
.canc-sub-button{
  margin-top: 50px;
  margin-left: 190px;
}
.stats-box {
  display: flex;
  gap: 90px;
  flex: 1;
}

.stats-item {
  background-color: #ffffff;
  border-radius: 30px;
  width: 170px !important;
  height: 150px !important;
  padding: 10px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.stat-number {
  font-size: 36px;
  font-weight: bold;
}

.stat-change {
  color: #888;
  font-size: 14px;
}

.equipment-box > p {
  color: #888;
  font-size: 11px;
}
p, h3 {
  color: black;
}

.add-button {
  background-color: #1861FF;
  color: white;
  border-radius: 50px;
  font-size: 11px;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 5px 10px;
  font-weight: bold;
  max-width: 120px;
}
.equipment-table{
  max-width: 1200px;
}
.equipment-box > p {
  color: #888;
  font-size: 11px;
}
.modal-content-item{
  background-color: #F1F5F9 !important;
  border: none !important;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}


</style>
