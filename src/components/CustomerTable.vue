<template>
  <div class="v-table customer-table">
    <h2>Управление данными</h2>

    <!-- Поле для поиска -->
    <div class="serach_button_container">
      <input
        v-model="search"
        placeholder="Поиск"
        class="search-input"
      />
      <button @click="openModal('add')" class="button_add">Добавить</button>
    </div>

    <!-- Таблица -->
    <table>
      <thead>
      <tr>
        <th>Фамилия</th>
        <th>Имя</th>
        <th>Отчество</th>
        <th>ID</th>
        <th>Паспорт</th>
        <th>Номер</th>
        <th>Email</th>
        <th>Действия</th>
      </tr>
      </thead>
      <tbody>
      <tr
        v-for="(row, index) in paginatedRows"
        :key="index"
      >
        <td>{{ row.lastName }}</td>
        <td>{{ row.firstName }}</td>
        <td>{{ row.middleName }}</td>
        <td>{{ row.id }}</td>
        <td>{{ row.passport }}</td>
        <td>{{ row.phone }}</td>
        <td>{{ row.email }}</td>
        <td>
          <button @click="openModal('edit', index)">Изменить</button>
          <button @click="deleteRow(index)">Удалить</button>
        </td>
      </tr>
      </tbody>
    </table>

    <!-- Навигация -->
    <div class="pagination_container">
      <div class="pagination">
        <label>Элементов на странице: {{rows.length}} / {{itemsPerPage}}</label>
        <select v-model="itemsPerPage">
          <option :value="5">5</option>
          <option :value="10">10</option>
          <option :value="15">15</option>
          <option :value="-1">Все</option>
        </select>
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
        >
          Назад
        </button>
        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
        >
          Вперед
        </button>
      </div>
    </div>


    <v-pagination
      v-model="page"
      :length="15"
      class="my-4"
    ></v-pagination>



    <!-- Модальное окно -->
    <div v-if="isShowModal" class="modal">
      <div class="modal-content">
        <h3 v-if="modalType === 'add'">Добавить новую запись</h3>
        <h3 v-else>Изменить запись</h3>
        <form @submit.prevent="modalType === 'add' ? addRow() : saveEdit(editIndex)">
          <label>Введите Фамилию:</label>
          <input v-model="activeRow.lastName" placeholder="Фамилия" required />
          <label>Введите Имя:</label>
          <input v-model="activeRow.firstName" placeholder="Имя" required />
          <label>Введите Отчество:</label>
          <input v-model="activeRow.middleName" placeholder="Отчество" required />
          <label>Введите номер: </label>
          <input v-model="activeRow.id" type="number" placeholder="ID" required />
          <label>Введите номер паспорта:</label>
          <input v-model="activeRow.passport" placeholder="Паспорт" required />
          <label>Введите номер телефона:</label>
          <input v-model="activeRow.phone" placeholder="Номер телефона" required />
          <label>Введите Email:</label>
          <input v-model="activeRow.email" placeholder="Email" type="email" required />
          <button type="submit">Сохранить</button>
          <button type="button" @click="closeModal">Отмена</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import axios from "axios";
import axiosInstance from "@/api";

// Получаем базовый URL из переменной окружения
const baseUrl = import.meta.env.VITE_APP_API_URL;

const search = ref('');
const itemsPerPage = ref(10);
const currentPage = ref(1);

const rows = reactive([]); // Данные будут загружаться с сервера
const activeRow = reactive([]);

const isShowModal = ref(false);
const modalType = ref(""); // "add" или "edit"
const editIndex = ref(null);

// Фильтрация и пагинация
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
    const response = await axiosInstance.get('/api/Clients/list', { params: { clientId: 3 } });
    rows.push(...response.data); // Используем spread, чтобы добавлять каждый объект в массив rows
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
    const response = await axios.post(`${baseUrl}/api/Clients`, activeRow);
    rows.push(response.data); // Добавляем новую строку
    closeModal();
  } catch (error) {
    console.error("Ошибка при добавлении строки:", error);
    alert('Failed to add client data.');
  }
}

async function saveEdit(index) {
  if (index !== null) {
    try {
      const response = await axios.put(`${baseUrl}/api/Clients/${rows[index].id}`, activeRow);
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
    await axios.delete(`${baseUrl}/api/Clients/${rows[index].id}`);
    rows.splice(index, 1); // Удаляем строку
  } catch (error) {
    console.error("Ошибка при удалении строки:", error);
    alert('Failed to delete client data.');
  }
}

function changePage(page) {
  if (page > 0 && page <= totalPages.value) {
    currentPage.value = page;
  }
}

</script>


<style scoped>
.serach_button_container {
  display: flex;
  flex-direction: column;
  float: right;
  gap: 26px;
  margin-bottom: 39px;
}
.search-input {
  padding: 9px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  float: right; /* Перемещает элемент вправо */
}

.v-table {
  font-family: Arial, sans-serif;
  margin: 30px;
  color: black;
  background-color:#F1F5F9;
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
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  color: black;
}

.modal-content {
  background: #ffffff;
  padding: 20px;
  border-radius: 5px;
  width: 600px;
  color: black;
  box-shadow: 0 2px 10px rgba(63, 8, 73, 0.1);
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

.button_add {
  margin-right: 5px;
  padding: 5px 10px;
  cursor: pointer;
  color: #ffffff;
  background-color: #007BFF;
  border: none;
  border-radius: 10px;
  transition: background-color 0.3s ease;
  float: right;
}

button:hover {
  background-color: #0056b3;
}

button:active {
  background-color: #003f7f;
}

button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.modal-content button {
  margin: 5px 0;
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

.editIndex {
  color: black;
}

.v-model {
  color: black;
}
input {
  color:black;
}

</style>
