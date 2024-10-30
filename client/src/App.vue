<template>
  <div>
    <AppBar />
  </div>
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView } from "vue-router";
import Cookies from "js-cookie";
import "./assets/tailwind.css";
import AppBar from "./components/AppBar.vue";
import { useUser } from "./composables/useUser";

onMounted(() => {
  const token = Cookies.get("token");
  if (token) {
    const { initializeUser } = useUser();
    initializeUser();
  }
});
</script>
