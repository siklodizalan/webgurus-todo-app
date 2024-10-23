<template>
  <div>
    <div class="flex space-x-4 mb-4">
      <a href="https://vitejs.dev" target="_blank">
        <img src="/vite.svg" class="h-24 p-6 transition-filter duration-300 hover:drop-shadow-[0_0_2em_#646cffaa]" alt="Vite logo" />
      </a>
      <a href="https://vuejs.org/" target="_blank">
        <img src="./assets/vue.svg" class="h-24 p-6 transition-filter duration-300 hover:drop-shadow-[0_0_2em_#42b883aa]" alt="Vue logo" />
      </a>
    </div>
    <h1 class="text-2xl font-bold mb-4">To-Do List</h1>
  </div>
  
  <div v-if="isAddTodoPage">
    <AddTodo 
      @click="changeToAddTodoPage"
    />
  </div>
  <div v-else>
    <ToDoList 
      @click="changeToAddTodoPage"
    />
  </div>
</template>

<script setup lang="ts">
  import './assets/tailwind.css';
  import ToDoList from './views/TodoList.vue';
  import { ref } from 'vue';
  import AddTodo from './views/AddTodo.vue';

  const isAddTodoPage = ref<boolean>(false);

  const changeToAddTodoPage = () => {
      isAddTodoPage.value = !isAddTodoPage.value;
  };
</script>
