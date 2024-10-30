<template>
  <nav class="bg-gray-800 fixed top-0 left-0 w-full p-4 shadow-md z-50">
    <div class="container mx-auto flex justify-between items-center">
      <!-- Left Side -->
      <div class="mt-4">
        <h1 class="text-2xl font-bold mb-4">To-Do List App</h1>
      </div>

      <!-- Right Side -->
      <div>
        <ProfileComponent
          v-if="user.name"
          :username="user.name"
          :userRole="user.role"
          :profileImageUrl="user.profileImageUrl || placeholderImage" />
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import ProfileComponent from "./ProfileComponent.vue";
import { useUser } from "../composables/useUser";

const placeholderImage = "https://via.placeholder.com/150";

const { user } = useUser();
</script>
