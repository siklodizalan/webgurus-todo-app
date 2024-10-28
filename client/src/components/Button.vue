<template>
  <button :class="buttonClasses" :disabled="disabled" @click="handleClick">
    <slot></slot>
  </button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { cn } from "../utils/ClassNameUtil";

interface ButtonProps {
  type: "button" | "submit" | "reset";
  variant: "primary" | "secondary" | "text";
  disabled?: boolean;
  buttonStyle?: string;
}

const props = defineProps<ButtonProps>();

interface ButtonEmits {
  (event: "click", mouseEvent: MouseEvent): void;
}

const emit = defineEmits<ButtonEmits>();

const baseClasses = "px-4 py-2 rounded focus:outline-none";

const variantClasses = computed(() => {
  switch (props.variant) {
    case "primary":
      return "bg-blue-500 text-white hover:bg-blue-600";
    case "secondary":
      return "bg-gray-300 text-gray-800 hover:bg-gray-400";
    case "text":
      return "text-blue-500 hover:underline";
    default:
      return "";
  }
});

const buttonClasses = computed(() => {
  const disabledClass = props.disabled ? "opacity-50 cursor-not-allowed" : "";
  return cn(
    baseClasses,
    `${variantClasses.value} ${disabledClass} ${props.buttonStyle}`.trim()
  );
});

const handleClick = (event: MouseEvent) => {
  if (!props.disabled) {
    emit("click", event);
  }
};
</script>
