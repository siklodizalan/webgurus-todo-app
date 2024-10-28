<template>
  <nav class="bg-gray-800 fixed top-0 left-0 w-full p-4 shadow-md z-50">
    <div class="container mx-auto flex justify-between items-center">
      <!-- Left Side -->
      <div class="flex space-x-4">
        <a href="https://vitejs.dev" target="_blank" class="group">
          <img
            src="/vite.svg"
            alt="Vite logo"
            class="h-12 p-2 transition-filter duration-300 group-hover:drop-shadow-[0_0_2em_#646cffaa]" />
        </a>
        <a href="https://vuejs.org/" target="_blank" class="group">
          <img
            src="../assets/vue.svg"
            alt="Vue logo"
            class="h-12 p-2 transition-filter duration-300 group-hover:drop-shadow-[0_0_2em_#42b883aa]" />
        </a>
      </div>
      <!-- Middle -->
      <div class="mt-4">
        <h1 class="text-2xl font-bold mb-4">To-Do List App</h1>
      </div>

      <!-- Right Side -->
      <div>
        <ProfileComponent
          v-if="user.name"
          :username="user.name"
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
