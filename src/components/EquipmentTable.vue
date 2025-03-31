<template>
  <v-container class="v-container">
    <v-card class="pa-4 mb-4 ">
      <v-card-title>Оборудование</v-card-title>
      <v-card-subtitle>
        Для того чтобы добавить новое оборудование, нажмите на кнопку "Добавить новое оборудование"
      </v-card-subtitle>
      <v-btn color="#1861FF" class="mt-2" @click="openModal('add')">Добавить новое</v-btn>
    </v-card>
    <v-text-field
      v-model="search"
      label="Поиск..."
      append-icon="mdi-magnify"
      class="search"
    ></v-text-field>

    <v-data-table
      class="table"
      :headers="headers"
      :items="items.dataListEquipment"
      item-value="id"
    >
    </v-data-table>
    <v-dialog v-model="isShowModal" max-width="400px">
      <v-card class="modalView bg-white" min-height="450px">
        <v-card-title >
          {{ modalType === 'add' ? 'Добавить оборудование' : 'Редактировать оборудование' }}
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveEquipment">
            <v-text-field v-model="editedItem.equipmentTypeId" label="Наименование" required></v-text-field>
            <v-text-field v-model="editedItem.subType" label="Модель" required></v-text-field>
            <v-select
              v-model="editedItem.size"
              :items="sizes"
              item-title="title"
              item-value="value"
              label="Размер"
              class="custom-select">
            </v-select>

          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="#1861FF" text @click="closeModal">Отмена</v-btn>
          <v-btn color="#1861FF" text @click="saveEquipment">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_APP_API_URL;

const search = ref('');
const isShowModal = ref(false);
const modalType = ref('');
const editedItem = ref({
  equipmentTypeId: '',
  subType: '',
  size: '',
});

const items = ref([]);
const sizes = ref([
  {title: 'S', value: 'S'},
  {title: 'M', value: 'M'},
  {title: 'L', value: 'L'},
  {title: 'XL', value: 'XL'},
]);
const headers = [
  {title: 'Наименование', key: 'equipmentTypeId'},
  {title: 'Модель', key: 'subType'},
  {title: 'Размер', key: 'size'},
  {title: 'Серийный номер', key: 'serialNum'},
  {title: 'Кол-во свободных', key: 'isAvailable'},
  {title: 'Действия', key: 'actions', sortable: false}
];

const filteredItems = computed(() => {
  return items.value.filter(item =>
    Object.values(item).some(value =>
      String(value).toLowerCase().includes(search.value.toLowerCase())
    )
  );
});

const fetchEquipments = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/Equipments/list`);
    items.value = response.data;
  } catch (error) {
    console.error('Ошибка загрузки списка оборудования:', error);
  }
};

const openModal = (type, item = null) => {
  modalType.value = type;
  isShowModal.value = true;
  if (type === 'edit' && item) {
    editedItem.value = {...item};
  } else {
    editedItem.value = {
      equipmentTypeId: '',
      subType: '',
      size: '',
    };
  }
};

const closeModal = () => {
  isShowModal.value = false;
};

const saveEquipment = async () => {
  try {
    if (!editedItem.value.subType || !editedItem.value.equipmentTypeId || !editedItem.value.size) {
      alert('Пожалуйста, заполните все обязательные поля.');
      return;
    }
    const equipmentData = {
      equipmentTypeId: editedItem.value.equipmentTypeId,
      subType: editedItem.value.subType,
      size: editedItem.value.size,
    };

    let response;
    if (modalType.value === 'add') {
      response = await axios.post(`${baseUrl}/api/Equipments`, equipmentData);
      console.log('Оборудование успешно добавлено:', response.data);
      items.value.push(response.data);
    } else {
      response = await axios.put(`${baseUrl}/api/Equipments/${editedItem.value.id}`, equipmentData);
      console.log('Оборудование успешно отредактировано:', response.data);
      const index = items.value.findIndex(item => item.id === editedItem.value.id);
      if (index !== -1) {
        items.value[index] = response.data;
      }
    }
    closeModal();
    fetchEquipments();
  } catch (error) {
    console.error('Ошибка сохранения данных оборудования:', error);
    alert('Произошла ошибка при сохранении данных оборудования. Попробуйте снова.');
  }
};

onMounted(() => {
  fetchEquipments();
});
</script>

<style scoped>
v-card {
  background-color: var(--background-color);
  color: var(--text-color);
}
.pa-4 {
  background-color: var(--background-color);
  color: var(--text-color);
  border-radius: 30px;
  max-width: 350px;
  margin-left: -90px;
}

.mt-2 {
  border-radius: 30px;
  margin-left: 10px;
}
.search{
  max-width: 399px;
  margin-left: -90px;
  margin-top: 50px;
}
.table{
  margin-top: 100px;
  min-width: 1350px;
  background-color: var(--background-color);
  color: var(--text-color);
  margin-left: -90px;
  border-radius: 20px;

}
:deep(.v-data-table th:hover) {
  color: #1861FF !important;
}

:deep(.custom-select .v-overlay__content) {
  background-color: red !important; /* Красный фон выпадающего списка */
}



</style>
