<template>
  <li class="flex items-center justify-between p-2 border-b">
    <div class="flex items-center">
      <Checkbox
        v-model="isChecked" 
        checkboxStyle="mr-4"
        @change="handleUpdate"
      />
      <span :class="{ 'line-through text-gray-500': isChecked }">
        {{ text }}
      </span>
      <div 
        class="w-4 h-4 ml-2" 
        :class="{
          'bg-red-500': props.priority === 'High',
          'bg-yellow-500': props.priority === 'Medium',
          'bg-green-500': priority === 'Low'
        }">
      </div>
    </div>
    <Button 
      type="button"
      :disabled="false"
      @click="handleDelete" 
      variant="text"
      >
        Delete
    </Button>
  </li>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import Button from './Button.vue';
  import Checkbox from './Checkbox.vue';
  import { PriorityType } from '../models/ToDo';

  interface Props {
    text: string;
    completed: boolean;
    priority: PriorityType;
    id: string;
  }
  const props = defineProps<Props>();

  interface ListItemEmits {
    (event: 'delete'): void;
    (event: 'update:modelValue', value: boolean): void;
  }
  const emit = defineEmits<ListItemEmits>();

  const isChecked = ref(props.completed);

  watch(() => props.completed, (newValue) => {
    isChecked.value = newValue;
  });

  const handleDelete = (): void => {
    emit('delete');
  };

  const handleUpdate = (): void => {
    emit('update:modelValue', isChecked.value);
  };
</script>