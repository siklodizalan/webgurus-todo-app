<template>
  <div class="relative" @mouseleave="closeDropdown">
    <div
      class="flex items-center cursor-pointer p-2 bg-gray-200 rounded-md shadow hover:bg-gray-300"
      @click="toggleDropdown">
      <img
        alt="Profile Picture"
        class="h-10 w-10 rounded-full object-cover mr-2" 
        :src="profileImageUrl" />
      <span class="text-gray-700">Welcome back, {{ username }}</span>
    </div>
    <div class="h-2"></div>
    <div
      v-if="isDropdownOpen"
      class="absolute right-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
      <BaseButton
        type="button"
        variant="text"
        buttonStyle="w-full text-left text-sm text-red-600"
        @click="logoutUser">
        Logout
      </BaseButton>
      <BaseButton
        type="button"
        variant="text"
        buttonStyle="w-full text-left text-sm text-gray-700"
        @click="getToUploadProfilePicture">
        Upload Profile Picture
      </BaseButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import BaseButton from "./BaseButton.vue";
import { useUser } from "../composables/useUser";

const isDropdownOpen = ref(false);
const router = useRouter();
const { logoutUser } = useUser();

interface Props {
  username: string;
  profileImageUrl: string;
}

defineProps<Props>();

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
}

function closeDropdown() {
  isDropdownOpen.value = false;
}

function getToUploadProfilePicture() {
  router.push("/upload");
}
</script>
