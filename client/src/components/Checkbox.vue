<template>
    <div class="flex items-center">
      <input
        :class="checkboxClasses"
        type="checkbox"
        v-model="isChecked"
      />
      <label v-if="label" :class="labelClasses">
        {{ label }}
      </label>
    </div>
</template>
  
<script setup lang="ts">
    import { computed } from "vue";
    import { cn } from "../utils/ClassNameUtil.ts"; 
  
    interface CheckboxProps {
        modelValue: boolean;
        label?: string;
        checkboxStyle?: string;
        labelStyle?: string;
    }

    const props = defineProps<CheckboxProps>();

    const isChecked = defineModel(); 
  
    const checkboxClasses = computed(() => {
        return cn('form-checkbox h-5 w-5 text-blue-600 transition duration-150 ease-in-out', props.checkboxStyle);
    });

    const labelClasses = computed(() => {
        return cn('ml-2 text-sm font-medium text-gray-700', props.labelStyle);
    });
</script>
  