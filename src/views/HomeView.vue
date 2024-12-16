<template>
  <v-container class="dashboard">
    <div class="dashboard-analysis">
      <v-col cols="auto" class="d-flex align-center">
        <v-card class="text-center pa-16 bg-white">
        <div class="d-flex flex-column align-center">
          <div class="status">
            <h2 class="blue--text">{{taken}}</h2>
            <h2 class="blue--text2">{{freeEquip}}</h2>
          </div>
          <div class="status">
            <p class="subtitle-1">Занято</p>
            <p class="subtitle-1">Свободно</p>
          </div>
        </div>
        </v-card>
      </v-col>
    <v-row justify="end" class="mb-5">
      <v-col cols="12" md="6">
        <v-card class="pa-4 bg-white">
          <v-date-picker class="bg-white" v-model="selectedDate" locale="ru"></v-date-picker>
        </v-card>
      </v-col>
    </v-row>
    </div>

    <v-row>
      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <h3 class="subtitle-1 text-center">Часто используемые</h3>
          <v-table dense>
            <template v-slot:default>
              <thead>
              <tr>
                <th>Оборудование</th>
                <th>Количество</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in usageData" :key="index">
                <td>{{ item.name }}</td>
                <td>
                  <v-progress-linear
                    :value="item.count"
                    height="10"
                    color="blue"
                  ></v-progress-linear>
                </td>
              </tr>
              </tbody>
            </template>
          </v-table>
        </v-card>
      </v-col>
      <v-col cols="12" md="6">
        <v-card class="pa-4">
          <h3 class="subtitle-1 text-center">Средний срок использ.</h3>
          <v-table dense>
            <template v-slot:default>
              <thead>
              <tr>
                <th>Оборудование</th>
                <th>Средний срок (мес.)</th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in averageUsageData" :key="index">
                <td>{{ item.name }}</td>
                <td>
                  <v-progress-linear
                    :value="item.duration * 20"
                    height="10"
                    color="green"
                  ></v-progress-linear>
                </td>
              </tr>
              </tbody>
            </template>
          </v-table>
        </v-card>
      </v-col>
    </v-row>

    <v-row justify="center" class="mt-5">
      <v-col cols="12" md="4" class="text-center">
        <v-card class="pa-4">
          <img src="@/assets/crutch.png" alt="Костыли" class="w-100" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script setup>
import { ref } from 'vue';
const taken = 67;
const freeEquip = 67;
const selectedDate = ref(new Date());

const usageData = ref([
  { name: 'Костыли', count: 120 },
  { name: 'Ходунки', count: 100 },
  { name: 'К-М', count: 75 },
  { name: 'К-а', count: 60 },
  { name: 'etc', count: 50 },
]);

const averageUsageData = ref([
  { name: 'Костыли', duration: 5 },
  { name: 'Ходунки', duration: 4 },
  { name: 'К-М', duration: 3 },
  { name: 'К-а', duration: 2 },
  { name: 'etc', duration: 1 },
]);
</script>

<style scoped>
.dashboard {
  background-color: #F1F5F9;
  padding: 20px;
}

.dashboard-analysis {
  display: flex;
  //justify-content: space-between;
  //gap: 20px;
}
.text-center{
  border-radius: 48px;
}
.status {
  display: flex;
  flex-direction: row;
  margin-right: 20px;
  gap: 20px;
}
.blue--text, .blue--text2{
  display: inline-flex;
  border-radius: 26px;
  background-color: #82A9FE;
  color: #fff;
  font-size: 60px;
  font-weight: bold;
  padding: 0px 25px 0px 25px;
  margin: 0px 10px 0px 10px;
}
.blue--text2{
  background-color: #1861FF;
}
.subtitle-1{
  display: flex;

}

</style>
