<template>
    <h2 class="text-2xl font-bold text-center mb-8">Log in</h2>
    <form @submit.prevent="submitForm" class="space-y-6 mb-8">
        <!-- Username Field -->
        <Input v-model="form.username" id="username" label="Username" placeholder="Enter your username" />
        <p v-if="errors.username" class="text-red-500 text-sm mt-1">{{ errors.username }}</p>

        <!-- Password Field -->
        <Input v-model="form.password" id="password" label="Password" type="password"
            placeholder="Enter your password" />
        <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>

        <!-- Submit Button -->
        <Button type="submit" variant="primary">
            Log in
        </Button>
        <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.general }}</p>
    </form>
    <Button type="button" variant="text" @click="navigateToRegister">
        Don't have an account? Register.
    </Button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import Button from '../components/Button.vue';
import Input from '../components/Input.vue';
import { useRouter } from 'vue-router';
import UserService from '../service/UserService';
import { useUser } from '../composables/useUser';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:3000';

const { updateUser } = useUser();

const form = ref({
    username: '',
    password: '',
});

const errors = ref({
    username: '',
    password: '',
    general: ''
});

async function submitForm() {
    errors.value = {
        username: '',
        password: '',
        general: ''
    };

    if (!form.value.username) {
        errors.value.username = 'Username is required';
    }
    if (!form.value.password) {
        errors.value.password = 'Password is required';
    } else if (form.value.password.length < 6) {
        errors.value.password = 'Password must be at least 6 characters long';
    }

    if (!Object.values(errors.value).some(err => err)) {
        const loginResponse = await UserService.loginUser(form.value.username, form.value.password);
        const user = loginResponse.userData;
        const token = loginResponse.token;
        Cookies.set('token', token, { expires: 7 });
        updateUser(user.name, user.profileImageUrl);
        navigateToHomePage();
    }

}

const router = useRouter();

function navigateToRegister() {
    router.push('/register');
}

function navigateToHomePage() {
    router.push('/');
}
</script>