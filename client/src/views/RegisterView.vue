<template>
    <h2 class="text-2xl font-bold text-center mb-8">Register</h2>
    <form @submit.prevent="submitForm" class="space-y-6 mb-8">
        <!-- Username Field -->
        <Input
            v-model="form.username"
            id="username"
            label="Username"
            placeholder="Enter your username"
        />
        <p v-if="errors.username" class="text-red-500 text-sm mt-1">{{ errors.username }}</p>

        <!-- Email Field -->
        <Input
            v-model="form.email"
            id="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
        />
        <p v-if="errors.email" class="text-red-500 text-sm mt-1">{{ errors.email }}</p>

        <!-- Password Field -->
        <Input
            v-model="form.password"
            id="password"
            label="Password"
            type="password"
            placeholder="Enter your password"
        />
        <p v-if="errors.password" class="text-red-500 text-sm mt-1">{{ errors.password }}</p>

        <!-- Confirm Password Field -->
        <Input
            v-model="form.confirmPassword"
            id="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
        />
        <p v-if="errors.confirmPassword" class="text-red-500 text-sm mt-1">{{ errors.confirmPassword }}</p>

        <!-- Submit Button -->
        <Button type="submit" variant="primary" >
            Register
        </Button>
    </form>
    <Button type="button" variant="text" @click="navigateToLogin">
        Already have an account? Log in.
    </Button>
</template>
  
  <script setup lang="ts">
    import { ref } from 'vue';
    import Button from '../components/Button.vue';
    import Input from '../components/Input.vue';
    import { useRouter } from 'vue-router';
    import UserService from '../service/UserService';
    import Cookies from 'js-cookie';
    import { useUser } from '../composables/useUser';

    const { updateUser } = useUser();
  
    const form = ref({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    
    const errors = ref({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    
    async function submitForm() {
        errors.value = {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
        };
    
        if (!form.value.username) {
        errors.value.username = 'Username is required';
        }
        if (!form.value.email) {
        errors.value.email = 'Email is required';
        } else if (!validateEmail(form.value.email)) {
        errors.value.email = 'Invalid email format';
        }
        if (!form.value.password) {
        errors.value.password = 'Password is required';
        } else if (form.value.password.length < 6) {
        errors.value.password = 'Password must be at least 6 characters long';
        }
        if (form.value.password !== form.value.confirmPassword) {
        errors.value.confirmPassword = 'Passwords do not match';
        }
    
        if (!Object.values(errors.value).some(err => err)) {
            const registerResponse = await UserService.registerUser(form.value.username, form.value.email, form.value.password, form.value.confirmPassword);
            const user = registerResponse.userData;
            
            const token = registerResponse.token;
            Cookies.set('token', token, { expires: 7 });
            updateUser(user.name, user.profileImageUrl);
            navigateToUploadProfilePicture()
        }
    }
    
    function validateEmail(email: string): boolean {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    const router = useRouter();

    function navigateToLogin() {
        router.push('/login');
    }

    function navigateToUploadProfilePicture() {
    router.push('/upload');
  }
</script>
  