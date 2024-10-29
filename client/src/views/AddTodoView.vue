<template>
  <h1 class="text-2xl font-bold mb-4">Add New To-Do</h1>
  <BaseButton
    type="button"
    variant="text"
    BaseButtonStyle="mb-4"
    @click="navigateToHomePage">
    Back to Search
  </BaseButton>
  <div class="flex flex-col mb-4">
    <h3 class="text-l font-bold mb-4">Enter the to-do name</h3>
    <BaseInput
    v-model="newTodo"
      type="text"
      placeholder="To-do name"
      inputStyle="mb-4" 
      @enter="addTodo"/>
    <h3 class="text-l font-bold mb-4">Select the priority</h3>
    <select class="mb-4" v-model="selectedPriority">
      <option>High</option>
      <option>Medium</option>
      <option>Low</option>
    </select>
    <BaseButton
      type="button"
      variant="primary"
      :disabled="isAddBaseButtonDisabled"
      @click="addTodo">
      Add
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import BaseButton from "../components/BaseButton.vue";
import BaseInput from "../components/BaseInput.vue";
import TodoService from "../service/TodoService";
import Todo, { PriorityType } from "../models/ToDo";

const todos = ref<Todo[]>([]);
const newTodo = ref<string>("");
const selectedPriority = ref<PriorityType>();
const router = useRouter();

const isAddBaseButtonDisabled = computed(() => {
  return !newTodo.value.trim() || !selectedPriority.value;
});

const addTodo = async () => {
  if (newTodo.value.trim()) {
    try {
      const addedTodo = await TodoService.addTodo(
        newTodo.value.trim(),
        selectedPriority.value!
      );
      todos.value.push(addedTodo);
      newTodo.value = "";
      navigateToHomePage();
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  }
};

function navigateToHomePage() {
  router.push("/");
}
</script>
