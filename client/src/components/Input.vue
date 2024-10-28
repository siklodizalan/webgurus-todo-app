<template>
    <div class="relative" v-bind="$attrs">
        <input
            :type="inputType"
            :placeholder
            :class="inputClasses"
            v-model="model"
            @keyup.enter="$emit('enter')"
        />
        <button
            v-if="isPassword"
            type="button"
            @click="togglePasswordVisibility"
            class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent border-none cursor-pointer"
            aria-label="Toggle password visibility"
        >
            <span v-if="isPasswordVisible">👁️</span>
            <span v-else>👁️‍🗨️</span>
        </button>
    </div>
</template>
  
<script setup lang="ts">
    import { computed, ref } from 'vue';
    import { cn } from "../utils/ClassNameUtil.ts"; 
  
    interface InputProps {
        modelValue: string | number | boolean;
        label?: string;
        placeholder?: string;
        type?: string;
        inputStyle?: string;
        labelStyle?: string;
    }

    const props = defineProps<InputProps>();

    const model = defineModel();

    const isPasswordVisible = ref(false);
    const isPassword = computed(() => props.type === 'password');
    const inputType = computed(() => (isPasswordVisible.value ? 'text' : props.type));
  
    const inputClasses = computed(() => 
        cn('w-full p-2 border border-gray-300 rounded', props.inputStyle)
    );

    function togglePasswordVisibility() {
        isPasswordVisible.value = !isPasswordVisible.value;
    }

    defineEmits<{
        (e: 'enter'): void;
    }>();
</script>