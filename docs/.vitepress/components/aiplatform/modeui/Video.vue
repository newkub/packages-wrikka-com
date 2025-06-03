<template>
  <div class="welcome-video">
    <h2 class="text-2xl font-bold text-center mb-8 dark:text-white">สร้างและแก้ไขวิดีโอ</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div 
        v-for="(app, index) in videoApps" 
        :key="index"
        @click="selectApp(app)"
        class="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors dark:border-dark-600 flex flex-col items-center text-center"
      >
        <div class="w-16 h-16 mb-3 rounded-full bg-gray-100 dark:bg-dark-600 flex items-center justify-center">
          <span :class="app.icon" class="text-2xl text-blue-500"></span>
        </div>
        <h3 class="font-medium text-gray-900 dark:text-white mb-1">{{ app.name }}</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400">{{ app.description }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const videoApps = [
	{
		name: "Runway ML",
		description: "สร้างวิดีโอจากข้อความด้วย AI",
		icon: "i-mdi-video-3d",
		prompt: "สร้างวิดีโอด้วย Runway ML: ",
	},
	{
		name: "Pika Labs",
		description: "สร้างอนิเมชั่นและเอฟเฟค",
		icon: "i-mdi-movie-open-play",
		prompt: "สร้างอนิเมชั่นด้วย Pika Labs: ",
	},
	{
		name: "Adobe Premiere",
		description: "ตัดต่อวิดีโอระดับมืออาชีพ",
		icon: "i-mdi-video-box",
		prompt: "ตัดต่อวิดีโอด้วย Adobe Premiere: ",
	},
	{
		name: "CapCut",
		description: "ตัดต่อวิดีโอแบบง่ายๆ",
		icon: "i-mdi-scissors-cutting",
		prompt: "ตัดต่อวิดีโอด้วย CapCut: ",
	},
	{
		name: "Synthesia",
		description: "สร้างวิดีโอพรีเซนเทชั่น AI",
		icon: "i-mdi-account-tie-voice",
		prompt: "สร้างวิดีโอพรีเซนเทชั่นด้วย Synthesia: ",
	},
	{
		name: "HeyGen",
		description: "สร้างวิดีโอ AI พรีเซนเตอร์",
		icon: "i-mdi-robot-happy-outline",
		prompt: "สร้างวิดีโอพรีเซนเตอร์ด้วย HeyGen: ",
	},
];

const emit = defineEmits(["select-app"]);

const selectApp = (app: (typeof videoApps)[number]) => {
	emit("select-app", app.prompt);
};
</script>

<style scoped>
/* Add any specific styles for video mode here */
.welcome-video {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}
</style>