<template>
  <div class="flex space-x-4 mb-4">
    <BaseCheckbox
      v-model="isAllChecked"
      label="All"
      value="All"
      BaseCheckboxStyle="h-6 w-6 text-blue-600"
      labelStyle="text-lg text-white"
      @change="setAllSelected" />
    <BaseCheckbox
      v-for="priority in allPriorities"
      v-model="checkedPriorities"
      BaseCheckboxStyle="h-6 w-6 text-blue-600"
      labelStyle="text-lg text-white"
      :key="priority"
      :id="priority"
      :label="priority"
      :value="priority"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import BaseCheckbox from "./BaseCheckbox.vue";

const allPriorities = ["High", "Medium", "Low"];
const checkedPriorities = ref<string[]>(["High", "Medium", "Low"]);
const isAllChecked = ref<boolean>(true);

interface PriorityCheckmarkEmits {
  (e: "priorityCheck", checkedPriorities: string[]): void;
}

const emit = defineEmits<PriorityCheckmarkEmits>();

function setAllSelected(event: Event) {
  const target = event.target as HTMLInputElement;
  const allSelected = target.checked;

  checkedPriorities.value = allSelected ? allPriorities : [];
}

function emitCheckedPriorities() {
  emit("priorityCheck", checkedPriorities.value);
}

watch(checkedPriorities, (newValue) => {
  isAllChecked.value = newValue.length === 3;
  emitCheckedPriorities();
});
</script>
