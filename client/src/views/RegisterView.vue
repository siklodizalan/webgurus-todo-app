<template>
  <h2 class="text-2xl font-bold text-center mb-8">Register</h2>
  <form @submit.prevent="submitForm" class="space-y-6 mb-8">
    <!-- Username Field -->
    <BaseInput
      v-model="form.username"
      id="username"
      label="Username"
      placeholder="Enter your username" />
    <p v-if="errors.username" class="text-red-500 text-sm mt-1">
      {{ errors.username }}
    </p>

    <!-- Email Field -->
    <BaseInput
      v-model="form.email"
      id="email"
      label="Email"
      type="email"
      placeholder="Enter your email" />
    <p v-if="errors.email" class="text-red-500 text-sm mt-1">
      {{ errors.email }}
    </p>

    <!-- Password Field -->
    <BaseInput
      v-model="form.password"
      id="password"
      label="Password"
      type="password"
      placeholder="Enter your password" />
    <p v-if="errors.password" class="text-red-500 text-sm mt-1">
      {{ errors.password }}
    </p>

    <!-- Confirm Password Field -->
    <BaseInput
      v-model="form.confirmPassword"
      id="confirmPassword"
      label="Confirm Password"
      type="password"
      placeholder="Confirm your password" />
    <p v-if="errors.confirmPassword" class="text-red-500 text-sm mt-1">
      {{ errors.confirmPassword }}
    </p>

    <!-- Submit Button -->
    <BaseButton 
        type="submit" 
        variant="primary"> 
        Register 
    </BaseButton>
    <p v-if="errors.general" class="text-red-500 text-sm mt-1">
      {{ errors.general }}
    </p>
  </form>
  <BaseButton 
    type="button" 
    variant="text" 
    @click="navigateToLogin">
    Already have an account? Log in.
  </BaseButton>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Cookies from "js-cookie";
import { useRouter } from "vue-router";
import axios from "axios";
import BaseButton from "../components/BaseButton.vue";
import BaseInput from "../components/BaseInput.vue";
import UserService from "../services/UserService";
import { useUser } from "../composables/useUser";
import { validatePassword, validateEmail } from "../../../shared/utils/validationUtil.ts";

const { updateUser } = useUser();
const router = useRouter();

const form = ref({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const errors = ref({
  username: "",
  email: "",
  password: "",
  confirmPassword: "",
  general: "",
});

async function submitForm() {
  errors.value = {
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    general: "",
  };

  if (!form.value.username) {
    errors.value.username = "Username is required";
  }

  if (!validateEmail(form.value.email)) {
    errors.value.email = "Invalid email format.";
  }

  if (!validatePassword(form.value.password)) {
    errors.value.password = "Password must be at least 8 characters long, include a number, a lowercase, and an uppercase letter.";
  }

  if (!validatePassword(form.value.confirmPassword)) {
    errors.value.confirmPassword = "Password must be at least 8 characters long, include a number, a lowercase, and an uppercase letter.";
  }

  if (form.value.password !== form.value.confirmPassword) {
    errors.value.confirmPassword = "Passwords do not match";
  }

  if (!Object.values(errors.value).some((err) => err)) {
    try {
      const registerResponse = await UserService.registerUser(
        form.value.username,
        form.value.email,
        form.value.password,
        form.value.confirmPassword
      );
      
      const user = registerResponse.userData;
      const token = registerResponse.token;
      Cookies.set("token", token, { expires: 7 });

      updateUser(user);
      navigateToUploadProfilePicture();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        errors.value.general = err.response!.data.message;
      } else {
        errors.value.general = "Unexpected error: ";
      }
    }
  }
}

function navigateToLogin() {
  router.push("/login");
}

function navigateToUploadProfilePicture() {
  router.push("/upload");
}
</script>
