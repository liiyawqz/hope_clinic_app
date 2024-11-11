<template>
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
        <td class="text-center"></td>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in equipments" :key="item.name">
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

    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title>
          <span>{{ isEditing ? 'Редактировать оборудование' : 'Добавить оборудование' }}</span>
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="currentItem.name" label="Наименование" />
          <v-text-field v-model="currentItem.model" label="Модель" />
          <v-text-field v-model="currentItem.size" label="Размер" />
          <v-text-field v-model="currentItem.empty" label="Кол-во свободных" type="number" />
          <v-text-field v-model="currentItem.occupied" label="Кол-во занятых" type="number" />
          <v-select v-model="currentItem.status" :items="statusOptions" label="Статус" />
        </v-card-text>
        <v-card-actions>
          <v-btn @click="closeDialog">Отменить</v-btn>
          <v-btn @click="saveItem">{{ isEditing ? 'Сохранить' : 'Добавить' }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div class="text-center">
      <v-pagination
        :length="3"
      ></v-pagination>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { StatusEnum } from '@/utils/statusEnum';
const dialog = ref(false);
const isEditing = ref(false);
const currentItem = ref({});
const page = ref(1);
const statusOptions = ref([StatusEnum.Active, StatusEnum.Removed]);
const equipments = ref([]);

onMounted(() => {
  loadEquipments(); // Загружаем данные при монтировании компонента
});

watch(equipments, saveEquipments, { deep: true }); // Сохраняем данные при каждом изменении

const pages = computed(() => {
  const totalPages = Math.ceil(equipments.value.length / 10); // Предположим, 10 элементов на страницу
  return Array.from({ length: totalPages }, (_, i) => i + 1);
});

function toggleActions(item) {
  item.showActions = !item.showActions;
}

function editItem(item) {
  currentItem.value = { ...item }; // Копируем объект, чтобы не изменять оригинал
  isEditing.value = true;
  dialog.value = true;
}

function deleteItem(item) {
  const index = equipments.value.findIndex(e => e.name === item.name && e.model === item.model);
  if (index > -1) {
    equipments.value.splice(index, 1);
  }
}

function saveItem() {
  if (isEditing.value) {
    const index = equipments.value.findIndex(item => item.name === currentItem.value.name && item.model === currentItem.value.model);
    if (index > -1) {
      equipments.value[index] = { ...currentItem.value }; // Обновляем элемент
    }
  } else {
    equipments.value.push({ ...currentItem.value }); // Добавляем новый элемент
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
      { name: 'костыль', model: 'м5', size: 'S', empty: 6, occupied: 10, status: StatusEnum.Active, showActions: false },
    ];
  }

}

// Функция для сохранения данных в LocalStorage
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
.text-center{
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
