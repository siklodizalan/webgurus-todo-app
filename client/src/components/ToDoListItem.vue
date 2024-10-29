<template>
  <li class="flex items-center justify-between p-2 border-b">
    <div class="flex items-center">
      <BaseCheckbox
        v-model="isChecked"
        checkboxStyle="mr-4"
        @change="handleUpdate" />
      <span :class="{ 'line-through text-gray-500': isChecked }">
        {{ text }}
      </span>
      <div
        :class="cn('w-4 h-4 ml-2', priorityClass)">
      </div>
    </div>
    <BaseButton
      type="button"
      variant="text"
      @click="handleDelete">
      Delete
    </BaseButton>
  </li>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import BaseButton from "./BaseButton.vue";
import BaseCheckbox from "./BaseCheckbox.vue";
import type { PriorityType } from "../models/ToDo";
import { cn } from "../utils/ClassNameUtil.ts";

const classMap = {
  High: "bg-red-500",
  Medium: "bg-yellow-500",
  Low: "bg-green-500",
};

const priorityClass = computed(() => classMap[props.priority!] || "");

interface Props {
  text: string;
  completed: boolean;
  priority: PriorityType;
  id: string;
}
const props = defineProps<Props>();

const isChecked = ref(props.completed);

interface Emits {
  (event: "onDelete"): void;
  (event: "onUpdate", value: boolean): void;
}
const emit = defineEmits<Emits>();

watch(
  () => props.completed,
  (newValue) => {
    isChecked.value = newValue;
  }
);

function handleDelete(): void {
  emit("onDelete");
};

function handleUpdate(): void {
  emit("onUpdate", isChecked.value);
};
</script>
