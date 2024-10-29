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
    <div class="pagination">
      <div class="text-center">
        <v-container>
          <v-row justify="center">
            <v-col cols="8">
              <v-container class="max-width">
                <v-pagination
                  v-model="page"
                  :length="15"
                  class="my-4"
                ></v-pagination>
              </v-container>
            </v-col>
          </v-row>
        </v-container>
      </div>
<!--      <button @click="prevPage">«</button>-->
      <button v-for="page in pages" :key="page" @click="goToPage(page)">{{ page }}</button>
<!--      <button @click="nextPage">»</button>-->
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { StatusEnum } from '@/utils/statusEnum';

const page = ref(1);

const equipments = computed(() => {
  return [
    { name: 'Костыли', model: 'M5', size: 'S', empty: 6, occupied: 10, status: StatusEnum.Active, showActions: false },
    { name: 'Костыли', model: 'M5', size: 'M', empty: 2, occupied: 10, status: StatusEnum.Active, showActions: false },
    { name: 'Костыли', model: 'M5', size: 'M', empty: 2, occupied: 10, status: StatusEnum.Active, showActions: false },
    { name: 'Костыли', model: 'M5', size: 'M', empty: 2, occupied: 10, status: StatusEnum.Active, showActions: false },
    { name: 'Костыли', model: 'M5', size: 'M', empty: 2, occupied: 10, status: StatusEnum.Removed, showActions: false },
    { name: 'Костыли', model: 'M5', size: 'M', empty: 2, occupied: 10, status: StatusEnum.Active, showActions: false },
    { name: 'Костыли', model: 'M5', size: 'M', empty: 2, occupied: 10, status: StatusEnum.Active, showActions: false },
    { name: 'Костыли', model: 'M5', size: 'M', empty: 2, occupied: 10, status: StatusEnum.Active, showActions: false },
    { name: 'Костыли', model: 'M5', size: 'M', empty: 2, occupied: 10, status: StatusEnum.Active, showActions: false },
    { name: 'Костыли', model: 'M5', size: 'M', empty: 2, occupied: 10, status: StatusEnum.Active, showActions: false }
  ];
});

function toggleActions(item) {
  item.showActions = !item.showActions;
}

function editItem(item) {
  console.log("Edit", item);
}

function deleteItem(item) {
  console.log("Delete", item);
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
