<template>
  <div class="v-table">
    <h2>Управление данными</h2>
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
      <tr v-for="(row, index) in rows" :key="index">

        <template v-if="editIndex === index">
          <td><input v-model="editRow.lastName" /></td>
          <td><input v-model="editRow.firstName" /></td>
          <td><input v-model="editRow.middleName" /></td>
          <td><input v-model="editRow.id" type="number" /></td>
          <td><input v-model="editRow.passport" /></td>
          <td><input v-model="editRow.phone" /></td>
          <td><input v-model="editRow.email" /></td>
          <td>
            <button @click="saveEdit(index)">Сохранить изменения</button>
            <button @click="cancelEdit">Отмена</button>
          </td>
        </template>


        <template v-else>
          <td>{{ row.lastName }}</td>
          <td>{{ row.firstName }}</td>
          <td>{{ row.middleName }}</td>
          <td>{{ row.id }}</td>
          <td>{{ row.passport }}</td>
          <td>{{ row.phone }}</td>
          <td>{{ row.email }}</td>
          <td>
            <button @click="startEdit(index)">Изменить</button>
            <button @click="deleteRow(index)">Удалить</button>
          </td>
        </template>
      </tr>
      </tbody>
    </table>


    <button @click="openModal">Добавить</button>


    <div v-if="isShowModal" class="modal">
      <div class="modal-content">
        <h3>Добавить новую запись</h3>
        <form @submit.prevent="addRow">
          <input v-model="newRow.lastName" placeholder="Фамилия" required />
          <input v-model="newRow.firstName" placeholder="Имя" required />
          <input v-model="newRow.middleName" placeholder="Отчество" required />
          <input v-model="newRow.id" type="number" placeholder="ID" required />
          <input v-model="newRow.passport" placeholder="Паспорт" required />
          <input v-model="newRow.phone" placeholder="Номер телефона" required />
          <input v-model="newRow.email" placeholder="Email" type="email" required />
          <button type="submit">Сохранить</button>
          <button type="button" @click="closeModal">Отмена</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";


const rows = reactive([
  {
    lastName: "Иванов",
    firstName: "Иван",
    middleName: "Иванович",
    id: 1,
    passport: "1234 567890",
    phone: "+7 999 123-45-67",
    email: "ivanov@example.com",
  },
]);


const newRow = reactive({
  lastName: null,
  firstName: null,
  middleName: null,
  id: null,
  passport: null,
  phone: null,
  email: null,
});


const editRow = reactive({
  lastName: null,
  firstName: null,
  middleName: null,
  id: null,
  passport: null,
  phone: null,
  email: null,
});

const isShowModal = ref(false);
const editIndex = ref(null);


function openModal() {
  isShowModal.value = true;
}

function closeModal() {
  isShowModal.value = false;
}

function addRow() {
  if (
    newRow.lastName &&
    newRow.firstName &&
    newRow.middleName &&
    newRow.id &&
    newRow.passport &&
    newRow.phone &&
    newRow.email
  ) {
    rows.push({ ...newRow });
    resetNewRow();
    closeModal();
  } else {
    alert("Заполните все поля");
  }
}

function resetNewRow() {
  Object.keys(newRow).forEach((key) => {
    newRow[key] = null;
  });
}

function deleteRow(index) {
  rows.splice(index, 1);
}

function startEdit(index) {
  editIndex.value = index;
  Object.assign(editRow, rows[index]);
}

function saveEdit(index) {
  if (editIndex.value !== null) {
    rows[index] = { ...editRow };
    cancelEdit();
  }
}

function cancelEdit() {
  editIndex.value = null;
  resetEditRow();
}

function resetEditRow() {
  Object.keys(editRow).forEach((key) => {
    editRow[key] = null;
  });
}
</script>

<style scoped>
.v-table {
  font-family: Arial, sans-serif;
  margin: 20px;
  color: black;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 10px;
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
  width: 400px;
  color: black;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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

button.delete {
  background-color: #dc3545;
}

button.delete:hover {
  background-color: #a71d2a;
}

button.save {
  background-color: #28a745;
}

button.save:hover {
  background-color: #1e7e34;
}

button.cancel {
  background-color: #ffc107;
  color: #212529;
}

button.cancel:hover {
  background-color: #e0a800;
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
  color: black;
}

.editIndex {
  color: black;
}

</style>
