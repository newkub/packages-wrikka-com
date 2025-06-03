# Data Fetching

Our framework provides multiple ways to fetch and manage data in your application, from simple API calls to advanced state management solutions.

## Basic Fetching

### Using `useFetch` Composable

```vue
<script setup>
const { data, pending, error, refresh } = await useFetch('/api/data')
</script>

<template>
  <div>
    <div v-if="pending">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>
    <div v-else>{{ data }}</div>
    <button @click="refresh">Refresh</button>
  </div>
</template>
```

### Fetch Options

```ts
const { data } = await useFetch('/api/items', {
  // Request method
  method: 'POST',
  
  // Request headers
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer token'
  },
  
  // Query parameters
  params: {
    page: 1,
    limit: 10
  },
  
  // Request body
  body: {
    name: 'New Item',
    description: 'Item description'
  },
  
  // Timeout in milliseconds
  timeout: 5000,
  
  // Base URL (if different from app's base URL)
  baseURL: 'https://api.example.com',
  
  // Response type (default: 'json')
  responseType: 'json',
  
  // Whether to retry failed requests
  retry: 3,
  
  // Retry delay in milliseconds
  retryDelay: 1000,
  
  // Whether to parse JSON response automatically
  parseResponse: true,
  
  // Whether to stringify request body automatically
  stringifyBody: true,
  
  // Whether to throw an error on non-2xx response
  throwOnError: true
})
```

## Advanced Fetching

### Lazy Fetching

```vue
<script setup>
const { data, pending, execute } = useLazyFetch('/api/data')
</script>

<template>
  <div>
    <button @click="execute">Load Data</button>
    <div v-if="pending">Loading...</div>
    <div v-else>{{ data }}</div>
  </div>
</template>
```

### Server-Side Fetching

```vue
<script setup>
// This will be called on both server and client
const { data } = await useAsyncData('key', () => {
  return $fetch('/api/data')
})
</script>
```

### Dependent Fetching

```vue
<script setup>
const userId = ref(1)

// Will refetch when userId changes
const { data: user } = await useAsyncData(
  'user',
  () => $fetch(`/api/users/${userId.value}`),
  {
    watch: [userId]
  }
)
</script>
```

## State Management

### Using `useState`

```vue
<script setup>
const count = useState('counter', () => 0)

function increment() {
  count.value++
}
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>
```

### Using Pinia (Recommended)

1. Create a store:

```ts
// stores/counter.ts
export const useCounterStore = defineStore('counter', {
  state: () => ({
    count: 0
  }),
  getters: {
    doubleCount: (state) => state.count * 2
  },
  actions: {
    increment() {
      this.count++
    }
  }
})
```

2. Use in components:

```vue
<script setup>
import { useCounterStore } from '~/stores/counter'

const counter = useCounterStore()
</script>

<template>
  <div>
    <p>Count: {{ counter.count }}</p>
    <p>Double: {{ counter.doubleCount }}</p>
    <button @click="counter.increment()">Increment</button>
  </div>
</template>
```

## Error Handling

### Global Error Handler

```ts
// plugins/error-handler.ts
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    console.error('Vue error:', error)
    // Send to error tracking service
  }
  
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled rejection:', event.reason)
    // Send to error tracking service
  })
})
```

### Local Error Handling

```vue
<script setup>
const { data, error } = await useFetch('/api/data')

if (error.value) {
  // Handle error
  console.error('Failed to fetch data:', error.value)
}
</script>
```

## Caching and Revalidation

### Stale-While-Revalidate

```vue
<script setup>
const { data } = await useFetch('/api/data', {
  // Return cached data while revalidating
  stale: true,
  
  // Revalidate every 60 seconds
  revalidate: 60,
  
  // Don't revalidate if tab is in background
  revalidateIfStale: false,
  
  // Don't revalidate on mount if data exists
  revalidateOnMount: 'if-data-loaded'
})
</script>
```

### Manual Revalidation

```vue
<script setup>
const { data, revalidate } = await useFetch('/api/data')

// Manually revalidate when needed
function refreshData() {
  revalidate()
}
</script>
```

## Optimistic Updates

```vue
<script setup>
import { ref } from 'vue'

const todos = ref([
  { id: 1, text: 'Learn Vue', completed: false },
  { id: 2, text: 'Build something awesome', completed: false }
])

async function toggleTodo(id) {
  // Save the old state in case we need to rollback
  const oldTodos = [...todos.value]
  
  // Optimistically update the UI
  const index = todos.value.findIndex(todo => todo.id === id)
  if (index !== -1) {
    todos.value[index] = {
      ...todos.value[index],
      completed: !todos.value[index].completed
    }
  }
  
  try {
    // Make the API call
    await $fetch(`/api/todos/${id}/toggle`, {
      method: 'PATCH'
    })
  } catch (error) {
    // Revert on error
    todos.value = oldTodos
    console.error('Failed to update todo:', error)
  }
}
</script>

<template>
  <ul>
    <li v-for="todo in todos" :key="todo.id">
      <input 
        type="checkbox" 
        :checked="todo.completed"
        @change="toggleTodo(todo.id)"
      >
      <span :class="{ 'line-through': todo.completed }">
        {{ todo.text }}
      </span>
    </li>
  </ul>
</template>
```

## Real-time Data

### WebSocket Example

```vue
<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const messages = ref([])
let socket = null

onMounted(() => {
  socket = new WebSocket('wss://api.example.com/ws')
  
  socket.onopen = () => {
    console.log('WebSocket connected')
  }
  
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data)
    messages.value.push(message)
  }
  
  socket.onclose = () => {
    console.log('WebSocket disconnected')
  }
  
  socket.onerror = (error) => {
    console.error('WebSocket error:', error)
  }
})

onUnmounted(() => {
  if (socket) {
    socket.close()
  }
})

function sendMessage(message) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ text: message }))
  }
}
</script>

<template>
  <div>
    <div v-for="(msg, index) in messages" :key="index">
      {{ msg.text }}
    </div>
    <input 
      type="text" 
      v-model="newMessage" 
      @keyup.enter="sendMessage(newMessage); newMessage = ''"
    >
  </div>
</template>
```

## File Uploads

### Single File Upload

```vue
<template>
  <div>
    <input type="file" @change="handleFileUpload" />
    <button @click="uploadFile" :disabled="!file || isUploading">
      {{ isUploading ? 'Uploading...' : 'Upload' }}
    </button>
    <div v-if="uploadProgress > 0">
      Progress: {{ uploadProgress }}%
    </div>
    <div v-if="uploadError" class="error">
      {{ uploadError }}
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const file = ref(null)
const isUploading = ref(false)
const uploadProgress = ref(0)
const uploadError = ref(null)

function handleFileUpload(event) {
  file.value = event.target.files[0]
}

async function uploadFile() {
  if (!file.value) return
  
  const formData = new FormData()
  formData.append('file', file.value)
  
  isUploading.value = true
  uploadError.value = null
  
  try {
    const response = await $fetch('/api/upload', {
      method: 'POST',
      body: formData,
      onUploadProgress: (progressEvent) => {
        if (progressEvent.lengthComputable) {
          uploadProgress.value = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          )
        }
      }
    })
    
    console.log('Upload successful:', response)
    // Handle successful upload
    
  } catch (error) {
    console.error('Upload failed:', error)
    uploadError.value = 'Failed to upload file. Please try again.'
  } finally {
    isUploading.value = false
  }
}
</script>

<style scoped>
.error {
  color: red;
  margin-top: 8px;
}
</style>
```

### Multiple File Upload

```vue
<template>
  <div>
    <input 
      type="file" 
      multiple 
      @change="handleFilesSelected" 
      ref="fileInput"
    >
    <button @click="uploadFiles" :disabled="files.length === 0 || isUploading">
      {{ isUploading ? 'Uploading...' : `Upload ${files.length} files` }}
    </button>
    
    <div v-if="uploadProgress.files.length > 0">
      <div v-for="(file, index) in uploadProgress.files" :key="file.name">
        {{ file.name }}: {{ file.progress }}%
        <progress 
          :value="file.progress" 
          max="100"
        ></progress>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const files = ref([])
const fileInput = ref(null)
const isUploading = ref(false)
const uploadProgress = ref({ files: [] })

function handleFilesSelected(event) {
  files.value = Array.from(event.target.files)
}

async function uploadFiles() {
  if (files.value.length === 0) return
  
  isUploading.value = true
  
  // Reset progress
  uploadProgress.value = {
    files: files.value.map(file => ({
      name: file.name,
      progress: 0,
      error: null
    }))
  }
  
  try {
    const uploadPromises = files.value.map((file, index) => {
      const formData = new FormData()
      formData.append('files', file)
      
      return $fetch('/api/upload', {
        method: 'POST',
        body: formData,
        onUploadProgress: (progressEvent) => {
          if (progressEvent.lengthComputable) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            )
            uploadProgress.value.files[index].progress = progress
          }
        }
      })
    })
    
    await Promise.all(uploadPromises)
    console.log('All files uploaded successfully')
    
    // Reset the file input
    if (fileInput.value) {
      fileInput.value.value = ''
      files.value = []
    }
    
  } catch (error) {
    console.error('Upload failed:', error)
    // Handle error
  } finally {
    isUploading.value = false
  }
}
</script>
```

## Data Fetching Best Practices

1. **Use the Right Tool for the Job**
   - Use `useFetch` for one-off data fetching
   - Use `useAsyncData` for server-side rendering
   - Use Pinia for global state management

2. **Handle Loading and Error States**
   - Always show loading indicators
   - Display meaningful error messages
   - Implement retry mechanisms

3. **Optimize Performance**
   - Implement caching where appropriate
   - Use pagination or infinite scroll for large datasets
   - Debounce search inputs

4. **Security**
   - Sanitize user input
   - Use environment variables for API keys
   - Implement proper CORS policies

5. **Error Handling**
   - Catch and handle errors gracefully
   - Log errors for debugging
   - Provide fallback UI

6. **Testing**
   - Mock API responses in tests
   - Test error scenarios
   - Test loading states

7. **Accessibility**
   - Provide loading states for screen readers
   - Handle keyboard navigation
   - Provide error messages that are accessible

8. **Performance Monitoring**
   - Track API response times
   - Monitor error rates
   - Set up alerts for failed requests

9. **Documentation**
   - Document API endpoints
   - Document expected request/response formats
   - Document error codes and messages

10. **Versioning**
    - Version your API
    - Handle deprecated endpoints
    - Provide migration paths for breaking changes
