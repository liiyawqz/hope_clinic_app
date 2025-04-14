<template>
  <v-container class="v-container">
    <v-card class="pa-4 mb-4">
      <v-card-title>Оборудование</v-card-title>
      <v-card-subtitle>
        Для добавления нового оборудования нажмите кнопку "Добавить оборудование"
      </v-card-subtitle>
      <v-btn color="primary" class="mt-2" @click="openModal('add')">Добавить оборудование</v-btn>
    </v-card>

    <v-text-field
      v-model="search"
      label="Поиск..."
      append-icon="mdi-magnify"
      class="mb-4"
      @input="searchEquipment"
    ></v-text-field>

    <v-data-table :headers="headers" :items="items">
    </v-data-table>

    <v-dialog v-model="isShowModal" max-width="600px">
      <v-card>
        <v-card-title>
          {{ modalType === 'add' ? 'Добавить оборудование' : 'Редактировать оборудование' }}
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="saveEquipment">
            <v-text-field v-model="editedItem.equipmentTypeId" label="ID типа оборудования"></v-text-field>
            <v-text-field v-model="editedItem.subType" label="Подтип"></v-text-field>
            <v-text-field v-model="editedItem.size" label="Размер"></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="closeModal">Отмена</v-btn>
          <v-btn color="blue darken-1" text @click="saveEquipment">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';

const baseUrl = import.meta.env.VITE_APP_API_URL;
const search = ref('');
const isShowModal = ref(false);
const modalType = ref('');
const editedItem = ref({ equipmentTypeId: '', subType: '', size: '' });
const items = ref([]);
const headers = [
  { title: 'ID типа оборудования', key: 'equipmentTypeId' },
  { title: 'Подтип', key: 'subType' },
  { title: 'Размер', key: 'size' },
  { title: 'Действия', key: 'actions', sortable: false }
];

const fetchEquipment = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/Equipments/list`);
    items.value = response.data;
  } catch (error) {
    console.error('Ошибка загрузки списка оборудования:', error);
  }
};

const searchEquipment = async () => {
  if (search.value.trim() === '') {
    await fetchEquipment();
    return;
  }
  try {
    const response = await axios.post(`${baseUrl}/api/Equipments/search`, { query: search.value });
    items.value = response.data;
  } catch (error) {
    console.error('Ошибка поиска оборудования:', error);
  }
};

const openModal = (type, item = null) => {
  modalType.value = type;
  isShowModal.value = true;
  editedItem.value = type === 'edit' && item ? { ...item } : { equipmentTypeId: '', subType: '', size: '' };
};

const closeModal = () => {
  isShowModal.value = false;
};

const saveEquipment = async () => {
  try {
    if (!editedItem.value.equipmentTypeId || !editedItem.value.subType || !editedItem.value.size) {
      alert('Пожалуйста, заполните все обязательные поля.');
      return;
    }

    const equipmentData = {
      equipmentTypeId: parseInt(editedItem.value.equipmentTypeId, 10) || 0,
      subType: editedItem.value.subType,
      size: editedItem.value.size
    };

    let response;
    if (modalType.value === 'add') {
      response = await axios.post(`${baseUrl}/api/Equipments`, equipmentData);
      items.value.push(response.data);
    } else {
      response = await axios.put(`${baseUrl}/api/Equipments/${editedItem.value.equipmentId}`, equipmentData);
      const index = items.value.findIndex(item => item.equipmentId === editedItem.value.equipmentId);
      if (index !== -1) items.value[index] = response.data;
    }
    closeModal();
    fetchEquipment();
  } catch (error) {
    console.error('Ошибка сохранения оборудования:', error);
    alert('Произошла ошибка. Попробуйте снова позже.');
  }
};

onMounted(() => {
  fetchEquipment();
});
</script>

<style scoped>
v-card {
  background-color: var(--background-color);
  color: var(--text-color);
}
</style>
