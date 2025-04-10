<template>
  <v-container class="v-container">
    <!-- Карточка с кнопкой добавления клиента -->
    <v-card class="pa-4 mb-4">
      <v-card-title>Клиенты</v-card-title>
      <v-card-subtitle>
        Для того чтобы добавить нового клиента, нажмите на кнопку "Добавить нового клиента"
      </v-card-subtitle>
      <v-btn color="primary" class="mt-2" @click="openModal('add')">Добавить нового клиента</v-btn>
    </v-card>

    <!-- Поиск клиентов -->
    <v-text-field
      v-model="search"
      label="Поиск..."
      append-icon="mdi-magnify"
      class="mb-4"
      @input="searchClients"
    ></v-text-field>
    <!-- Таблица клиентов -->
    <v-data-table
      :headers="headers"
      :items="items.dataList"
      item-value="id"
    >
      <template v-slot:items.equipment="{ item }">
        <div v-if="item.equipment">
          {{ item.equipment.serialNum }} ({{ item.equipment.status }})
        </div>
        <div v-else>Нет оборудования</div>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn @click="goToDetails(item)">Подробнее</v-btn>
            <v-btn v-bind="props" icon="mdi-dots-vertical"></v-btn>
          </template>
          <v-list>
            <v-list-item @click="openModal('edit', item)">Редактировать</v-list-item>
            <v-list-item @click="openEquipmentModal(item)">Привязать оборудование</v-list-item>
            <v-list-item @click="deleteItem(item)">Удалить</v-list-item>
            <v-list-item @click="goToDetails(item)">Подробнее</v-list-item>
          </v-list>
        </v-menu>
      </template>
    </v-data-table>

    <!-- Модальное окно для добавления/редактирования клиента -->
    <v-dialog v-model="isShowModal" max-width="600px">
      <v-card>
        <v-card-title>
          {{ modalType === 'add' ? 'Добавить клиента' : 'Редактировать клиента' }}
        </v-card-title>
        <v-card-text>
          <v-form ref="clientForm" @submit.prevent="saveClient">
            <v-text-field
              v-model="editedItem.firstName"
              label="Имя"
              :rules="[required]"
              required
            ></v-text-field>
            <v-text-field
              v-model="editedItem.lastName"
              label="Фамилия"
              :rules="[required]"
              required
            ></v-text-field>
            <v-text-field
              v-model="editedItem.middleName"
              label="Отчество"
            ></v-text-field>
            <v-text-field
              v-model="editedItem.passportId"
              label="Паспорт"
              :rules="[required]"
              required
            ></v-text-field>
            <v-text-field
              v-model="editedItem.phoneNumber"
              label="Телефон"
              :rules="[required]"
              required
            ></v-text-field>
            <v-text-field
              v-model="editedItem.email"
              label="Email"
              :rules="[required, emailRule]"
              required
            ></v-text-field>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="closeModal">Отмена</v-btn>
          <v-btn color="blue darken-1" text type="submit">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Модальное окно для привязки оборудования -->
    <v-dialog v-model="isEquipmentModal" max-width="600px">
      <v-card>
        <v-card-title>Привязать оборудование</v-card-title>
        <v-card-text>
          <v-form @submit.prevent="attachEquipment">
            <v-select
              v-model="selectedEquipment.equipmentId"
              :items="equipments"
              item-title="serialNum"
              item-value="id"
              label="Выберите оборудование"
              :loading="isLoadingEquipments"
              clearable
              :rules="[equipmentRule]"
            >
              <template v-slot:item="{ item }">
                <v-list-item>
                  <v-list-item-title>{{ item.raw.serialNum }}</v-list-item-title>
                  <v-list-item-subtitle>Тип: {{ item.raw.type }}, Статус: {{ item.raw.status }}</v-list-item-subtitle>
                </v-list-item>
              </template>
            </v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn color="blue darken-1" text @click="isEquipmentModal = false">Отмена</v-btn>
          <v-btn color="blue darken-1" text @click="attachEquipment">Сохранить</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router'
import router from "@/router";
// Получаем базовый URL из переменной окружения
const baseUrl = import.meta.env.VITE_APP_API_URL;
// Состояния для модальных окон и данных
const search = ref('');
const isShowModal = ref(false);
const isEquipmentModal = ref(false);
const modalType = ref(''); // 'add' или 'edit'
const editedItem = ref({
  firstName: '',
  lastName: '',
  middleName: '',
  passportId: '',
  phoneNumber: '',
  email: ''
});
const selectedEquipment = ref({
  equipmentId: null,
  clientId: null
});
const items = ref([]);
const equipments = ref([]);
const isLoadingEquipments = ref(false);
const currentClientId = ref(null);

const required = (value) => !!value || 'Обязательное поле';
const emailRule = (value) => /.+@.+\..+/.test(value) || 'Введите корректный email';
const equipmentRule = (value) => value === null || 'Выберите оборудование';

const goToDetails = (item) => {
  console.log(item)
  router.push(`/details/${item.id}`)
}

// Таблица клиентов
const headers = [
  { title: 'Фамилия', key: 'lastName' },
  { title: 'Имя', key: 'firstName' },
  { title: 'Отчество', key: 'middleName' },
  { title: 'Телефон', key: 'phoneNumber' },
  { title: 'Email', key: 'email' },
  { title: 'Паспорт', key: 'passportId' },
  { title: 'Оборудование', key: 'equipment' },
  { title: 'Действия', key: 'actions', sortable: false }
];

// Загрузка списка клиентов с сервера
const fetchClients = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/Clients/list`);
    items.value = response.data;
  } catch (error) {
    console.error('Ошибка загрузки списка клиентов:', error);
  }
};

// Загрузка списка оборудования с сервера
const fetchEquipments = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/Equipments/list`);
    equipments.value = response.data;
  } catch (error) {
    console.error('Ошибка загрузки списка оборудования:', error);
    alert('Не удалось загрузить список оборудования. Пожалуйста, попробуйте позже.');
  }
};

// Поиск клиентов
const searchClients = async () => {
  if (search.value.trim() === '') {
    await fetchClients();
    return;
  }
  try {
    const response = await axios.post(`${baseUrl}/api/Clients/clientId`, { query: search.value });
    items.value = response.data;
  } catch (error) {
    console.error('Ошибка поиска клиентов:', error);
  }
};

// Открыть модальное окно для добавления/редактирования клиента
const openModal = (type, item = null) => {
  modalType.value = type;
  isShowModal.value = true;
  if (type === 'edit' && item) {
    editedItem.value = { ...item };
  } else {
    editedItem.value = {
      firstName: '',
      lastName: '',
      middleName: '',
      passportId: '',
      phoneNumber: '',
      email: ''
    };
  }
};

// Закрыть модальное окно
const closeModal = () => {
  isShowModal.value = false;
};

// Сохранить клиента (добавить или редактировать)
const saveClient = async () => {
  try {
    const form = document.querySelector('form');
    if (!form.reportValidity()) return;

    const clientData = {
      lastName: editedItem.value.lastName,
      firstName: editedItem.value.firstName,
      middleName: editedItem.value.middleName || '',
      passportId: editedItem.value.passportId,
      phoneNumber: editedItem.value.phoneNumber,
      email: editedItem.value.email
    };

    let response;
    if (modalType.value === 'add') {
      response = await axios.post(`${baseUrl}/api/Clients`, clientData);
      items.value.push(response.data);
    } else {
      response = await axios.put(`${baseUrl}/api/Clients${editedItem.value.id}`, clientData);
      const index = items.value.findIndex(item => item.id === editedItem.value.id);
      if (index !== -1) {
        items.value[index] = response.data;
      }
    }

    closeModal();
  } catch (error) {
    console.error('Ошибка сохранения данных клиента:', error);
    alert('Произошла ошибка при сохранении данных. Пожалуйста, попробуйте снова.');
  }
};

// Открыть модальное окно для привязки оборудования
const openEquipmentModal = (item) => {
  currentClientId.value = item.id;
  isEquipmentModal.value = true;
  fetchEquipments();
};

// Привязать оборудование к клиенту
const attachEquipment = async () => {
  if (!selectedEquipment.value.equipmentId) {
    alert('Пожалуйста, выберите оборудование.');
    return;
  }

  try {
    await axios.post(`${baseUrl}/api/ClientEquipment`, {
      clientId: currentClientId.value,
      equipmentId: selectedEquipment.value.equipmentId
    });

    // Обновляем список клиентов
    fetchClients();
    isEquipmentModal.value = false;
  } catch (error) {
    console.error('Ошибка привязки оборудования:', error);
    alert('Произошла ошибка при привязке оборудования. Пожалуйста, попробуйте снова.');
  }
};

// Удаление клиента
const deleteItem = async (item) => {
  if (!confirm('Вы уверены, что хотите удалить этого клиента?')) return;

  try {
    // Используйте clientId в параметрах запроса
    await axios.delete(`${baseUrl}/api/Clients/clientId`, {
      params: {
        clientId: item.id
      }
    });

    // Удалить клиента из списка
    items.value.dataList = items.value.dataList.filter(client => client.id !== item.id);
    alert('Клиент успешно удален!');
  } catch (error) {
    console.error('Ошибка удаления клиента:', error);
    alert('Произошла ошибка при удалении клиента. Пожалуйста, попробуйте снова.');
  }
};

// Загрузка данных при монтировании компонента
onMounted(() => {
  fetchClients();
});
</script>

<style scoped>

.v-card {
  background-color: var(--background-color);
  color: var(--text-color);
}
</style>
