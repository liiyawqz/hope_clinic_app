<template data-theme="light">
    <v-container>
      <v-card class="pa-4 mb-4">
        <v-card-title>Оборудование</v-card-title>
        <v-card-subtitle>
          Для того чтобы добавить новое оборудование, нажмите на кнопку "Добавить новое"
        </v-card-subtitle>
        <v-btn color="primary" class="mt-2" @click="dialog = true">Добавить новое</v-btn>
      </v-card>

      <v-text-field v-model="search" label="Поиск..." append-icon="mdi-magnify" class="mb-4"></v-text-field>

      <v-data-table
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

      <v-dialog v-model="dialog" max-width="500px">
        <v-card>
          <v-card-title>Добавить оборудование</v-card-title>
          <v-card-text>
            <v-form @submit.prevent="saveItem">
              <v-text-field v-model="editedItem.name" label="Наименование" required></v-text-field>
              <v-text-field v-model="editedItem.model" label="Модель" required></v-text-field>
              <v-text-field v-model="editedItem.size" label="Размер" required></v-text-field>
              <v-text-field v-model="editedItem.serialNumber" label="Серийный номер" required></v-text-field>
              <v-text-field v-model.number="editedItem.available" label="Свободно" type="number" required></v-text-field>
              <v-text-field v-model.number="editedItem.occupied" label="Занято" type="number" required></v-text-field>
              <v-select v-model="editedItem.status" :items="statuses" label="Статус" required></v-select>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn color="blue darken-1" text @click="dialog = false">Отмена</v-btn>
            <v-btn color="blue darken-1" text @click="saveItem">Сохранить</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>

  <script setup>
    import { ref, computed } from 'vue';

    const search = ref('');
    const dialog = ref(false);
    const editedItem = ref({});
    const items = ref([
      { name: 'Костыли', model: 'M5', size: 'S',serialNumber: '0001', available: 6, occupied: 10, status: 'Активен' },
      { name: 'Ходунки', model: 'ES', size: 'M',serialNumber: '0002', available: 6, occupied: 10, status: 'Активен' }
    ]);
    const statuses = ['Активен', 'Удален'];
    const headers = [
      { title: 'Наименование', key: 'name' },
      { title: 'Модель', key: 'model' },
      { title: 'Размер', key: 'size' },
      {title: 'Серийный номер', key: 'serialNumber'},
      { title: 'Кол-во свободных', key: 'available' },
      { title: 'Кол-во занятых', key: 'occupied' },
      { title: 'Статус', key: 'status' },
      { title: 'Действия', key: 'actions', sortable: false }
    ];

    const filteredItems = computed(() => {
      return items.value.filter(item =>
        Object.values(item).some(value =>
          String(value).toLowerCase().includes(search.value.toLowerCase())
        )
      );
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
  .v-container {
      max-width: 800px;
      margin: auto;
    }
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
