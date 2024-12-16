<template>
  <v-container>
    <div class="equipment-container">
      <div class="equipment-box">
        <h3>Оборудование</h3>
        <p>Для того чтобы добавить новое оборудование нажмите на кнопку "Добавить новое"</p>
        <v-btn @click="dialog = true" class="add-button">Добавить новое</v-btn>
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
          <span>Добавить оборудование</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row class="mb-4">
              <v-text-field
                id="name"
                v-model="name"
                placeholder="Наименование"
              />
            </v-row>
            <v-row>
              <v-text-field
                id="model"
                v-model="model"
                placeholder="Модель"
              />
            </v-row>
            <h2 class="mb-4">Размеры</h2>
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
          <v-btn class="cancel" @click="dialog = false">Отменить</v-btn>
          <v-btn class="save-btn" @click="saveChanges">Добавить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <div class="sort-container">
      <v-btn class="sort" href="../views/SortingView.vue">
        <img src="../assets/filter.png" alt=""> фильтр
      </v-btn>
    </div>

  </v-container>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
const emit = defineEmits()
const weeklyChange = ref(25)
const monthlyChange = ref(25)
const weeklyStat = ref(10)
const monthlyStat = ref(175)
const dialog = ref(false)
const name = ref('')
const model = ref('')
const sizes = ['S', 'M', 'L', 'XL']
const selectedSizes = ref([])
const saveChanges = () => {
  const newEquipment = {
    name: name.value,
    model: model.value,
    size: selectedSizes.value.join(', '),
    empty: 0,
    occupied: 0,
    status: 'Активен',
  }
  emit('addEquipment', newEquipment)
  dialog.value = false
}

</script>


<style scoped>
.sort-container {
  display: flex !important;
  justify-content: flex-end !important;
}
.sort{
  background-color: #ffffff;
  color: #1E1E1E;
  margin-bottom: 16px;
  font-weight: inherit;

}
.size-btn{
  background-color: #F1F5F9;
  color: black;
}
.v-card{
  background-color: white;
  color: black;
  border-radius: 30px !important;
}
.v-dialog{
  border-radius: 50px;
}
.sizes{
  background-color: red;
}

.equipment-container {
  max-width: 1000px;
  margin: 0 -10px;
  display: flex;
  gap: 100px;
  background-color: #F1F5F9;
  padding:40px 0px;
}
.v-card-title{
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
.save-btn{
  background-color: #1861FF;
  color: white;
}
.v-card-actions{
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

