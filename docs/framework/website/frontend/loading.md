# Loading States

Handling loading states properly is crucial for a good user experience. This guide covers various patterns for managing loading states in your application.

## Basic Loading State

```vue
<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else>{{ data }}</div>
  </div>
</template>

<script setup>
const data = ref(null)
const loading = ref(false)
const error = ref(null)

async function fetchData() {
  loading.value = true
  error.value = null
  
  try {
    const response = await fetch('/api/data')
    if (!response.ok) throw new Error('Failed to fetch data')
    data.value = await response.json()
  } catch (err) {
    error.value = err
    console.error('Error fetching data:', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>
```

## Skeleton Loaders

```vue
<template>
  <div>
    <div v-if="loading">
      <div class="skeleton h-8 w-3/4 mb-4"></div>
      <div class="skeleton h-4 w-1/2 mb-2"></div>
      <div class="skeleton h-4 w-2/3"></div>
    </div>
    <div v-else>
      <h1 class="text-2xl font-bold">{{ data.title }}</h1>
      <p>{{ data.description }}</p>
    </div>
  </div>
</template>

<style scoped>
.skeleton {
  @apply bg-gray-200 dark:bg-gray-700 rounded animate-pulse;
}
</style>
```

## Global Loading State

### Using Vue's Provide/Inject

```js
// plugins/loading.js
export default {
  install: (app) => {
    const loading = ref(false)
    
    const startLoading = () => loading.value = true
    const stopLoading = () => loading.value = false
    
    app.provide('loading', {
      loading,
      startLoading,
      stopLoading
    })
    
    // Add global methods
    app.config.globalProperties.$startLoading = startLoading
    app.config.globalProperties.$stopLoading = stopLoading
  }
}
```

### Using the Loading Plugin

```vue
<template>
  <div>
    <button @click="fetchData">
      {{ $loading.isLoading ? 'Loading...' : 'Load Data' }}
    </button>
  </div>
</template>

<script setup>
const { $loading } = useNuxtApp()

async function fetchData() {
  $loading.start()
  try {
    await $fetch('/api/data')
  } finally {
    $loading.finish()
  }
}
</script>
```

## Route-Based Loading

```js
// plugins/router.js
export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter()
  
  router.beforeEach((to, from, next) => {
    nuxtApp.$loading.start()
    next()
  })
  
  router.afterEach(() => {
    setTimeout(() => {
      nuxtApp.$loading.finish()
    }, 500)
  })
  
  router.onError(() => {
    nuxtApp.$loading.finish()
  })
})
```

## Optimistic Updates

```vue
<template>
  <button 
    @click="toggleLike"
    :disabled="isUpdating" 
    :class="{ 'opacity-50': isUpdating }"
  >
    {{ isLiked ? 'Unlike' : 'Like' }}
  </button>
</template>

<script setup>
const props = defineProps({
  postId: {
    type: String,
    required: true
  }
})

const isLiked = ref(false)
const isUpdating = ref(false)

async function toggleLike() {
  const wasLiked = isLiked.value
  
  // Optimistically update UI
  isLiked.value = !wasLiked
  isUpdating.value = true
  
  try {
    await $fetch(`/api/posts/${props.postId}/like`, {
      method: 'POST',
      body: { like: !wasLiked }
    })
  } catch (error) {
    // Revert on error
    isLiked.value = wasLiked
    console.error('Failed to update like:', error)
  } finally {
    isUpdating.value = false
  }
}
</script>
```

## Best Practices

1. **Show Immediate Feedback**: Display a loading state as soon as an action is taken
2. **Use Skeleton Screens**: For better perceived performance
3. **Optimistic Updates**: Update the UI before the server responds when possible
4. **Error States**: Always handle and display errors gracefully
5. **Timeouts**: Consider implementing timeouts for long-running operations
6. **Progressive Loading**: Load critical content first, then non-critical content
7. **Caching**: Cache responses when appropriate to reduce loading times

## Loading Indicators

### NProgress

```js
// plugins/nprogress.js
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hooks.hook('page:start', () => {
    NProgress.start()
  })
  
  nuxtApp.hooks.hook('page:finish', () => {
    NProgress.done()
  })
  
  // Optional: configure NProgress
  NProgress.configure({ showSpinner: false })
})
```

### Custom Loading Component

```vue
<!-- components/LoadingBar.vue -->
<template>
  <div 
    v-if="isLoading"
    class="fixed top-0 left-0 right-0 h-1 bg-blue-500 z-50"
    :class="{ 'animate-pulse': isPending }"
  ></div>
</template>

<script setup>
const { $loading } = useNuxtApp()
const isLoading = ref(false)
const isPending = ref(false)

watch(() => $loading.isLoading, (newVal) => {
  if (newVal) {
    isLoading.value = true
    isPending.value = true
  } else {
    isPending.value = false
    // Add a small delay before hiding to complete the animation
    setTimeout(() => {
      isLoading.value = false
    }, 400)
  }
})
</script>
```

## Lazy Loading Components

```vue
<template>
  <div>
    <button @click="show = true">Show Heavy Component</button>
    
    <Suspense v-if="show" @pending="onPending" @resolve="onResolve">
      <LazyHeavyComponent />
      
      <template #fallback>
        <div>Loading component...</div>
      </template>
    </Suspense>
  </div>
</template>

<script setup>
const show = ref(false)
const isComponentLoading = ref(false)

function onPending() {
  isComponentLoading.value = true
}

function onResolve() {
  isComponentLoading.value = false
}

const LazyHeavyComponent = defineAsyncComponent(
  () => import('@/components/HeavyComponent.vue')
)
</script>
```
