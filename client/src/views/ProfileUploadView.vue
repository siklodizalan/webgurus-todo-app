<template>
  <div class="flex flex-col items-center p-4 bg-white shadow-md rounded-lg">
    <img
      alt="Profile Picture"
      class="w-32 h-32 rounded-full object-cover mb-4 shadow-md"
      :src="imageUrl || placeholderImage" />

    <input
      type="file"
      accept="image/*"
      class="block w-full text-sm text-gray-600 bg-gray-100 border border-gray-300 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 p-2" 
      @change="onFileChange" />

    <BaseButton
      type="button"
      variant="primary"
      BaseButtonStyle="w-full mb-2"
      :disabled="!selectedFile"
      @click="uploadImage">
      Upload
    </BaseButton>

    <BaseButton
      type="button"
      variant="text"
      BaseButtonStyle="mb-4"
      @click="navigateToHomePage">
      Home Page
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import UserService from "../service/UserService";
import BaseButton from "../components/BaseButton.vue";
import { useUser } from "../composables/useUser";

const { updateUser } = useUser();

const selectedFile = ref<File | null>(null);
const imageUrl = ref<string | null>(null);
const placeholderImage = "https://via.placeholder.com/150";

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0] ?? null;
  if (file) {
    selectedFile.value = file;
    imageUrl.value = URL.createObjectURL(file);
  }
}

async function uploadImage() {
  if (!selectedFile.value) {
    return;
  }

  const newProfileImageUrl = await UserService.uploadImage(selectedFile.value);
  updateUser(undefined, newProfileImageUrl);
  navigateToHomePage();
}

const router = useRouter();

function navigateToHomePage() {
  router.push("/");
}
</script>
