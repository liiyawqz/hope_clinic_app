<template>
  <div class="table-container">
    <v-table class="rounded-table">
      <thead>
      <tr>
        <th class="text-left">Фамилия</th>
        <th class="text-center">Имя</th>
        <th class="text-center">Отчество</th>
        <th class="text-center">ID паспорта</th>
        <th class="text-center">Номер</th>
        <th class="text-center">Email</th>
        <th class="text-center"></th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in paginatedEquipments" :key="item.id_doc">
        <td class="text-left">{{ item.lname }}</td>
        <td class="text-center">{{ item.fname }}</td>
        <td class="text-center">{{ item.mname }}</td>
        <td class="text-center">{{ item.id_doc }}</td>
        <td class="text-center">{{ item.occupied }}</td>
        <td class="text-center">{{ item.email }}</td>
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

    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>
          <span>{{ isEditing ? 'Редактировать запись' : 'Добавить запись' }}</span>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="currentItem.lname" label="Фамилия" />
          <v-text-field v-model="currentItem.fname" label="Имя" />
          <v-text-field v-model="currentItem.mname" label="Отчество" />
          <v-text-field v-model="currentItem.id_doc" label="ID паспорта" type="number" />
          <v-text-field v-model="currentItem.occupied" label="Номер" type="number" />
          <v-text-field v-model="currentItem.email" label="Email" />
        </v-card-text>
        <v-card-actions>
          <v-btn @click="closeDialog">Отменить</v-btn>
          <v-btn @click="saveItem">{{ isEditing ? 'Сохранить' : 'Добавить' }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div class="text-center">
      <v-pagination :length="totalPages" v-model="page" @input="goToPage"></v-pagination>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import {StatusEnum} from "@/utils/statusEnum";

const dialog = ref(false);
const isEditing = ref(false);
const currentItem = ref({});
const page = ref(1);
const itemsPerPage = 10;
const equipments = ref([]);

onMounted(() => {
  loadEquipments();
});

watch(equipments, saveEquipments, { deep: true });

const paginatedEquipments = computed(() => {
  const start = (page.value - 1) * itemsPerPage;
  return equipments.value.slice(start, start + itemsPerPage);
});

const totalPages = computed(() => Math.ceil(equipments.value.length / itemsPerPage));

function toggleActions(item) {
  item.showActions = !item.showActions;
}

function editItem(item) {
  currentItem.value = { ...item };
  isEditing.value = true;
  dialog.value = true;
}

function deleteItem(item) {
  const index = equipments.value.findIndex(e => e.id_doc === item.id_doc);
  if (index > -1) {
    equipments.value.splice(index, 1);
  }
}

function saveItem() {
  if (isEditing.value) {
    const index = equipments.value.findIndex(item => item.id_doc === currentItem.value.id_doc);
    if (index > -1) {
      equipments.value[index] = { ...currentItem.value };
    }
  } else {
    equipments.value.push({ ...currentItem.value });
  }
  closeDialog();
}

function closeDialog() {
  dialog.value = false;
  currentItem.value = {};
  isEditing.value = false;
}

function loadEquipments() {
  const storedEquipments = sessionStorage.getItem('equipments');
  if (storedEquipments) {
    equipments.value = JSON.parse(storedEquipments);
  } else {
    equipments.value = [
      { lname: 'Болотова', fname: 'Алия', mname: 'Сталбековна', id_doc: 155533, occupied: '0709102849', email: 'bolotova_a@iuca.kg', },
    ];
  }

}

function saveEquipments() {
  localStorage.setItem('equipments', JSON.stringify(equipments.value));
}

function goToPage(pageNumber) {
  page.value = pageNumber;
}
</script>

<style scoped>
.table-container {
  background-color: white;
  overflow: hidden;
  border-radius: 10px;
  max-width: 1200px;
  margin: 0 auto;
}

.text-center {
  color: #181818;
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

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  color: #181818;
}

.pagination button {
  padding: 5px;
  margin: 0 2px;
}

td, th {
  padding: 8px;
  border-bottom: 0.5px solid #605C5C !important;
}
</style>
