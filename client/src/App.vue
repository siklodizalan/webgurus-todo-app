<template>
  <div>
    <AppBar />
  </div>
  <RouterView />
</template>

<script setup lang="ts">
import "./assets/tailwind.css";
import AppBar from "./components/AppBar.vue";
import { RouterView } from "vue-router";
</script>
