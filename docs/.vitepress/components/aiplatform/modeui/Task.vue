<template>
  <div class="task-container h-full flex flex-col">
    <!-- Toolbar -->
    <div class="flex items-center justify-between p-2 border-b dark:border-dark-600">
      <div class="flex items-center gap-2">
        <button class="px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center">
          <div class="i-mdi-plus mr-1"></div>
          เพิ่มงานใหม่
        </button>
        <button class="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-dark-700 dark:hover:bg-dark-600 rounded-md flex items-center">
          <div class="i-mdi-view-column mr-1"></div>
          มุมมอง
        </button>
        <button class="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-dark-700 dark:hover:bg-dark-600 rounded-md flex items-center">
          <div class="i-mdi-filter-outline mr-1"></div>
          กรอง
        </button>
      </div>
      <div class="flex items-center gap-2">
        <button class="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-dark-600">
          <div class="i-mdi-dots-horizontal text-gray-600 dark:text-gray-300"></div>
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 overflow-hidden flex">
      <!-- Sidebar -->
      <div class="w-56 border-r dark:border-dark-600 bg-gray-50 dark:bg-dark-800 p-2">
        <div class="space-y-1">
          <button v-for="view in views" :key="view.id" 
            class="w-full text-left px-3 py-2 rounded-md flex items-center"
            :class="[activeView === view.id ? 'bg-blue-100 dark:bg-dark-700 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700']">
            <div :class="view.icon + ' mr-2'"></div>
            {{ view.name }}
          </button>
        </div>
        
        <div class="mt-6">
          <div class="px-3 py-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            โปรเจค
          </div>
          <div class="space-y-1 mt-1">
            <button v-for="project in projects" :key="project.id"
              class="w-full text-left px-3 py-2 rounded-md flex items-center text-sm"
              :class="[activeProject === project.id ? 'bg-blue-100 dark:bg-dark-700 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700']">
              <div :class="'w-2 h-2 rounded-full mr-2 ' + project.color"></div>
              {{ project.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- Task Table -->
      <div class="flex-1 overflow-auto">
        <div class="min-w-max">
          <!-- Table Header -->
          <div class="grid grid-cols-12 gap-2 px-4 py-2 border-b dark:border-dark-600 bg-gray-50 dark:bg-dark-800 sticky top-0 z-10">
            <div class="col-span-5 font-medium text-sm text-gray-500 dark:text-gray-400">ชื่องาน</div>
            <div class="col-span-2 font-medium text-sm text-gray-500 dark:text-gray-400">สถานะ</div>
            <div class="col-span-2 font-medium text-sm text-gray-500 dark:text-gray-400">กำหนดส่ง</div>
            <div class="col-span-2 font-medium text-sm text-gray-500 dark:text-gray-400">ผู้รับผิดชอบ</div>
            <div class="col-span-1 font-medium text-sm text-gray-500 dark:text-gray-400">ลำดับความสำคัญ</div>
          </div>

          <!-- Task Rows -->
          <div v-for="task in tasks" :key="task.id" 
            class="grid grid-cols-12 gap-2 px-4 py-3 border-b dark:border-dark-700 hover:bg-gray-50 dark:hover:bg-dark-800/50 cursor-pointer">
            <div class="col-span-5 flex items-center">
              <input type="checkbox" class="mr-3 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-dark-700">
              <div>
                <div class="font-medium text-gray-900 dark:text-gray-100">{{ task.title }}</div>
                <div class="text-xs text-gray-500 dark:text-gray-400">{{ task.description }}</div>
              </div>
            </div>
            <div class="col-span-2 flex items-center">
              <span :class="'px-2 py-1 text-xs rounded-full ' + getStatusClass(task.status)">
                {{ task.status }}
              </span>
            </div>
            <div class="col-span-2 flex items-center text-sm text-gray-700 dark:text-gray-300">
              {{ task.dueDate }}
            </div>
            <div class="col-span-2 flex items-center">
              <div class="flex -space-x-2">
                <img v-for="assignee in task.assignees" :key="assignee" 
                  :src="`https://i.pravatar.cc/150?u=${assignee}`" 
                  class="w-6 h-6 rounded-full border-2 border-white dark:border-dark-800"
                  :title="assignee">
              </div>
            </div>
            <div class="col-span-1 flex items-center">
              <div v-if="task.priority === 'high'" class="w-3 h-3 bg-red-500 rounded-full"></div>
              <div v-else-if="task.priority === 'medium'" class="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <div v-else class="w-3 h-3 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Task Detail Panel -->
      <div class="w-96 border-l dark:border-dark-600 bg-white dark:bg-dark-900 flex flex-col" v-if="selectedTask">
        <div class="p-4 border-b dark:border-dark-600">
          <div class="flex justify-between items-start">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">รายละเอียดงาน</h3>
            <button class="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400">
              <div class="i-mdi-close"></div>
            </button>
          </div>
        </div>
        
        <!-- Code Editor Section -->
        <div class="flex-1 p-4 overflow-auto">
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">โค้ด</label>
            <div class="relative">
              <select v-model="selectedLanguage" class="absolute right-2 top-2 z-10 bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 text-xs rounded px-2 py-1">
                <option value="javascript">JavaScript</option>
                <option value="typescript">TypeScript</option>
                <option value="python">Python</option>
                <option value="html">HTML</option>
                <option value="css">CSS</option>
              </select>
              <div class="bg-gray-900 rounded-md overflow-hidden">
                <pre class="text-xs p-4 overflow-auto max-h-96"><code class="language-javascript">// ตัวอย่างโค้ด
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price, 0);
}

const items = [
  { name: 'Item 1', price: 10 },
  { name: 'Item 2', price: 20 },
  { name: 'Item 3', price: 30 }
];

const total = calculateTotal(items);
console.log('Total:', total);</code></pre>
              </div>
            </div>
          </div>
          
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">คำอธิบาย</label>
            <div class="bg-gray-50 dark:bg-dark-800 rounded-md p-3 text-sm text-gray-700 dark:text-gray-300">
              <p>ฟังก์ชันนี้ใช้สำหรับคำนวณยอดรวมของรายการสินค้า</p>
              <p class="mt-2">วิธีการใช้งาน:</p>
              <pre class="bg-gray-100 dark:bg-dark-700 p-2 rounded mt-1 text-xs">const total = calculateTotal(items);</pre>
            </div>
          </div>
        </div>
        
        <div class="p-4 border-t dark:border-dark-600">
          <button class="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center justify-center">
            <div class="i-mdi-content-save mr-2"></div>
            บันทึกการเปลี่ยนแปลง
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const views = [
	{ id: "list", name: "รายการงาน", icon: "i-mdi-format-list-checkbox" },
	{ id: "board", name: "บอร์ด", icon: "i-mdi-view-column-outline" },
	{ id: "calendar", name: "ปฏิทิน", icon: "i-mdi-calendar-month" },
	{ id: "timeline", name: "ไทม์ไลน์", icon: "i-mdi-timeline-outline" },
	{ id: "dashboard", name: "แดชบอร์ด", icon: "i-mdi-view-dashboard-outline" },
];

const projects = [
	{ id: "project1", name: "Project Alpha", color: "bg-blue-500" },
	{ id: "project2", name: "Project Beta", color: "bg-green-500" },
	{ id: "project3", name: "Project Gamma", color: "bg-purple-500" },
];

const tasks = [
	{
		id: "task1",
		title: "ออกแบบ UI หน้าหลัก",
		description: "ออกแบบ UI ตาม wireframe",
		status: "กำลังทำงาน",
		dueDate: "15 พ.ค. 2566",
		assignees: ["user1", "user2"],
		priority: "high",
	},
	{
		id: "task2",
		title: "เขียน API สำหรับระบบล็อกอิน",
		description: "สร้าง endpoint สำหรับการล็อกอินและลงทะเบียน",
		status: "รอดำเนินการ",
		dueDate: "20 พ.ค. 2566",
		assignees: ["user3"],
		priority: "medium",
	},
	{
		id: "task3",
		title: "ทดสอบระบบหลังบ้าน",
		description: "ทดสอบฟังก์ชันการทำงานทั้งหมด",
		status: "เสร็จสิ้น",
		dueDate: "10 พ.ค. 2566",
		assignees: ["user4", "user5"],
		priority: "low",
	},
	{
		id: "task4",
		title: "อัปเดตเอกสาร API",
		description: "อัปเดตเอกสารให้ครบถ้วน",
		status: "กำลังตรวจสอบ",
		dueDate: "18 พ.ค. 2566",
		assignees: ["user1"],
		priority: "medium",
	},
];

const activeView = ref("list");
const activeProject = ref("project1");
const selectedTask = ref(tasks[0]);
const selectedLanguage = ref("javascript");

const getStatusClass = (status: string) => {
	const classes = {
		กำลังทำงาน:
			"bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
		รอดำเนินการ: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
		เสร็จสิ้น:
			"bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
		กำลังตรวจสอบ:
			"bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
	};
	return classes[status as keyof typeof classes] || "bg-gray-100 text-gray-800";
};
</script>

<style scoped>
.task-container {
  height: calc(100vh - 120px);
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.dark ::-webkit-scrollbar-track {
  background: #2d3748;
}

.dark ::-webkit-scrollbar-thumb {
  background: #4a5568;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #718096;
}

/* Code block styles */
pre {
  font-family: 'Fira Code', 'JetBrains Mono', monospace;
  line-height: 1.5;
  tab-size: 2;
}

code {
  color: #e2e8f0;
}

/* Syntax highlighting */
:global(.token.comment),
:global(.token.prolog),
:global(.token.doctype),
:global(.token.cdata) {
  color: #6b7280;
}

:global(.token.punctuation) {
  color: #e2e8f0;
}

:global(.token.property),
:global(.token.tag),
:global(.token.boolean),
:global(.token.number),
:global(.token.constant),
:global(.token.symbol),
:global(.token.deleted) {
  color: #f472b6;
}

:global(.token.selector),
:global(.token.attr-name),
:global(.token.string),
:global(.token.char),
:global(.token.builtin),
:global(.token.inserted) {
  color: #34d399;
}

:global(.token.operator),
:global(.token.entity),
:global(.token.url),
:global(.language-css .token.string),
:global(.style .token.string) {
  color: #93c5fd;
}

:global(.token.atrule),
:global(.token.attr-value),
:global(.token.keyword) {
  color: #60a5fa;
}

:global(.token.function),
:global(.token.class-name) {
  color: #fbbf24;
}

:global(.token.regex),
:global(.token.important),
:global(.token.variable) {
  color: #f59e0b;
}
</style>