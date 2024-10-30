<template>
    <div class="p-4 bg-white rounded-lg shadow-md">
        <div class="flex justify-between items-center mb-4">
            <h2 class="text-xl font-semibold text-gray-800">All Users</h2>
            <BaseButton 
                type="button"
                variant="primary"
                @click="navigateHome">
                Back Home
            </BaseButton>
        </div>

        <div v-if="loading" class="text-gray-500">Loading...</div>
        <div v-if="error" class="text-red-500">{{ error }}</div>
    
        <table v-if="!loading && !error" class="w-full border border-gray-200 rounded-lg">
            <thead>
                <tr>
                    <th 
                        v-for="header in headers"
                        class="px-4 py-2 text-sm font-medium text-gray-600"
                        :key="header">
                        {{ header }}
                    </th>
                    <th class="px-4 py-2"></th>
                </tr>
            </thead>
            <tbody>
                <UserListItem 
                    v-for="user in users" 
                    :key="user._id" 
                    :user="user" 
                    :is-updating-role="updatingUserIds.includes(user._id)"
                    :is-deleting="deletingUserIds.includes(user._id)"
                    @roleChanged="updateUserRole"
                    @userDeleted="deleteUser" />
            </tbody>
        </table>
    </div>
</template>
  
<script setup lang="ts">
    import { ref, onMounted } from "vue";
    import UserService from "../services/UserService";
    import UserListItem from "../components/UserListItem.vue";
    import type { RoleChangeRequest, UserData } from "../models/User";
    import userService from "../services/UserService";
    import { useRouter } from "vue-router";
    import BaseButton from "../components/BaseButton.vue";
    
    const users = ref<UserData[]>([]);
    const loading = ref(true);
    const error = ref<string | null>(null);
    const headers = ['ID', 'Name', 'Email', 'Role', 'Admin', 'Delete User'];
    const updatingUserIds = ref<string[]>([]);
    const deletingUserIds = ref<string[]>([]);
    const router = useRouter();
    
    const fetchUsers = async () => {
        loading.value = true;
        error.value = null;
        try {
            users.value = await UserService.fetchAllUsers();
        } catch (err) {
            error.value = "Failed to load users.";
            console.error("Error fetching users:", err);
        } finally {
            loading.value = false;
        }
    };

    const updateUserRole = async ({ userId, newRole }: RoleChangeRequest) => {
        try {
            updatingUserIds.value.push(userId);
            await userService.updateUserRole(userId, newRole);
            updatingUserIds.value = updatingUserIds.value.filter(id => id !== userId);
        } catch (err) {
            console.error("Error updating user:", err);
        }
    };

    const deleteUser = async (userId: string) => {
        try {
            deletingUserIds.value.push(userId);
            await userService.deleteUser(userId);
            deletingUserIds.value = deletingUserIds.value.filter(id => id !== userId);
            fetchUsers();
        } catch (err) {
            console.error("Error deleting user:", err);
        }
    };

    const navigateHome = () => {
        router.push("/");
    };
    
    onMounted(fetchUsers);
</script>
  