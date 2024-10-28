<template>
    <h1 class="text-2xl font-bold mb-4">Your To-Dos</h1>
    <Button type="button" :disabled="false" variant="primary" buttonStyle="mb-4" @click="navigateToAddTodoPage">
        Add New To-Do
    </Button>
    <div class="flex items-center mb-4">
        <div class="mr-4">
            <Input type="text" v-model="searchTerm" placeholder="Search for a to-do" @enter="searchTodos"
                inputStyle="mr-4" />
        </div>
        <Button type="button" :disabled="false" @click="searchTodos" variant="primary">
            Search
        </Button>
    </div>

    <PriorityCheckmarks @priorityCheck="priorityFilter" />
    <span v-if="todos.length === 0">
        There are no to-do's with theese filters.
    </span>
    <ul class="divide-y divide-gray-200">
        <ListItem v-for="todo in todos" :key="todo._id" :text="todo.name" :completed="todo.completed" :id="todo._id"
            :priority="todo.priority" @update:modelValue="updateTodoStatus(todo._id, $event)"
            @delete="removeTodo(todo._id)" />
    </ul>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import Button from '../components/Button.vue';
import ListItem from '../components//ToDoListItem.vue';
import Input from '../components//Input.vue';
import TodoService from '../service/TodoService';
import type Todo from '../models/ToDo';
import PriorityCheckmarks from '../components/PriorityCheckmarks.vue';
import { useRouter } from 'vue-router';
import { useUser } from "../composables/useUser"

const todos = ref<Todo[]>([]);
const searchTerm = ref<string>('');
const localPriorities = ref<string[]>(["High", "Medium", "Low"]);

const fetchTodos = async () => {
    try {
        todos.value = await TodoService.fetchTodos("", localPriorities.value);
    } catch (error) {
        console.error('Error fetching todos:', error);
    }
};

const searchTodos = async () => {
    try {
        todos.value = await TodoService.fetchTodos(searchTerm.value.trim(), localPriorities.value);
    } catch (error) {
        console.error('Error fetching todos:', error);
    }
};

const priorityFilter = async (checkedPriorities: string[]) => {
    try {
        localPriorities.value = checkedPriorities;
        todos.value = await TodoService.fetchTodos(searchTerm.value.trim(), checkedPriorities);
    } catch (error) {
        console.error('Error fetching todos:', error);
    }
};

const updateTodoStatus = async (id: string, completed: boolean) => {
    try {
        await TodoService.updateTodo(id, completed);
    } catch (error) {
        console.error('Failed to update todo:', error);
    }
};

const removeTodo = async (id: string) => {
    try {
        await TodoService.deleteTodo(id);
        todos.value = todos.value.filter((todo) => todo._id !== id);
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
};

watch(searchTerm, () => {
    searchTodos();
});

onMounted(() => {
    fetchTodos();
    console.log(useUser())
});

const router = useRouter();

function navigateToAddTodoPage() {
    router.push('/add');
}
</script>