<script setup lang="ts">
import { ref, computed } from "vue";
import { useData } from "vitepress";

interface Tab {
	id: string;
	label: string;
}

interface Change {
	type: "feature" | "fix" | "improvement" | "chore";
	description: string;
}

interface Release {
	version: string;
	date: string;
	type: "major" | "minor" | "patch";
	changes: Change[];
}

interface Commit {
	hash: string;
	date: string;
	author: string;
	message: string;
	files: string[];
}

interface Contributor {
	id: number;
	name: string;
	role: string;
	avatar: string;
	contributions: number;
}

const { isDark } = useData();
const activeTab = ref<string>("releases");

const tabs: Tab[] = [
	{ id: "releases", label: "Releases" },
	{ id: "commits", label: "Commits" },
	{ id: "contributors", label: "Contributors" },
];

// Mock data for releases
const releases: Release[] = [
	{
		version: "v1.2.0",
		date: "2023-10-15",
		type: "minor",
		changes: [
			{ type: "feature", description: "Added new Dropdown component" },
			{ type: "feature", description: "Implemented dark mode support" },
			{ type: "fix", description: "Fixed button hover state in Safari" },
		],
	},
	{
		version: "v1.1.2",
		date: "2023-09-22",
		type: "patch",
		changes: [
			{ type: "fix", description: "Fixed modal close animation" },
			{ type: "chore", description: "Updated dependencies" },
		],
	},
	{
		version: "v1.1.0",
		date: "2023-08-15",
		type: "minor",
		changes: [
			{ type: "feature", description: "Added Table component" },
			{ type: "improvement", description: "Enhanced form validation" },
			{ type: "fix", description: "Fixed sidebar navigation on mobile" },
		],
	},
];

// Mock data for commits
const commits: Commit[] = [
	{
		hash: "a1b2c3d",
		date: "2023-10-14",
		author: "Jane Doe",
		message: "feat: add dropdown component",
		files: [
			"packages/components/src/Dropdown/Dropdown.vue",
			"packages/components/src/index.ts",
		],
	},
	{
		hash: "e4f5g6h",
		date: "2023-10-12",
		author: "John Smith",
		message: "fix: button hover state in Safari",
		files: [
			"packages/components/src/Button/Button.vue",
			"packages/components/src/Button/Button.css",
		],
	},
	{
		hash: "i7j8k9l",
		date: "2023-10-10",
		author: "Alex Johnson",
		message: "docs: update component documentation",
		files: ["docs/components/button.md", "docs/components/modal.md"],
	},
];

// Mock data for contributors
const contributors: Contributor[] = [
	{
		id: 1,
		name: "Jane Doe",
		role: "Lead Developer",
		avatar: "https://randomuser.me/api/portraits/women/1.jpg",
		contributions: 156,
	},
	{
		id: 2,
		name: "John Smith",
		role: "UI Designer",
		avatar: "https://randomuser.me/api/portraits/men/1.jpg",
		contributions: 89,
	},
	{
		id: 3,
		name: "Alex Johnson",
		role: "Documentation",
		avatar: "https://randomuser.me/api/portraits/women/2.jpg",
		contributions: 42,
	},
];

const setActiveTab = (tabId: string) => {
	activeTab.value = tabId;
};

const getTabClass = (tabId: string) => [
	"py-3 px-6 transition-all duration-200 font-medium cursor-pointer relative",
	{
		"text-primary-500 font-semibold": activeTab.value === tabId,
		"text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300":
			activeTab.value !== tabId,
	},
];

const getReleaseTypeClass = (type: string) => [
	"px-2.5 py-1 rounded-full text-xs font-medium transition-colors",
	{
		"bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300":
			type === "minor",
		"bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300":
			type === "major",
		"bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-300":
			type === "patch",
	},
];

const getChangeTypeClass = (type: string) => [
	"inline-block py-1 px-2.5 rounded-md text-xs font-medium mr-2 transition-colors",
	{
		"bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-300":
			type === "feature",
		"bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-300":
			type === "fix",
		"bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300":
			type === "improvement",
		"bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300":
			type === "chore",
	},
];

const activeContent = computed(() => {
	return activeTab.value;
});
</script>

<template>
  <div class="my-8 max-w-4xl mx-auto">
    <!-- Tab navigation -->
    <div class="flex border-b border-gray-200 dark:border-gray-700 mb-8 relative">
      <button 
        v-for="tab in tabs" 
        :key="tab.id" 
        :class="getTabClass(tab.id)"
        @click="setActiveTab(tab.id)"
      >
        {{ tab.label }}
        <div 
          v-if="activeTab === tab.id" 
          class="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 transition-all duration-300"
        ></div>
      </button>
    </div>

    <!-- Tab content -->
    <div class="transition-all duration-300">
      <!-- Releases tab -->
      <div v-if="activeContent === 'releases'">
        <div 
          v-for="release in releases" 
          :key="release.version" 
          class="mb-10 pb-8 border-b border-gray-200 dark:border-gray-700 last:border-0"
        >
          <div class="flex flex-wrap items-center gap-4 mb-6">
            <h2 class="m-0 text-2xl font-bold dark:text-white">{{ release.version }}</h2>
            <span class="text-gray-500 dark:text-gray-400 flex items-center">
              <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              {{ release.date }}
            </span>
            <span :class="getReleaseTypeClass(release.type)">
              {{ release.type }}
            </span>
          </div>
          <div>
            <ul class="space-y-4 pl-0 list-none">
              <li 
                v-for="(change, index) in release.changes" 
                :key="index"
                class="flex items-start p-3 rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <span :class="getChangeTypeClass(change.type)">
                  {{ change.type }}
                </span>
                <span class="dark:text-gray-200">{{ change.description }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Commits tab -->
      <div v-else-if="activeContent === 'commits'">
        <div 
          v-for="commit in commits" 
          :key="commit.hash" 
          class="mb-6 p-5 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:shadow-md transition-all duration-200"
        >
          <div class="flex flex-wrap justify-between mb-3 text-sm gap-3">
            <span class="font-mono text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">{{ commit.hash }}</span>
            <span class="text-gray-500 dark:text-gray-400 flex items-center">
              <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              {{ commit.date }}
            </span>
            <span class="text-gray-500 dark:text-gray-400 flex items-center">
              <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              {{ commit.author }}
            </span>
          </div>
          <div class="font-medium mb-3 dark:text-white">{{ commit.message }}</div>
          <div class="flex flex-wrap gap-2">
            <span 
              v-for="(file, index) in commit.files" 
              :key="index" 
              class="text-xs py-1.5 px-3 bg-gray-200 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300"
            >
              {{ file }}
            </span>
          </div>
        </div>
      </div>

      <!-- Contributors tab -->
      <div v-else-if="activeContent === 'contributors'" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="contributor in contributors" 
          :key="contributor.id" 
          class="flex items-center p-5 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-all duration-200"
        >
          <img 
            :src="contributor.avatar" 
            :alt="contributor.name" 
            class="w-16 h-16 rounded-full object-cover mr-4 border-2 border-primary-100 dark:border-primary-900"
          >
          <div>
            <h3 class="m-0 mb-1 font-bold text-lg dark:text-white">{{ contributor.name }}</h3>
            <p class="m-0 mb-2 text-gray-500 dark:text-gray-400 text-sm">{{ contributor.role }}</p>
            <div class="flex items-center text-sm text-primary-600 dark:text-primary-400 font-medium">
              <svg class="w-4 h-4 mr-1.5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M10 1a9 9 0 019 9c0 3.5-2 6.5-5 8-2.5 1-5.5 1-8 0-3-1.5-5-4.5-5-8a9 9 0 019-9zm4.7 4.3a1 1 0 00-1.4 0L8 10.6 6.7 9.3a1 1 0 00-1.4 1.4l2 2c.4.4 1 .4 1.4 0l6-6a1 1 0 000-1.4z" clip-rule="evenodd"></path>
              </svg>
              {{ contributor.contributions }} contributions
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
