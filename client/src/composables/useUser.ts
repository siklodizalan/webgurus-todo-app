import { ref } from "vue";
import Cookies from "js-cookie";
import { useRouter } from "vue-router";
import UserService from "../service/UserService";

const user = ref({
  name: null as string | null,
  profileImageUrl: null as string | null,
});

export function useUser() {
  const router = useRouter();

  function logoutUser() {
    user.value.name = null;
    user.value.profileImageUrl = null;
    Cookies.remove("token");
    router.push("/login");
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

  async function deleteUser() {
    await UserService.deleteUser();
    logoutUser();
  }

  return {
    user,
    logoutUser,
    updateUser,
    initializeUser,
    deleteUser,
  };
}
