<template>
    <input
        :type
        :placeholder
        :class="inputClasses"
        v-model="model"
        @keyup.enter="$emit('enter')"
    />
</template>
  
<script setup lang="ts">
    import { computed } from 'vue';
    import { cn } from "../utils/ClassNameUtil.ts"; 
  
    interface InputProps {
        modelValue: string | number | boolean;
        label?: string;
        placeholder?: string;
        type?: string;
        inputStyle?: string;
        labelStyle?: string;
    }

    const model = defineModel();

    const props = defineProps<InputProps>();
  
    const inputClasses = computed(() => 
        cn('w-full p-2 border border-gray-300 rounded', props.inputStyle)
    );

    defineEmits<{
        (e: 'enter'): void;
    }>();
</script>