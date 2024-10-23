<template>
    <Button 
        type="button"
        :disabled="false" 
        variant="text"
        buttonStyle="mb-4"
        @click="handleBackToSearchButtonClick" 
        >
        Back to Search 
    </Button>
    <div class="flex flex-col mb-4">
        <h3 class="text-l font-bold mb-4">Enter the to-do name</h3>
        <Input
            type="text"
            v-model="newTodo"
            placeholder="To-do name"
            @enter="addTodo"
            inputStyle="mb-4"
        />
        <h3 class="text-l font-bold mb-4">Select the priority</h3>
        <select class="mb-4" v-model="selectedPriority">
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
        </select>
        <Button 
            type="button"
            :disabled="false"
            variant="primary"
            @click="addTodo" 
            >
                Add
        </Button>  
    </div>      
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    import Button from '../components/Button.vue';
    import Input from '../components//Input.vue';
    import TodoService from '../service/TodoService';
    import Todo, { PriorityType } from '../models/ToDo';

    const todos = ref<Todo[]>([]);
    const newTodo = ref<string>('');
    const selectedPriority = ref<PriorityType>(null);

    const addTodo = async () => {
        if (newTodo.value.trim()) {
            try {
            const addedTodo = await TodoService.addTodo(newTodo.value.trim(), selectedPriority.value);
            todos.value.push(addedTodo);
            newTodo.value = '';
            handleBackToSearchButtonClick();
            } catch (error) {
            console.error('Error adding todo:', error);
            }
        }
    };

    interface ButtonClickEmits {
        (event: 'click'): void;
    }
    const emit = defineEmits<ButtonClickEmits>();

    const handleBackToSearchButtonClick = (): void => {
        emit('click');
    };
</script>