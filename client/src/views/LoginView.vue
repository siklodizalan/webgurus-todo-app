<template>
  <h2 class="text-2xl font-bold text-center mb-8">Log in</h2>
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

    <!-- Submit Button -->
    <BaseButton 
        type="submit" 
        variant="primary"> 
        Log in 
    </BaseButton>
    <p v-if="errors.general" class="text-red-500 text-sm mt-1">
      {{ errors.general }}
    </p>
  </form>
  <BaseButton 
    type="button" 
    variant="text" 
    @click="navigateToRegister">
    Don't have an account? Register.
  </BaseButton>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import Cookies from "js-cookie";
import axios, { AxiosError } from "axios";
import BaseButton from "../components/BaseButton.vue";
import BaseInput from "../components/BaseInput.vue";
import UserService from "../service/UserService";
import { useUser } from "../composables/useUser";
import { validatePassword } from "../../../shared/utils/validationUtil.ts";

const { updateUser } = useUser();
const router = useRouter();

const form = ref({
  username: "",
  password: "",
});

const errors = ref({
  username: "",
  password: "",
  general: "",
});

async function submitForm() {
  errors.value = {
    username: "",
    password: "",
    general: "",
  };

  if (!form.value.username) {
    errors.value.username = "Username is required";
  }

  if (!validatePassword(form.value.password)) {
    errors.value.password = "Password must be at least 8 characters long, include a number, a lowercase, and an uppercase letter.";
  }

  if (!Object.values(errors.value).some((err) => err)) {
    try {
      const loginResponse = await UserService.loginUser(
        form.value.username,
        form.value.password
      );

      const user = loginResponse.userData;
      const token = loginResponse.token;
      Cookies.set("token", token, { expires: 7 });
      
      updateUser(user.name, user.profileImageUrl);
      navigateToHomePage();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        errors.value.general = err.response!.data.message;
      } else {
        errors.value.general = "Unexpected error: ";
      }
    }
  }
}

function navigateToRegister() {
  router.push("/register");
}

function navigateToHomePage() {
  router.push("/");
}
</script>
