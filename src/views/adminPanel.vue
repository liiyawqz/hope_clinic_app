<template>
  <v-container>
    <!-- Create User Button -->
    <v-row>
      <v-col cols="12">
        <v-btn color="success" @click="openCreateUserDialog" class="mb-4">
          Create User
        </v-btn>
      </v-col>
    </v-row>

    <!-- Autocomplete -->
    <v-row>
      <v-col cols="12">
        <v-autocomplete
          v-model="selectedUser"
          label="Select User"
          :items="items"
          item-title="email"
          item-value="id"
          :loading="loading"
          @update:model-value="loadUserDetails"
          clearable
        ></v-autocomplete>
      </v-col>
    </v-row>

    <!-- User Details Table -->
    <v-row v-if="selectedUser">
      <v-col cols="12">
        <v-table>
          <thead>
          <tr>
            <th>Email</th>
            <th>Current Role</th>
            <th>New Role</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            <td>{{ userDetails.email }}</td>
            <td>{{ userDetails.roles.join(', ') }}</td>
            <td>
              <v-select
                v-model="newRole"
                :items="availableRoles"
                label="Select New Role"
                clearable
              ></v-select>
            </td>
            <td>
              <v-btn
                color="primary"
                :disabled="!newRole || updating"
                :loading="updating"
                @click="updateRole"
              >
                Update Role
              </v-btn>
              <v-btn
                color="error"
                :disabled="updating"
                :loading="deleting"
                @click="deleteUser"
                class="ml-2"
              >
                Delete User
              </v-btn>
            </td>
          </tr>
          </tbody>
        </v-table>
      </v-col>
    </v-row>

    <!-- Create User Dialog -->
    <v-dialog v-model="showCreateDialog" max-width="500px">
      <v-card>
        <v-card-title>Create New User</v-card-title>
        <v-card-text>
          <v-form v-model="validForm" @submit.prevent="createUser">
            <v-text-field
              v-model="newUser.email"
              label="Email"
              :rules="[v => !!v || 'Email is required', v => /.+@.+\..+/.test(v) || 'Email must be valid']"
              required
            ></v-text-field>
            <v-text-field
              v-model="newUser.password"
              label="Password"
              type="password"
              :rules="[v => !!v || 'Password is required', v => v.length >= 6 || 'Password must be at least 6 characters']"
              required
            ></v-text-field>
            <v-select
              v-model="newUser.role"
              :items="availableRoles"
              label="Role"
              :rules="[v => !!v || 'Role is required']"
              required
            ></v-select>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="grey" text @click="showCreateDialog = false">Cancel</v-btn>
          <v-btn
            color="success"
            text
            :disabled="!validForm || creating"
            :loading="creating"
            @click="createUser"
          >
            Create
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar for Feedback -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.message }}
      <template #actions>
        <v-btn color="white" variant="text" @click="snackbar.show = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import api from '../axios';

const baseUrl = import.meta.env.VITE_APP_API_URL;

// State
const items = ref([]); // List of users for autocomplete
const selectedUser = ref(null); // Selected user ID
const userDetails = ref({ email: '', roles: [] }); // Selected user's details
const newRole = ref(null); // New role to assign
const availableRoles = ref(['Admin', 'User', 'Editor']); // Adjust based on your roles
const loading = ref(false); // Loading state for fetching users
const updating = ref(false); // Loading state for updating role
const deleting = ref(false); // Loading state for deleting user
const creating = ref(false); // Loading state for creating user
const showCreateDialog = ref(false); // Dialog visibility
const validForm = ref(false); // Form validation state
const newUser = ref({ email: '', password: '', role: '' }); // New user data
const snackbar = ref({ show: false, message: '', color: 'success' });

// Fetch users for autocomplete
const fetchUsers = async () => {
  try {
    loading.value = true;
    const response = await api.get('/admin/users');
    items.value = response.data; // Assuming response.data is an array of { id, email, roles }
  } catch (error) {
    snackbar.value = {
      show: true,
      message: 'Failed to fetch users: ' + (error.response?.data || error.message),
      color: 'error',
    };
  } finally {
    loading.value = false;
  }
};

// Load selected user's details
const loadUserDetails = async (userId) => {
  if (!userId) {
    userDetails.value = { email: '', roles: [] };
    newRole.value = null;
    return;
  }

  const user = items.value.find((item) => item.id === userId);
  if (user) {
    userDetails.value = { email: user.email, roles: user.roles };
  }
};

// Update user's role (remove old role, assign new role)
const updateRole = async () => {
  if (!newRole.value || !userDetails.value.roles.length) return;

  try {
    updating.value = true;

    // Remove current role (assuming single role for simplicity)
    const removeRoleRequest = {
      email: userDetails.value.email,
      role: userDetails.value.roles[0],
    };
    await api.post('/admin/remove-role', removeRoleRequest);

    // Assign new role
    const assignRoleRequest = {
      email: userDetails.value.email,
      role: newRole.value,
    };
    await api.post('/admin/assign-role', assignRoleRequest);

    // Update local user details
    userDetails.value.roles = [newRole.value];
    items.value = items.value.map((item) =>
      item.id === selectedUser.value ? { ...item, roles: [newRole.value] } : item
    );

    snackbar.value = {
      show: true,
      message: 'Role updated successfully',
      color: 'success',
    };
  } catch (error) {
    snackbar.value = {
      show: true,
      message: 'Failed to update role: ' + (error.response?.data || error.message),
      color: 'error',
    };
  } finally {
    updating.value = false;
  }
};

// Delete user
const deleteUser = async () => {
  try {
    deleting.value = true;
    const deleteRequest = { email: userDetails.value.email };
    await api.post('/admin/delete-user', deleteRequest);

    // Remove user from items and clear selection
    items.value = items.value.filter((item) => item.id !== selectedUser.value);
    selectedUser.value = null;
    userDetails.value = { email: '', roles: [] };
    newRole.value = null;

    snackbar.value = {
      show: true,
      message: 'User deleted successfully',
      color: 'success',
    };
  } catch (error) {
    snackbar.value = {
      show: true,
      message: 'Failed to delete user: ' + (error.response?.data || error.message),
      color: 'error',
    };
  } finally {
    deleting.value = false;
  }
};

// Open create user dialog
const openCreateUserDialog = () => {
  newUser.value = { email: '', password: '', role: '' }; // Reset form
  showCreateDialog.value = true;
};

// Create new user
const createUser = async () => {
  if (!validForm.value) return;

  try {
    creating.value = true;
    const createRequest = {
      email: newUser.value.email,
      password: newUser.value.password,
      role: newUser.value.role,
    };
    await api.post('/admin/create-user', createRequest);

    // Refresh user list
    await fetchUsers();

    // Close dialog and show success message
    showCreateDialog.value = false;
    snackbar.value = {
      show: true,
      message: 'User created successfully',
      color: 'success',
    };
  } catch (error) {
    snackbar.value = {
      show: true,
      message: 'Failed to create user: ' + (error.response?.data || error.message),
      color: 'error',
    };
  } finally {
    creating.value = false;
  }
};

// Initialize: Fetch users on component mount
fetchUsers();
</script>
