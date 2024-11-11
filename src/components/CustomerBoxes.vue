<template>
  <v-container>
    <div class="equipment-container">
      <div class="equipment-box">
        <h3>Клиенты</h3>
        <p>Для того чтобы добавить новых клиентов нажмите на кнопку "Добавить клиента"</p>
        <v-btn @click="dialog = true" class="add-button">Добавить клиента</v-btn>
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


    <v-dialog v-model="dialog" max-width="425px">
      <v-card min-height="500px">
        <v-card-title>
          <span>Добавить Клиента</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row class="mb-4">
              <v-text-field
                v-model="currentItem.lname"
                label="Фамилия"
              />
            </v-row>
            <v-row class="mb-4">
              <v-text-field
                v-model="currentItem.fname"
                label="Имя"
              />
            </v-row>
            <v-row class="mb-4">
              <v-text-field
                v-model="currentItem.mname"
                label="Отчество"
              />
            </v-row>
            <v-row class="mb-4">
              <v-text-field
                v-model="currentItem.id_doc"
                label="ID паспорта"
                type="number"
              />
            </v-row>
            <v-row class="mb-4">
              <v-text-field
                v-model="currentItem.occupied"
                label="Номер"
                type="number"
              />
            </v-row>
            <v-row class="mb-4">
              <v-text-field
                v-model="currentItem.email"
                label="Email"
              />
            </v-row>
            <v-btn-toggle v-model="selectedSizes" multiple>
              <v-btn
                v-for="size in sizes"
                :key="size"
                :value="size"
                class="size-btn"
                :class="{ 'selected': selectedSizes.includes(size) }"
              >
                {{ size }}
              </v-btn>
            </v-btn-toggle>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn @click="dialog = false" class="cancel">Отменить</v-btn>
          <v-btn @click="saveItem" class="save-btn">Добавить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div class="text-center">
      <v-pagination :length="totalPages" v-model="page" @input="goToPage"></v-pagination>
    </div>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

const dialog = ref(false);
const currentItem = ref({});
const page = ref(1);
const itemsPerPage = 10;
const selectedSizes = ref([]);

const weeklyStat = ref(10);
const weeklyChange = ref(25);
const monthlyStat = ref(175);
const monthlyChange = ref(25);

const equipments = ref([
  { id_doc: '12345', lname: 'Иванов', fname: 'Иван', mname: 'Иванович', occupied: '123', email: 'ivanov@mail.com', showActions: false },
  { id_doc: '67890', lname: 'Петров', fname: 'Петр', mname: 'Петрович', occupied: '456', email: 'petrov@mail.com', showActions: false },
]);

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
  dialog.value = true;
}

function deleteItem(item) {
  const index = equipments.value.findIndex(e => e.id_doc === item.id_doc);
  if (index > -1) {
    equipments.value.splice(index, 1);
  }
}

function saveItem() {
  if (currentItem.value.id_doc) {
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
}

function loadEquipments() {
  const storedEquipments = localStorage.getItem('equipments');
  if (storedEquipments) {
    equipments.value = JSON.parse(storedEquipments);
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
.size-btn {
  background-color: #F1F5F9;
  color: black;
}
.v-card {
  background-color: white;
  color: black;
  border-radius: 30px !important;
}
.v-dialog {
  border-radius: 50px;
}
.equipment-container {
  max-width: 1000px;
  margin: 0 -10px;
  display: flex;
  gap: 100px;
  background-color: #F1F5F9;
  padding: 40px 0px;
}
.v-card-title {
  padding-top: 40px;
}
.equipment-box {
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 30px;
  padding: 15px 0px 0px 20px;
  flex: 0.4;
  line-height: 1.8;
}
.save-btn {
  background-color: #1861FF;
  color: white;
}
.v-card-actions {
  margin-bottom: 20px;
  margin-right: 20px;
}
.add-button {
  background-color: #1861FF;
  color: white;
  border-radius: 50px;
  font-size: 11px;
  margin-top: 10px;
  padding: 5px 10px;
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
</style>
