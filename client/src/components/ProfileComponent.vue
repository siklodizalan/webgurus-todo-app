<template>
    <div class="relative" @mouseleave="closeDropdown">
      <div
        class="flex items-center cursor-pointer p-2 bg-gray-200 rounded-md shadow hover:bg-gray-300"
        @click="toggleDropdown"
      >
        <img
          :src="profileImageUrl"
          alt="Profile Picture"
          class="h-10 w-10 rounded-full object-cover mr-2"
        />
        <span class="text-gray-700">Welcome back, {{ username }}</span>
      </div>
      <div class="h-2"> </div>
      <div
        v-if="isDropdownOpen"
        class="absolute right-0 w-48 bg-white border border-gray-200 rounded-md shadow-lg"
      >
        <button
          @click="logoutUser"
          class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
        >
          Logout
        </button>
        <button
          @click="getToUploadProfilePicture"
          class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Upload Profile Picture
        </button>
      </div>

    </div>
</template>
   
<script lang="ts" setup>
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import { useUser } from "../composables/useUser";
  
  const props = defineProps<{
    username: string;
    profileImageUrl: string;
  }>();
  
  const isDropdownOpen = ref(false);
  const router = useRouter();
  
  function toggleDropdown() {
    isDropdownOpen.value = !isDropdownOpen.value;
  }
  
  function closeDropdown() {
    isDropdownOpen.value = false;
  }
  
  const { logoutUser } = useUser();
  
  function getToUploadProfilePicture() {
    router.push('/upload');
  }
</script>
  