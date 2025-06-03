# Component Lifecycle in Vue 3

Understanding the Vue component lifecycle is crucial for building robust applications. This guide covers the lifecycle hooks available in Vue 3's Composition API.

## Lifecycle Hooks Overview

Vue components go through a series of initialization steps when they are created, mounted, updated, and destroyed. Here's the complete lifecycle:

1. **Setup** - The component is being created
2. **onBeforeMount** - Right before the component is mounted to the DOM
3. **onMounted** - After the component is mounted to the DOM
4. **onBeforeUpdate** - When data changes, before the DOM is re-rendered
5. **onUpdated** - After the DOM has been updated
6. **onBeforeUnmount** - Right before the component is unmounted
7. **onUnmounted** - After the component is unmounted
8. **onErrorCaptured** - When an error is captured from a child component

## Basic Usage

```vue
<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="count++">Increment</button>
    <button @click="showChild = !showChild">Toggle Child</button>
    <ChildComponent v-if="showChild" />
  </div>
</template>

<script setup>
import { ref, onBeforeMount, onMounted, onBeforeUpdate, onUpdated, onBeforeUnmount, onUnmounted } from 'vue'
import ChildComponent from './ChildComponent.vue'

const count = ref(0)
const showChild = ref(true)

// Equivalent to beforeCreate and created
console.log('Setup - component is being created')

onBeforeMount(() => {
  console.log('onBeforeMount - before component is mounted to the DOM')
})

onMounted(() => {
  console.log('onMounted - after component is mounted to the DOM')
  // Good place to fetch initial data
  fetchData()
  
  // Set up timers, event listeners, etc.
  const timer = setInterval(() => {
    console.log('Timer tick')
  }, 1000)
  
  // Cleanup function
  return () => {
    console.log('Cleaning up timer')
    clearInterval(timer)
  }
})

onBeforeUpdate(() => {
  console.log('onBeforeUpdate - before DOM is updated')
})

onUpdated(() => {
  console.log('onUpdated - after DOM is updated')
  // Access the updated DOM here
  console.log('Count element:', document.querySelector('p').textContent)
})

onBeforeUnmount(() => {
  console.log('onBeforeUnmount - before component is unmounted')
})

onUnmounted(() => {
  console.log('onUnmounted - after component is unmounted')
  // Clean up any remaining subscriptions, timers, etc.
})

async function fetchData() {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Data fetched')
  } catch (error) {
    console.error('Error fetching data:', error)
  }
}
</script>
```

## Error Handling

### onErrorCaptured

```vue
<template>
  <div>
    <button @click="error = !error">Toggle Error</button>
    <ErrorBoundary>
      <ChildComponent v-if="!error" />
      <div v-else>No component to show</div>
    </ErrorBoundary>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ErrorBoundary from './ErrorBoundary.vue'
import ChildComponent from './ChildComponent.vue'

const error = ref(false)
</script>
```

```vue
<!-- ErrorBoundary.vue -->
<template>
  <slot v-if="!hasError"></slot>
  <div v-else class="error">
    <h3>Something went wrong</h3>
    <p>{{ error }}</p>
    <button @click="resetError">Try again</button>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const hasError = ref(false)
const error = ref(null)

function resetError() {
  hasError.value = false
  error.value = null
}

function captureError(err, instance, info) {
  hasError.value = true
  error.value = {
    message: err.message,
    component: instance?.$options.name || 'Unknown',
    info
  }
  
  // You can also log the error to an error reporting service
  console.error('Error captured:', error.value)
  
  // Return false to prevent the error from propagating further
  return false
}

defineExpose({
  captureError
})
</script>

<style scoped>
.error {
  padding: 1rem;
  background-color: #ffebee;
  border: 1px solid #ef9a9a;
  border-radius: 4px;
  color: #c62828;
}

button {
  margin-top: 0.5rem;
  padding: 0.25rem 0.5rem;
  background-color: #ef9a9a;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #e57373;
}
</style>
```

## Server-Side Rendering (SSR) Lifecycle

When using SSR, some lifecycle hooks are only called on the server or client:

```vue
<script setup>
import { onMounted, onBeforeMount } from 'vue'

// This will be called on both server and client
onMounted(() => {
  console.log('Mounted')
})

// Check if code is running on the server or client
if (import.meta.env.SSR) {
  // Server-side only code
  console.log('This will only be logged on the server')
} else {
  // Client-side only code
  console.log('This will only be logged on the client')
}

// You can also use process.server (Nuxt) or import.meta.env.SSR (Vite)
</script>
```

## Lifecycle Hooks in `<script setup>` vs Options API

| Composition API (`<script setup>`) | Options API | Timing |
|-----------------------------------|-------------|--------|
| - | `beforeCreate` | Before instance is created |
| - | `created` | After instance is created |
| `onBeforeMount` | `beforeMount` | Before mounting begins |
| `onMounted` | `mounted` | After component is mounted |
| `onBeforeUpdate` | `beforeUpdate` | When data changes, before re-render |
| `onUpdated` | `updated` | After re-render |
| `onBeforeUnmount` | `beforeUnmount` | Before unmounting |
| `onUnmounted` | `unmounted` | After unmounting |
| `onErrorCaptured` | `errorCaptured` | When error is captured |
| `onRenderTracked` | `renderTracked` | When a reactive dependency is tracked |
| `onRenderTriggered` | `renderTriggered` | When a reactive dependency triggers re-render |
| `onActivated` | `activated` | When kept-alive component is activated |
| `onDeactivated` | `deactivated` | When kept-alive component is deactivated |

## Best Practices

1. **Data Fetching**: Use `onMounted` for client-side data fetching. For SSR, consider using `onServerPrefetch` or framework-specific hooks.

2. **Event Listeners**: Add event listeners in `onMounted` and remove them in `onUnmounted`.

3. **Timers and Intervals**: Always clean up timers and intervals in the cleanup function of `onMounted` or in `onUnmounted`.

4. **Global Event Bus**: If using a global event bus, remember to remove listeners in `onUnmounted`.

5. **Third-party Libraries**: Initialize libraries that need DOM access in `onMounted` and clean them up in `onUnmounted`.

6. **Performance**: Be mindful of expensive operations in `onUpdated` as they can cause performance issues.

7. **Error Handling**: Always implement error handling, especially for async operations in lifecycle hooks.

## Example: Using with Async/Await

```vue
<template>
  <div>
    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else>{{ data }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const data = ref(null)
const loading = ref(false)
const error = ref(null)

async function fetchData() {
  loading.value = true
  error.value = null
  
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    data.value = 'Data loaded successfully!'
  } catch (err) {
    error.value = err
    console.error('Failed to fetch data:', err)
  } finally {
    loading.value = false
  }
}

// Fetch data when component is mounted
onMounted(fetchData)

// You can also expose the fetchData function to the template if needed
defineExpose({
  fetchData
})
</script>
```

## Debugging Lifecycle Hooks

You can use the `onRenderTracked` and `onRenderTriggered` hooks to debug what's causing component re-renders:

```vue
<script setup>
import { ref, onRenderTracked, onRenderTriggered } from 'vue'

const count = ref(0)
const name = ref('Vue')

function increment() {
  count.value++
}

// Called when a reactive dependency is first accessed during render
onRenderTracked((e) => {
  console.log('Dependency tracked:', e)
})

// Called when a dependency triggers a re-render
onRenderTriggered((e) => {
  console.log('Dependency triggered re-render:', e)
})
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Name: {{ name }}</p>
    <button @click="increment">Increment</button>
    <button @click="name += '!'">Append !</button>
  </div>
</template>
```

## Lifecycle in Custom Hooks

You can also encapsulate lifecycle logic in custom composables:

```js
// useWindowSize.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useWindowSize() {
  const width = ref(window.innerWidth)
  const height = ref(window.innerHeight)
  
  function update() {
    width.value = window.innerWidth
    height.value = window.innerHeight
  }
  
  onMounted(() => {
    window.addEventListener('resize', update)
  })
  
  onUnmounted(() => {
    window.removeEventListener('resize', update)
  })
  
  return { width, height }
}
```

```vue
<script setup>
import { useWindowSize } from './composables/useWindowSize'

const { width, height } = useWindowSize()
</script>

<template>
  <div>
    <p>Window size: {{ width }} x {{ height }}</p>
  </div>
</template>
```
