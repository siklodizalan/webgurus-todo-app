<template>
  <h1 class="text-2xl font-bold mb-4">Add New To-Do</h1>
  <Button
    type="button"
    :disabled="false"
    variant="text"
    buttonStyle="mb-4"
    @click="navigateToHomePage">
    Back to Search
  </Button>
  <div class="flex flex-col mb-4">
    <h3 class="text-l font-bold mb-4">Enter the to-do name</h3>
    <Input
      type="text"
      v-model="newTodo"
      placeholder="To-do name"
      @enter="addTodo"
      inputStyle="mb-4" />
    <h3 class="text-l font-bold mb-4">Select the priority</h3>
    <select class="mb-4" v-model="selectedPriority">
      <option>High</option>
      <option>Medium</option>
      <option>Low</option>
    </select>
    <Button
      type="button"
      :disabled="isAddButtonDisabled"
      variant="primary"
      @click="addTodo">
      Add
    </Button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import Button from "../components/Button.vue";
import Input from "../components//Input.vue";
import TodoService from "../service/TodoService";
import Todo, { PriorityType } from "../models/ToDo";
import { useRouter } from "vue-router";

const todos = ref<Todo[]>([]);
const newTodo = ref<string>("");
const selectedPriority = ref<PriorityType>(null);

const isAddButtonDisabled = computed(() => {
  return !newTodo.value.trim() || !selectedPriority.value;
});

const addTodo = async () => {
  if (newTodo.value.trim()) {
    try {
      const addedTodo = await TodoService.addTodo(
        newTodo.value.trim(),
        selectedPriority.value
      );
      todos.value.push(addedTodo);
      newTodo.value = "";
      navigateToHomePage();
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  }
};

const router = useRouter();

function navigateToHomePage() {
  router.push("/");
}
</script>
