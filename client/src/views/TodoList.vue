<template>
    <Button 
        type="button"
        :disabled="false" 
        variant="primary"
        buttonStyle="mb-4"
        @click="handleAddNewTodoButtonClick" 
        >
        Add New To-Do
    </Button>
    <div class="flex items-center">
        <Input
            type="text"
            v-model="searchTerm"
            placeholder="Search for a to-do"
            @enter="searchTodos"
            inputStyle="mr-4"
        />
        <Button 
          type="button"
          :disabled="false"
          @click="searchTodos" 
          variant="primary"
          >
            Search
        </Button>
    </div>
    <ul class="divide-y divide-gray-200">
        <ListItem
            v-for="todo in todos"
            :key="todo._id"
            :text="todo.name"
            :completed="todo.completed"
            :id="todo._id"
            :priority="todo.priority"
            @update:modelValue="updateTodoStatus(todo._id, $event)"
            @delete="removeTodo(todo._id)"
        />
    </ul>                    
</template>

<script setup lang="ts">
    import { ref, onMounted } from 'vue';
    import Button from '../components/Button.vue';
    import ListItem from '../components//ToDoListItem.vue';
    import Input from '../components//Input.vue';
    import TodoService from '../service/TodoService';
    import type Todo from '../models/ToDo';

    const todos = ref<Todo[]>([]);

    const fetchTodos = async () => {
        try {
            todos.value = await TodoService.fetchTodos();
        } catch (error) {
            console.error('Error fetching todos:', error);
        }
    };

    const searchTerm = ref<string>('');

    const searchTodos = async () => {
        try {
            todos.value = await TodoService.fetchTodos(searchTerm.value.trim());
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

    interface ButtonClickEmits {
        (event: 'click'): void;
    }
    const emit = defineEmits<ButtonClickEmits>();

    const handleAddNewTodoButtonClick = (): void => {
        emit('click');
    };

    onMounted(() => {
        fetchTodos();
    });
</script>