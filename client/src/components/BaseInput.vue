<template>
  <div class="relative" v-bind="$attrs">
    <input
        v-model="model"
        :type="inputType"
        :placeholder
        :class="inputClasses"
        @keyup.enter="$emit('enter')" />
    <BaseButton
      v-if="isPassword"
      type="button"
      variant="primary"
      class="absolute right-2 top-1/2 transform -translate-y-1/2 bg-transparent border-none cursor-pointer"
      aria-label="Toggle password visibility"
      @click="togglePasswordVisibility">
      <span v-if="isPasswordVisible">👁️</span>
      <span v-else>👁️‍🗨️</span>
    </BaseButton>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { cn } from "../utils/ClassNameUtil.ts";
import BaseButton from "./BaseButton.vue";

interface InputProps {
  modelValue: string | number | boolean;
  label?: string;
  placeholder?: string;
  type?: string;
  inputStyle?: string;
  labelStyle?: string;
}

interface InputEmits {
    (e: "enter"): void;
}

const props = defineProps<InputProps>();

defineEmits<InputEmits>();

const model = defineModel();

const isPasswordVisible = ref(false);
const isPassword = computed(() => props.type === "password");
const inputType = computed(() =>
  isPasswordVisible.value ? "text" : props.type
);

const inputClasses = computed(() =>
  cn("w-full p-2 border border-gray-300 rounded", props.inputStyle)
);

function togglePasswordVisibility() {
  isPasswordVisible.value = !isPasswordVisible.value;
}
</script>
