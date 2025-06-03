# Refactoring Guide

Refactoring is an essential part of maintaining a healthy codebase. This guide provides patterns and strategies for safely refactoring your application.

## When to Refactor

- **Code Smells**: Duplicate code, long methods, large classes
- **Technical Debt**: Quick fixes that need proper implementation
- **Performance Issues**: Inefficient algorithms or data structures
- **Improving Readability**: Complex code that's hard to understand
- **Preparing for New Features**: Making the code more maintainable before adding features

## Common Refactoring Patterns

### 1. Extracting Components

**Before:**

```vue
<template>
  <div class="user-profile">
    <div class="header">
      <h2>{{ user.name }}</h2>
      <p>{{ user.bio }}</p>
    </div>
    <div class="stats">
      <div class="stat">
        <span class="label">Posts</span>
        <span class="value">{{ user.postsCount }}</span>
      </div>
      <!-- More stats -->
    </div>
  </div>
</template>
```

**After:**

```vue
<template>
  <div class="user-profile">
    <UserHeader :user="user" />
    <UserStats :stats="user.stats" />
  </div>
</template>
```

### 2. Composable Functions

**Before:**

```ts
// In component
const searchQuery = ref('')
const searchResults = ref([])
const isLoading = ref(false)

async function search() {
  isLoading.value = true
  try {
    const response = await fetch(`/api/search?q=${searchQuery.value}`)
    searchResults.value = await response.json()
  } catch (error) {
    console.error('Search failed:', error)
  } finally {
    isLoading.value = false
  }
}
```

**After:**

```ts
// In composables/useSearch.ts
export function useSearch() {
  const searchQuery = ref('')
  const searchResults = ref([])
  const isLoading = ref(false)

  async function search() {
    isLoading.value = true
    try {
      const response = await fetch(`/api/search?q=${searchQuery.value}`)
      searchResults.value = await response.json()
    } catch (error) {
      console.error('Search failed:', error)
    } finally {
      isLoading.value = false
    }
  }

  return {
    searchQuery,
    searchResults,
    isLoading,
    search,
  }
}

// In component
const { searchQuery, searchResults, isLoading, search } = useSearch()
```

### 3. Using TypeScript Effectively

**Before:**

```ts
interface User {
  id: number
  name: string
  email: string
}

const user = ref({} as User)
```

**After:**

```ts
interface User {
  id: number
  name: string
  email: string
}

const user = ref<Partial<User>>({})
```

## Refactoring Strategies

### 1. Small, Incremental Changes

- Make small, focused changes
- Commit frequently
- Write tests before refactoring when possible

### 2. Test-Driven Refactoring

1. Write a failing test
2. Make the test pass
3. Refactor while keeping tests green
4. Repeat

### 3. Feature Flags

For larger refactors, use feature flags to gradually roll out changes:

```ts
// config/feature-flags.ts
export const featureFlags = {
  useNewSearch: import.meta.env.VITE_FEATURE_NEW_SEARCH === 'true',
}

// In component
if (featureFlags.useNewSearch) {
  // New implementation
} else {
  // Old implementation
}
```

## Common Refactoring Scenarios

### 1. Component Composition

**Problem:** A component is doing too much.

**Solution:** Break it down into smaller, focused components.

### 2. State Management

**Problem:** State is scattered across multiple components.

**Solution:** Move state to Pinia stores.

### 3. API Layer

**Problem:** Direct API calls in components.

**Solution:** Create a dedicated API service layer.

```ts
// services/api.ts
const API_BASE = import.meta.env.VITE_API_BASE_URL

export const fetchUser = async (id: number): Promise<User> => {
  const response = await fetch(`${API_BASE}/users/${id}`)
  return response.json()
}
```

## Performance Refactoring

### 1. Lazy Loading

```ts
// Before
import HeavyComponent from '@/components/HeavyComponent.vue'


// After
const HeavyComponent = defineAsyncComponent(
  () => import('@/components/HeavyComponent.vue')
)
```

### 2. Virtual Scrolling

For long lists, use virtual scrolling:

```vue
<template>
  <VirtualScroller
    :items="largeList"
    :item-height="50"
    :height="500"
  >
    <template #default="{ item }">
      <div>{{ item.name }}</div>
    </template>
  </VirtualScroller>
</template>
```

## Code Smells to Watch For

1. **Long Parameter Lists**
   - Use objects to group related parameters

2. **Primitive Obsession**
   - Create value objects for domain concepts

3. **Switch Statements**
   - Use polymorphism or strategy pattern

4. **Temporary Fields**
   - Create a proper class or object

## Refactoring Tools

1. **VS Code Refactoring**
   - Rename Symbol (F2)
   - Extract to Method/Function
   - Extract to Component

2. **ESLint**
   - `--fix` flag for auto-fixable issues
   - Custom rules for project-specific patterns

3. **TypeScript**
   - Type inference and checking
   - Refactoring with confidence

## Before You Commit

1. Run tests
2. Check for console errors
3. Verify functionality
4. Ensure code is properly formatted
5. Update documentation if needed

## Example: Full Component Refactor

### Before:

```vue
<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else>
      <h1>{{ user.name }}</h1>
      <p>{{ user.email }}</p>
      <button @click="fetchUserData">Refresh</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      user: {},
      loading: false,
      error: null
    }
  },
  async created() {
    await this.fetchUserData()
  },
  methods: {
    async fetchUserData() {
      this.loading = true
      try {
        const response = await fetch('/api/user')
        this.user = await response.json()
      } catch (err) {
        this.error = err.message
        console.error('Failed to fetch user:', err)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
```

### After:

```vue
<template>
  <div class="user-profile">
    <LoadingSpinner v-if="isLoading" />
    <ErrorAlert v-else-if="error" :message="error" />
    <template v-else>
      <UserHeader :user="user" />
      <button 
        class="refresh-button"
        @click="fetchUser"
        :disabled="isLoading"
      >
        Refresh
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import ErrorAlert from '@/components/ui/ErrorAlert.vue'
import UserHeader from '@/components/UserHeader.vue'

const userStore = useUserStore()
const { user, fetchUser, isLoading, error } = userStore

onMounted(() => {
  if (!user) {
    fetchUser()
  }
})
</script>

<style scoped>
.user-profile {
  max-width: 600px;
  margin: 0 auto;
  padding: 1rem;
}

.refresh-button {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
}
</style>
```

This refactored version:
1. Uses the Composition API with `<script setup>`
2. Moves state management to a Pinia store
3. Extracts UI components
4. Adds proper TypeScript types
5. Improves error handling
6. Adds loading states
7. Includes basic styling
