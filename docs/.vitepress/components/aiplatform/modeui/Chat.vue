<template>
  <div class="welcome-chat">
    <h2 class="text-2xl font-bold text-center mb-8 dark:text-white">ยินดีต้อนรับสู่ AI Assistant</h2>
    <div class="grid grid-cols-2 gap-4">
      <div 
        v-for="(suggestion, index) in suggestions" 
        :key="index"
        @click="$emit('select-suggestion', suggestion.prompt)"
        class="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors dark:border-dark-600"
      >
        <h3 class="font-medium mb-1 text-gray-900 dark:text-white">{{ suggestion.title }}</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">{{ suggestion.description }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

defineProps<{
  suggestions: Array<{
    title: string;
    description: string;
    prompt: string;
  }>;
}>();

defineEmits<(e: 'select-suggestion', prompt: string) => void>();
</script>

<style scoped>
/* Add any specific styles for chat mode here */
</style>