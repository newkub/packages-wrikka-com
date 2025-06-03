<template>
  <div class="welcome-research">
    <h2 class="text-2xl font-bold text-center mb-6 dark:text-white">ระบบค้นคว้าข้อมูล</h2>
    
    <!-- Research Tasks Table -->
    <div class="mb-6">
      <div class="flex justify-between items-center mb-4">
        <h3 class="font-medium text-lg dark:text-white">งานวิจัยที่กำลังดำเนินการ</h3>
        <button 
          @click="showTaskInput = !showTaskInput" 
          class="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center transition-colors"
        >
          <span class="i-mdi-plus mr-1"></span> เพิ่มงานวิจัยใหม่
        </button>
      </div>
      
      <!-- New Task Input -->
      <div v-if="showTaskInput" class="mb-6 p-4 bg-gray-50 dark:bg-dark-700 rounded-lg">
        <div class="flex gap-2">
          <input 
            v-model="newTaskTitle"
            @keyup.enter="addTask"
            placeholder="ระบุหัวข้องานวิจัย..."
            class="flex-1 px-3 py-2 border rounded-md dark:bg-dark-800 dark:border-dark-600 dark:text-white"
          >
          <button 
            @click="addTask"
            class="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md"
          >
            เพิ่ม
          </button>
        </div>
      </div>
      
      <!-- Tasks List -->
      <div v-if="tasks.length > 0" class="border rounded-lg overflow-hidden dark:border-dark-600">
        <table class="w-full">
          <thead class="bg-gray-50 dark:bg-dark-700">
            <tr>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">สถานะ</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">หัวข้อ</th>
              <th class="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">การดำเนินการ</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
            <tr 
              v-for="task in tasks" 
              :key="task.id"
              class="hover:bg-gray-50 dark:hover:bg-dark-700"
            >
              <td class="px-4 py-3">
                <span 
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                  :class="getStatusClass(task.status)"
                >
                  {{ task.status === 'in-progress' ? 'กำลังดำเนินการ' : 
                    task.status === 'completed' ? 'เสร็จสิ้น' : 'รอดำเนินการ' }}
                </span>
              </td>
              <td class="px-4 py-3 text-gray-900 dark:text-white">{{ task.title }}</td>
              <td class="px-4 py-3">
                <div class="flex gap-2">
                  <button 
                    v-if="task.status === 'pending'"
                    @click="$emit('start-task', task.id)"
                    class="p-1.5 text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                    title="เริ่มงานวิจัย"
                  >
                    <span class="i-mdi-play text-xl"></span>
                  </button>
                  <button 
                    @click="$emit('remove-task', task.id)"
                    class="p-1.5 text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                    title="ลบงานวิจัย"
                  >
                    <span class="i-mdi-delete text-xl"></span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
        <div class="i-mdi-magnify-remove-outline text-4xl mx-auto mb-3 opacity-50"></div>
        <p>ยังไม่มีงานวิจัยที่กำลังดำเนินการ</p>
        <p class="text-sm mt-1">คลิกปุ่ม "เพิ่มงานวิจัยใหม่" เพื่อเริ่มต้น</p>
      </div>
    </div>
    
    <!-- Research Instructions -->
    <div class="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
      <h3 class="font-medium text-blue-800 dark:text-blue-200 mb-2">คำแนะนำการใช้งาน</h3>
      <ul class="list-disc pl-5 space-y-1 text-sm text-blue-700 dark:text-blue-300">
        <li>เพิ่มงานวิจัยที่ต้องการค้นคว้าโดยคลิกที่ปุ่ม "เพิ่มงานวิจัยใหม่"</li>
        <li>คลิกปุ่ม "เล่น" เพื่อเริ่มการค้นคว้าแต่ละหัวข้อ</li>
        <li>ระบบจะค้นหาข้อมูลจากแหล่งข้อมูลที่เชื่อถือได้</li>
        <li>ผลการค้นหาจะแสดงในรูปแบบที่อ่านง่ายและมีการอ้างอิงแหล่งที่มา</li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps<{
  tasks: Array<{
    id: string;
    title: string;
    status: 'pending' | 'in-progress' | 'completed';
  }>;
}>();

const emit = defineEmits<{
  (e: 'add-task', title: string): void;
  (e: 'start-task', id: string): void;
  (e: 'remove-task', id: string): void;
}>();

const newTaskTitle = ref('');
const showTaskInput = ref(false);

const addTask = () => {
  if (newTaskTitle.value.trim()) {
    emit('add-task', newTaskTitle.value.trim());
    newTaskTitle.value = '';
    showTaskInput.value = false;
  }
};

const getStatusClass = (status: string) => {
  switch (status) {
    case 'in-progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    case 'completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};
</script>

<style scoped>
/* Add any specific styles for research mode here */
</style>