<template>
  <v-app>
    <v-container>
      <v-card class="pa-4">
        <h2 class="font-weight-bold mb-4">Учет арендованных товаров</h2>

        <v-text-field
          v-model="search"
          label="Поиск..."
          prepend-inner-icon="mdi-magnify"
          class="mb-4"
          hide-details
        />

        <v-data-table
          :headers="headers"
          :items="filteredItems"
          :items-per-page="10"
          class="elevation-1"
          item-value="id"
        >
          <template v-slot:item.zalog="{ item }">
            {{ item.zalog ? `${item.zalog} сом` : '' }}
          </template>
        </v-data-table>
      </v-card>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'

const search = ref('')

const headers = [
  { title: 'ФИО', key: 'fio' },
  { title: 'Оборудование', key: 'equipment' },
  { title: 'Модель', key: 'model' },
  { title: 'Размер', key: 'size' },
  { title: 'Номер аренды', key: 'rentNumber' },
  { title: 'Дата аренды', key: 'startDate' },
  { title: 'Предварительная дата возврата', key: 'expectedReturn' },
  { title: 'Дата возврата (факт)', key: 'actualReturn' },
  { title: 'Залог', key: 'zalog' },
]

const items = ref(
  Array.from({ length: 100 }).map((_, i) => ({
    id: i + 1,
    fio: 'Б.А.С',
    equipment: 'Костыль',
    model: 'X5',
    size: 'S',
    rentNumber: '01.01.2024',
    startDate: '01.01.2024',
    expectedReturn: '01.02.2024',
    actualReturn: i % 3 === 2 ? null : '01.02.2024',
    zalog: i % 4 === 0 ? 5000 : null,
  }))
)

const filteredItems = computed(() => {
  if (!search.value) return items.value
  return items.value.filter(item =>
    Object.values(item).some(val =>
      String(val).toLowerCase().includes(search.value.toLowerCase())
    )
  )
})
</script>

<style>
.v-data-table {
  font-size: 14px;
}
</style>
