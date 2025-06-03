<template>
  <div class="welcome-image">
    <h2 class="text-2xl font-bold text-center mb-8 dark:text-white">สร้างและแก้ไขรูปภาพ</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
      <div 
        v-for="(app, index) in imageApps" 
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

const imageApps = [
	{
		name: "DALL-E 3",
		description: "สร้างภาพจากข้อความด้วย AI",
		icon: "i-mdi-image-edit-outline",
		prompt: "สร้างภาพด้วย DALL-E 3: ",
	},
	{
		name: "Midjourney",
		description: "สร้างภาพศิลปะคุณภาพสูง",
		icon: "i-mdi-palette-outline",
		prompt: "สร้างภาพศิลปะด้วย Midjourney: ",
	},
	{
		name: "Stable Diffusion",
		description: "สร้างภาพแบบโอเพนซอร์ส",
		icon: "i-mdi-brush-variant",
		prompt: "สร้างภาพด้วย Stable Diffusion: ",
	},
	{
		name: "Photoshop AI",
		description: "แก้ไขภาพขั้นสูง",
		icon: "i-mdi-image-edit",
		prompt: "แก้ไขภาพด้วย Photoshop AI: ",
	},
	{
		name: "Canva",
		description: "ออกแบบกราฟิกง่ายๆ",
		icon: "i-mdi-format-paint",
		prompt: "ออกแบบกราฟิกด้วย Canva: ",
	},
	{
		name: "Remove BG",
		description: "ลบพื้นหลังอัตโนมัติ",
		icon: "i-mdi-image-remove-outline",
		prompt: "ลบพื้นหลังรูปภาพ: ",
	},
];

const emit = defineEmits(["select-app"]);

const selectApp = (app: (typeof imageApps)[number]) => {
	emit("select-app", app.prompt);
};
</script>

<style scoped>
/* Add any specific styles for image mode here */
.welcome-image {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem;
}
</style>