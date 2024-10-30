import { createRouter, createWebHistory } from "vue-router";
import Cookies from "js-cookie";
import HomePage from "../views/HomeView.vue";
import RegisterPage from "../views/RegisterView.vue";
import LoginPage from "../views/LoginView.vue";
import AddTodoPage from "../views/AddTodoView.vue";
import ProfileUploadPage from "../views/ProfileUploadView.vue";
import UserListView from "../views/UserListView.vue";

const routes = [
  { path: "/", component: HomePage, meta: { requiresAuth: true } },
  { path: "/register", component: RegisterPage },
  { path: "/login", component: LoginPage },
  { path: "/add", component: AddTodoPage, meta: { requiresAuth: true } },
  {
    path: "/upload",
    component: ProfileUploadPage,
    meta: { requiresAuth: true },
  },
  { path: "/dashboard", component: UserListView, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = Cookies.get("token");
  if (to.matched.some((route) => route.meta.requiresAuth)) {
    if (token) {
      next();
    } else {
      next("/login");
    }
  } else {
    next();
  }
});

export default router;
