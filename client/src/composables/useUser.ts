import { ref } from "vue";
import Cookies from "js-cookie";
import { useRouter } from "vue-router";
import UserService from "../services/UserService";
import { Role, UserData } from "../models/User";

const user = ref({
  name: null as string | null,
  role: "VISITOR" as Role,
  profileImageUrl: null as string | null,
});

export function useUser() {
  const router = useRouter();

  function logoutUser() {
    user.value.name = null;
    user.value.role = "VISITOR";
    user.value.profileImageUrl = null;
    Cookies.remove("token");
    router.push("/login");
  }

  function updateUser(newUser: UserData) {
    if (user !== undefined) {
      user.value.name = newUser.name;
      user.value.role = newUser.role;
      user.value.profileImageUrl = newUser.profileImageUrl;
    }
  }

  async function initializeUser() {
    const profileResponse = await UserService.getUserData();
    const userData = profileResponse.userData;
    user.value.name = userData.name;
    user.value.role = userData.role;
    user.value.profileImageUrl = userData.profileImageUrl;
  }

  async function deleteUser() {
    await UserService.deleteOwnAccount();
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
