<template>
  <h1 class="text-2xl font-bold mb-4">Your To-Dos</h1>
  <BaseButton
    type="button"
    variant="primary"
    buttonStyle="mb-4"
    @click="navigateToAddTodoPage">
    Add New To-Do
  </BaseButton>
  <div class="flex items-center mb-4">
    <div class="mr-4">
      <BaseInput
        v-model="searchTerm"
        type="text"
        placeholder="Search for a to-do"
        inputStyle="mr-4" 
        @enter="searchTodos" />
    </div>
    <BaseButton
      type="button"
      variant="primary"
      @click="searchTodos">
      Search
    </BaseButton>
  </div>

  <PriorityCheckmarks @priorityCheck="priorityFilter" />
  <span v-if="todos.length === 0">
    There are no to-do's with theese filters.
  </span>
  <ul class="divide-y divide-gray-200">
    <ListItem
      v-for="todo in todos"
      :key="todo._id"
      :text="todo.name"
      :completed="todo.completed"
      :id="todo._id"
      :priority="todo.priority"
      @onUpdate="updateTodoStatus(todo._id, $event)"
      @onDelete="removeTodo(todo._id)" />
  </ul>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import BaseButton from "../components/BaseButton.vue";
import ListItem from "../components//ToDoListItem.vue";
import BaseInput from "../components/BaseInput.vue";
import TodoService from "../services/TodoService";
import type Todo from "../models/ToDo";
import PriorityCheckmarks from "../components/PriorityCheckmarks.vue";

const todos = ref<Todo[]>([]);
const searchTerm = ref<string>("");
const localPriorities = ref<string[]>(["High", "Medium", "Low"]);
  const router = useRouter();

async function fetchTodos() {
  try {
    todos.value = await TodoService.fetchTodos("", localPriorities.value);
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
};

async function searchTodos() {
  try {
    todos.value = await TodoService.fetchTodos(
      searchTerm.value.trim(),
      localPriorities.value
    );
  } catch (error) {
    console.error("Error fetching todos:", error);
  }
};

async function priorityFilter(checkedPriorities: string[]) {
  localPriorities.value = checkedPriorities;
  searchTodos();
};

async function updateTodoStatus(id: string, completed: boolean) {
  try {
    await TodoService.updateTodo(id, completed);
  } catch (error) {
    console.error("Failed to update todo:", error);
  }
};

async function removeTodo(id: string) {
  try {
    await TodoService.deleteTodo(id);
    todos.value = todos.value.filter((todo) => todo._id !== id);
  } catch (error) {
    console.error("Error deleting todo:", error);
  }
};

function navigateToAddTodoPage() {
  router.push("/add");
}

watch(searchTerm, () => {
  searchTodos();
});

onMounted(() => {
  fetchTodos();
});
</script>
