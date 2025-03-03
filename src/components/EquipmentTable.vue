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
        :items="filteredItems"
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
        @refreshEquipment="getEquipmentData"
      />



    </v-container>
  </template>

  <script setup>
  const showModal = ref(false);
    import { ref, computed, onMounted} from 'vue';
  import axiosInstance from "@/api";
  import CreateEquipmentModal from "@/components/CreateEquipmentModal.vue";
   const dialog = ref(false);
    const editedItem = ref({});
    const items = ref([]);
    const headers = [
      { title: 'Наименование', key: 'name' },
      { title: 'Модель', key: 'model' },
      { title: 'Размер', key: 'size' },
      { title: 'Серийный номер', key: 'serialNumber'},
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

  onMounted(() => {
    getEquipmentData();
  });

  const saveItem = () => {
      if (!editedItem.value.name) return;
      const index = items.value.findIndex(i => i.name === editedItem.value.name);
      if (index > -1) {
        items.value[index] = { ...editedItem.value };
      } else {
        items.value.push({ ...editedItem.value });
      }
      dialog.value = false;
      editedItem.value = {};
    };

    const editItem = (item) => {
      editedItem.value = { ...item };
      dialog.value = true;
    };

    const deleteItem = (item) => {
      items.value = items.value.filter(i => i !== item);
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
.mt-2{
  border-radius: 30px;
  margin-left: 10px;
}
.table{
  margin-top: 100px;
  ma-width: 1300px;
  background-color: var(--background-color);
  color: var(--text-color);
  margin-left: -90px;

}
v-container{
  margin-left: -100px;
}
</style>
