<template>
  <div class="w-full max-w-3xl mx-auto bg-white dark:bg-dark-700 rounded-lg shadow-md overflow-hidden">
    <!-- Tabs -->
    <div class="flex border-b border-gray-200 dark:border-dark-600">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'px-6 py-3 text-sm font-medium transition-colors duration-200',
          activeTab === tab.id
            ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
            : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200',
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab Content -->
    <div class="p-6">
      <!-- Task Tab Content -->
      <div v-if="activeTab === 'task'" class="space-y-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Code Tasks</h3>
          <button
            @click="showNewTaskForm = true"
            class="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <span class="i-mdi-plus mr-1"></span>
            New Task
          </button>
        </div>

        <!-- New Task Form -->
        <div v-if="showNewTaskForm" class="mb-6 p-4 bg-gray-50 dark:bg-dark-800 rounded-lg">
          <div class="space-y-4">
            <div>
              <label for="taskTitle" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Task Title
              </label>
              <input
                v-model="newTask.title"
                type="text"
                id="taskTitle"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-dark-700 dark:text-white"
                placeholder="Enter task title"
              />
            </div>
            <div>
              <label for="taskDescription" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                v-model="newTask.description"
                id="taskDescription"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-dark-700 dark:text-white"
                placeholder="Enter task description"
              ></textarea>
            </div>
            <div class="flex justify-end space-x-2">
              <button
                @click="cancelNewTask"
                class="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-600 rounded-md hover:bg-gray-200 dark:hover:bg-dark-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                @click="addTask"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                :disabled="!newTask.title.trim()"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>

        <!-- Task List -->
        <div v-if="activeTasks.length > 0" class="space-y-3">
          <div
            v-for="task in activeTasks"
            :key="task.id"
            class="p-4 bg-white dark:bg-dark-800 border border-gray-200 dark:border-dark-700 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center">
                  <input
                    :id="'task-' + task.id"
                    type="checkbox"
                    v-model="task.completed"
                    @change="updateTaskStatus(task)"
                    class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label :for="'task-' + task.id" class="ml-3 block">
                    <span
                      :class="[
                        'text-sm font-medium',
                        task.completed
                          ? 'text-gray-500 dark:text-gray-400 line-through'
                          : 'text-gray-900 dark:text-gray-100',
                      ]"
                    >
                      {{ task.title }}
                    </span>
                  </label>
                </div>
                <p v-if="task.description" class="ml-7 mt-1 text-sm text-gray-600 dark:text-gray-400">
                  {{ task.description }}
                </p>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="editTask(task)"
                  class="text-gray-400 hover:text-blue-500 dark:text-gray-500 dark:hover:text-blue-400"
                  title="Edit task"
                >
                  <span class="i-mdi-pencil text-lg"></span>
                </button>
                <button
                  @click="archiveTask(task.id)"
                  class="text-gray-400 hover:text-yellow-500 dark:text-gray-500 dark:hover:text-yellow-400"
                  title="Archive task"
                >
                  <span class="i-mdi-archive-arrow-down text-lg"></span>
                </button>
                <button
                  @click="deleteTask(task.id)"
                  class="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                  title="Delete task"
                >
                  <span class="i-mdi-delete text-lg"></span>
                </button>
              </div>
            </div>
            <div v-if="task.editing" class="mt-3 ml-7 space-y-3">
              <input
                v-model="task.editedTitle"
                type="text"
                class="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-dark-700 dark:text-white"
                @keyup.enter="saveTaskEdit(task)"
                @keyup.esc="cancelEdit(task)"
              />
              <div class="flex justify-end space-x-2">
                <button
                  @click="cancelEdit(task)"
                  class="px-2 py-1 text-xs text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-600 rounded-md hover:bg-gray-200 dark:hover:bg-dark-500"
                >
                  Cancel
                </button>
                <button
                  @click="saveTaskEdit(task)"
                  class="px-2 py-1 text-xs text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-500 dark:text-gray-400">
          <span class="i-mdi-code-braces text-4xl block mb-2"></span>
          <p>No active code tasks. Create a new task to get started.</p>
        </div>
      </div>

      <!-- Archive Tab Content -->
      <div v-else class="space-y-4">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100">Archived Tasks</h3>
          <div class="relative" v-if="archivedTasks.length > 0">
            <button
              @click="showArchiveActions = !showArchiveActions"
              class="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-xs font-medium rounded-md shadow-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-dark-800 hover:bg-gray-50 dark:hover:bg-dark-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <span class="i-mdi-dots-vertical"></span>
            </button>
            <div
              v-if="showArchiveActions"
              class="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-800 rounded-md shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700"
              v-click-outside="() => (showArchiveActions = false)"
            >
              <button
                @click="clearAllArchived"
                class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30"
              >
                <span class="i-mdi-delete-outline mr-2"></span>
                Clear All Archived
              </button>
            </div>
          </div>
        </div>

        <div v-if="archivedTasks.length > 0" class="space-y-3">
          <div
            v-for="task in archivedTasks"
            :key="task.id"
            class="p-4 bg-gray-50 dark:bg-dark-800 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <div class="flex items-center">
                  <span
                    class="text-sm font-medium text-gray-500 dark:text-gray-400 line-through"
                  >
                    {{ task.title }}
                  </span>
                </div>
                <p v-if="task.description" class="mt-1 ml-6 text-sm text-gray-500 dark:text-gray-500">
                  {{ task.description }}
                </p>
              </div>
              <div class="flex items-center space-x-2">
                <button
                  @click="restoreTask(task.id)"
                  class="text-gray-400 hover:text-green-500 dark:text-gray-500 dark:hover:text-green-400"
                  title="Restore task"
                >
                  <span class="i-mdi-archive-arrow-up text-lg"></span>
                </button>
                <button
                  @click="deleteTask(task.id, true)"
                  class="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400"
                  title="Delete permanently"
                >
                  <span class="i-mdi-delete-forever text-lg"></span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="text-center py-8 text-gray-400 dark:text-gray-500">
          <span class="i-mdi-archive-outline text-4xl block mb-2"></span>
          <p>No archived tasks yet.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { v4 as uuidv4 } from 'uuid';

interface CodeTask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  archived: boolean;
  createdAt: number;
  updatedAt: number;
  // For editing
  editing?: boolean;
  editedTitle?: string;
  editedDescription?: string;
}

// Tabs
const tabs = [
  { id: 'task', label: 'Task' },
  { id: 'archive', label: 'Archive' },
];

const activeTab = ref('task');
const showNewTaskForm = ref(false);
const showArchiveActions = ref(false);

// Task management
const tasks = ref<CodeTask[]>([]);
const newTask = ref({
  title: '',
  description: '',
  completed: false,
});

// Computed properties
const activeTasks = computed(() => 
  tasks.value.filter(task => !task.archived)
    .sort((a, b) => b.updatedAt - a.updatedAt)
);

const archivedTasks = computed(() => 
  tasks.value.filter(task => task.archived)
    .sort((a, b) => b.updatedAt - a.updatedAt)
);

// Load tasks from localStorage
const loadTasks = () => {
  const savedTasks = localStorage.getItem('codeTasks');
  if (savedTasks) {
    tasks.value = JSON.parse(savedTasks);
  }
};

// Save tasks to localStorage
const saveTasks = () => {
  localStorage.setItem('codeTasks', JSON.stringify(tasks.value));
};

// Add a new task
const addTask = () => {
  if (!newTask.value.title.trim()) return;
  
  const task: CodeTask = {
    id: uuidv4(),
    title: newTask.value.title.trim(),
    description: newTask.value.description.trim(),
    completed: false,
    archived: false,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  
  tasks.value.unshift(task);
  saveTasks();
  
  // Reset form
  newTask.value = {
    title: '',
    description: '',
    completed: false,
  };
  
  showNewTaskForm.value = false;
};

// Toggle task completion
const updateTaskStatus = (task: CodeTask) => {
  task.updatedAt = Date.now();
  saveTasks();
};

// Archive a task
const archiveTask = (taskId: string) => {
  const task = tasks.value.find(t => t.id === taskId);
  if (task) {
    task.archived = true;
    task.updatedAt = Date.now();
    saveTasks();
  }
};

// Restore a task from archive
const restoreTask = (taskId: string) => {
  const task = tasks.value.find(t => t.id === taskId);
  if (task) {
    task.archived = false;
    task.updatedAt = Date.now();
    saveTasks();
  }
};

// Delete a task
const deleteTask = (taskId: string, force = false) => {
  if (force || confirm('Are you sure you want to delete this task?')) {
    tasks.value = tasks.value.filter(t => t.id !== taskId);
    saveTasks();
  }
};

// Clear all archived tasks
const clearAllArchived = () => {
  if (confirm('Are you sure you want to clear all archived tasks? This cannot be undone.')) {
    tasks.value = tasks.value.filter(t => !t.archived);
    saveTasks();
    showArchiveActions.value = false;
  }
};

// Edit task
const editTask = (task: CodeTask) => {
  // Store original values in case of cancel
  task.editedTitle = task.title;
  task.editedDescription = task.description;
  task.editing = true;
};

// Save task edit
const saveTaskEdit = (task: CodeTask) => {
  if (task.editedTitle?.trim()) {
    task.title = task.editedTitle.trim();
    task.description = task.editedDescription?.trim() || '';
    task.updatedAt = Date.now();
    task.editing = false;
    saveTasks();
  }
};

// Cancel edit
const cancelEdit = (task: CodeTask) => {
  task.editing = false;
};

// Cancel new task form
const cancelNewTask = () => {
  newTask.value = {
    title: '',
    description: '',
    completed: false,
  };
  showNewTaskForm.value = false;
};

// Initialize component
onMounted(() => {
  loadTasks();
});
</script>

<style scoped>
/* Add any custom styles here */
</style>