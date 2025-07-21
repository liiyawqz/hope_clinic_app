<template>
  <v-container class="container">
    <!-- Search Input -->
    <v-row>
      <v-col cols="12" sm="6" md="4">
        <v-text-field
          v-model="search"
          label="Search"
          prepend-inner-icon="mdi-magnify"
          clearable
          variant="outlined"
        ></v-text-field>
      </v-col>
    </v-row>

    <!-- Data Table -->
    <v-data-table
      class="table"
      :headers="headers"
      :items="filteredItems"
      item-value="id"
      :items-per-page="10"
      :loading="loading"
      loading-text="Загрузка данных..."
    >
      <template #item.factReturn="{ item }">
        <span
          :style="{
            color:
              item.factReturn === 'не сдано'
                ? 'gray'
                : item.factReturn !== item.returnDateAt
                ? 'red'
                : '',
          }"
        >
          {{ item.factReturn }}
        </span>
      </template>
    </v-data-table>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { format } from 'date-fns'; // Import date-fns for date formatting
import api from '../axios';

const baseUrl = import.meta.env.VITE_APP_API_URL;
const search = ref('');
const rawItems = ref([]);
const loading = ref(true);

const headers = [
  { title: 'ФИО', key: 'fullName' },
  { title: 'Номер', key: 'phoneNumber' },
  { title: 'Оборудование', key: 'typeName' },
  { title: 'Модель', key: 'subType' },
  { title: 'Размер', key: 'size' },
  { title: 'Дата аренды', key: 'dateRentAt' },
  { title: 'Предварительная дата возврата', key: 'returnDateAt' },
  { title: 'Фактическая дата возврата', key: 'factReturn' },
  { title: 'Залог', key: 'pledge' },
];

const fetchData = async () => {
  try {
    loading.value = true;
    const response = await api.get('/api/ClientEquipment/list'); // Remove baseUrl since it's configured in api
    const list = response.data?.result?.dataList || [];

    rawItems.value = list.map((item) => ({
      id: item.id,
      fullName: `${item.lastName || ''} ${item.firstName || ''} ${item.middleName || ''}`.trim(),
      phoneNumber: item.phoneNumber || 'N/A',
      typeName: item.typeName || 'N/A',
      subType: item.subType || 'N/A',
      size: item.size || 'N/A',
      dateRentAt: item.dataRentAt
        ? format(new Date(item.dataRentAt), 'dd.MM.yyyy')
        : 'N/A',
      returnDateAt: item.returnDateAt
        ? format(new Date(item.returnDateAt), 'dd.MM.yyyy')
        : 'N/A',
      factReturn: item.isReturned
        ? item.returnDateAt
          ? format(new Date(item.returnDateAt), 'dd.MM.yyyy')
          : 'N/A'
        : 'не сдано',
      pledge: item.pledge ? `${item.pledge} сом` : 'N/A',
    }));
  } catch (error) {
    console.error('Ошибка загрузки:', error);
    // Optionally show a snackbar for user feedback
  } finally {
    loading.value = false;
  }
};

onMounted(fetchData);

const filteredItems = computed(() => {
  if (!search.value) return rawItems.value;
  return rawItems.value.filter((item) =>
    Object.values(item).some((val) =>
      String(val).toLowerCase().includes(search.value.toLowerCase())
    )
  );
});
</script>

<style>
.container {
  background-color: var(--background-color);
  color: var(--text-color);
  margin-left: 10px;
}

.mb-4 {
  margin-bottom: 50px !important;
}

.table {
  font-size: 14px;
  margin-top: 10px;
  min-width: 1350px;
  background-color: var(--card-color);
  color: var(--text-color);
  border-radius: 20px;
}

:deep(.v-data-table th:hover) {
  color: #1861ff !important;
}
</style>
