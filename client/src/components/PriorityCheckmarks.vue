<template>
  <div class="flex space-x-4 mb-4">
    <Checkbox
      v-model="isAllChecked"
      label="All"
      value="All"
      checkboxStyle="h-6 w-6 text-blue-600"
      labelStyle="text-lg text-white"
      @change="setAllSelected" />
    <Checkbox
      v-model="checkedPriorities"
      id="High"
      label="High"
      value="High"
      checkboxStyle="h-6 w-6 text-blue-600"
      labelStyle="text-lg text-white" />
    <Checkbox
      v-model="checkedPriorities"
      id="Medium"
      label="Medium"
      value="Medium"
      checkboxStyle="h-6 w-6 text-blue-600"
      labelStyle="text-lg text-white" />
    <Checkbox
      v-model="checkedPriorities"
      id="Low"
      label="Low"
      value="Low"
      checkboxStyle="h-6 w-6 text-blue-600"
      labelStyle="text-lg text-white" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import Checkbox from "./Checkbox.vue";

const checkedPriorities = ref<string[]>(["High", "Medium", "Low"]);
const isAllChecked = ref<boolean>(true);

function setAllSelected(event: Event) {
  const target = event.target as HTMLInputElement;
  const allSelected = target.checked;
  console.log(allSelected);

  if (allSelected) {
    checkedPriorities.value = ["High", "Medium", "Low"];
  } else {
    checkedPriorities.value = [];
  }
}

watch(checkedPriorities, (newValue) => {
  if (newValue.length === 3) {
    isAllChecked.value = true;
  } else {
    isAllChecked.value = false;
  }
  emitCheckedPriorities();
});

const emit = defineEmits<{
  (e: "priorityCheck", checkedPriorities: string[]): void;
}>();

function emitCheckedPriorities() {
  emit("priorityCheck", checkedPriorities.value);
}
</script>
