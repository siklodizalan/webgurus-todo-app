import { ref, watch } from 'vue';
import Cookies from 'js-cookie';
import UserService from '../service/UserService';

const API_URL = 'http://localhost:3000';

const user = ref({
    name: null as string | null,
    profileImageUrl: null as string | null,
});

export function useUser() {
    function logoutUser() {
        user.value.name = null;
        user.value.profileImageUrl = null;
        Cookies.remove('token');
        window.location.href = "/login";
    }

    function updateUser(newUsername?: string, newProfileImageUrl?: string) {
        if (newUsername !== undefined) {
            user.value.name = newUsername;
        }

        if (newProfileImageUrl !== undefined) {
            user.value.profileImageUrl = newProfileImageUrl;
        }
    }

    async function initializeUser() {
        const profileResponse = await UserService.getUserData();
        const userData = profileResponse.userData;
        user.value.name = userData.name;
        user.value.profileImageUrl = userData.profileImageUrl;
    }

    return {
        user,
        logoutUser,
        updateUser,
        initializeUser
    };
}
