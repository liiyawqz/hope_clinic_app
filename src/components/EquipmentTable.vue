<template data-theme="light">
  <v-container>
    <v-card class="pa-4 mb-4">
      <v-card-title>Оборудование</v-card-title>
      <v-card-subtitle>
        Для того чтобы добавить новое оборудование, нажмите на кнопку "Добавить новое"
      </v-card-subtitle>
      <v-btn color="#1861FF" class="mt-2" @click="showModal = true">Добавить новое</v-btn>
    </v-card>

    <v-data-table
      class="table"
      :headers="headers"
      :items="items"
      item-value="name"
    >
      <template v-slot:item.actions="{ item }">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn v-bind="props" icon="mdi-dots-vertical"></v-btn>
          </template>
          <v-list>
            <v-list-item @click="editItem(item)">Редактировать</v-list-item>
            <v-list-item @click="deleteItem(item)">Удалить</v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>

    <CreateEquipmentModal
      v-model:isShowModal="showModal"
      @addEquipment="handleAddEquipment"
      @refreshEquipment="getEquipmentData"
    />
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import JsBarcode from 'jsbarcode';
import axiosInstance from "@/api";
import CreateEquipmentModal from "@/components/CreateEquipmentModal.vue";

const showModal = ref(false);
const items = ref([]);
const headers = [
  { title: 'Наименование', key: 'nameType' },
  { title: 'Модель', key: 'model' },
  { title: 'Размер', key: 'size' },
  { title: 'Серийный номер', key: 'serialNumber' },
  { title: 'Штрих-код', key: 'barcode', sortable: false },
  { title: 'Кол-во свободных', key: 'available' },
  { title: 'Кол-во занятых', key: 'occupied' },
  { title: 'Статус', key: 'status' },
  { title: 'Действия', key: 'actions', sortable: false }
];

const getEquipmentData = async () => {
  try {
    const response = await axiosInstance.get('/api/Equipments');
    items.value = response.data;
    console.log('Equipment data:', items.value);
  } catch (error) {
    console.error('Error fetching equipment data:', error.response ? error.response.data : error.message);
  }
};

const generateBarcode = (el, value) => {
  if (el && value) {
    JsBarcode(el, value, {
      format: 'CODE128',
      displayValue: true,
      lineColor: "#000",
      width: 2,
      height: 50
    });
  }
};

onMounted(() => {
  getEquipmentData();
});

const handleAddEquipment = async (newEquipment) => {
  try {
    const response = await axiosInstance.post('/api/Equipments', newEquipment);
    items.value.push(response.data);
    console.log('Equipment added:', response.data);
  } catch (error) {
    console.error('Error adding equipment:', error.response ? error.response.data : error.message);
  }
};

const editItem = (item) => {
  console.log('Редактирование:', item);
};

const deleteItem = async (item) => {
  try {
    await axiosInstance.delete(`/api/Equipments/${item.id}`);
    items.value = items.value.filter(i => i.id !== item.id);
    console.log('Equipment deleted:', item.id);
  } catch (error) {
    console.error('Error deleting equipment:', error.response ? error.response.data : error.message);
  }
};
</script>

<style scoped>
* {
  transition: background-color 0.3s ease, color 0.3s ease;
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

.table {
  margin-top: 100px;
  max-width: 1300px;
  background-color: var(--background-color);
  color: var(--text-color);
  margin-left: -90px;
}
</style>
