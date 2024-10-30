<template>
    <tr class="hover:bg-gray-100 border-b">
        <td 
            v-for="field in userFields" 
            class="px-4 py-2 text-sm text-gray-700"
            :key="field">
            {{ field }}
        </td>
        <td class="px-4 py-2 text-center">
            <BaseCheckbox
                v-model="isAdmin"
                class="h-4 w-4 text-blue-600"
                @change="toggleUserRole"
            />
            <span v-if="isUpdatingRole" class="text-sm text-gray-500">Updating...</span>
        </td>
        <td class="px-4 py-2 text-center">
        <BaseButton
            type="button"
            variant="text"
            class="text-red-600 hover:text-red-800"
            @click="deleteUser">
            🗑️
        </BaseButton>
        <span v-if="isDeleting" class="text-sm text-gray-500">Deleting...</span>
        </td>
    </tr>
</template>
  
<script setup lang="ts">
    import { computed, ref } from "vue";
    import type { UserData } from "../models/User";
    import BaseCheckbox from "./BaseCheckbox.vue";
    import BaseButton from "./BaseButton.vue";

    interface Props {
        user: UserData;
        isUpdatingRole: boolean;
        isDeleting: boolean;
    }
    
    const props = defineProps<Props>();
    const emit = defineEmits(["roleChanged", "userDeleted"]);

    const isAdmin = ref(props.user.role === "ADMIN");
    
    const userFields = computed(() => [props.user._id, props.user.name, props.user.email, props.user.role]);

    const toggleUserRole = async () => {
        const newRole = props.user.role === "USER" ? "ADMIN" : "USER";

        try {
            emit("roleChanged", { userId: props.user._id, newRole });
            props.user.role = newRole;
        } catch (error) {
            console.error("Error updating user role:", error);
        }
    };

    const deleteUser = async () => {
        try {
            emit("userDeleted", props.user._id);
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };
</script>
  