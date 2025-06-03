# Rendering Modes

Our framework supports multiple rendering strategies to optimize performance and user experience.

## Server-Side Rendering (SSR)

SSR generates HTML on the server for better initial load performance and SEO.

### Enabling SSR

```ts
// vite.config.ts
export default defineConfig({
  ssr: {
    noExternal: ['your-package-name']
  }
})
```

### SSR Data Fetching

```vue
<script setup>
// This will be called on both server and client
const { data } = await useAsyncData('key', () => {
  return $fetch('/api/data')
})
</script>

<template>
  <div>{{ data }}</div>
</template>
```

### SSR-Specific Code

```js
// This code will only run on the server
if (process.server) {
  console.log('Running on server')
}

// This code will only run on the client
if (process.client) {
  console.log('Running on client')
}
```

## Static Site Generation (SSG)

Generate static HTML at build time for maximum performance.

### Basic SSG

```ts
// vite.config.ts
export default defineConfig({
  ssg: true
})
```

### Dynamic Routes

```ts
// pages/users/[id].vue
export default defineComponent({
  async asyncData({ params }) {
    return {
      user: await $fetch(`/api/users/${params.id}`)
    }
  }
})
```

### Prerendering Specific Routes

```ts
// vite.config.ts
export default defineConfig({
  ssg: {
    routes: ['/about', '/contact']
  }
})
```

## Hybrid Rendering

Combine different rendering strategies for different routes.

### Route Rules

```ts
// vite.config.ts
export default defineConfig({
  routeRules: {
    // Static generation
    '/': { prerender: true },
    // Server-side rendering at runtime
    '/profile': { ssr: true },
    // Client-side only
    '/dashboard': { ssr: false },
    // Switches to client-side rendering after initial load
    '/app/**': { swr: true },
    // Add custom headers to responses
    '/api/*': { headers: { 'cache-control': 's-maxage=3600' } },
    // Redirects
    '/old-page': { redirect: '/new-page' },
    // Disable server-side rendering
    '/private': { ssr: false },
    // Add CORS headers
    '/api/v1/**': { cors: true, headers: { 'access-control-allow-methods': 'GET' } }
  }
})
```

## Client-Side Hydration

### Hydration Mismatch Warnings

```vue
<template>
  <div>
    <!-- This will cause a hydration mismatch -->
    <div v-if="isClient">Client only content</div>
  </div>
</template>

<script setup>
const isClient = process.client
</script>
```

### Client-Only Components

```vue
<template>
  <ClientOnly>
    <!-- This component will only be rendered on client-side -->
    <ClientSideComponent />
    
    <!-- Optional fallback until component is mounted -->
    <template #fallback>
      <div>Loading...</div>
    </template>
  </ClientOnly>
</template>
```

## Rendering Performance

### Lazy Loading Components

```vue
<script setup>
const LazyComponent = defineAsyncComponent(
  () => import('@/components/HeavyComponent.vue')
)
</script>

<template>
  <Suspense>
    <LazyComponent />
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>
```

### Image Optimization

```vue
<template>
  <img 
    v-lazy="'/images/example.jpg'" 
    alt="Example"
    loading="lazy"
  />
</template>

<script setup>
import { useImage } from '@vueuse/components'

const { src, isLoading, error } = useImage({
  src: '/images/example.jpg',
  // Responsive images
  srcset: [
    { src: '/images/example-400.jpg', width: 400 },
    { src: '/images/example-800.jpg', width: 800 },
  ],
  // Lazy loading
  lazy: true,
  // Placeholder
  placeholder: '/images/placeholder.jpg',
  // Blur hash or low-quality image placeholder
  placeholderSrc: 'data:image/svg+xml;base64,...',
  // Error fallback
  fallback: '/images/fallback.jpg',
  // Alternative text
  alt: 'Example image'
})
</script>
```

## Rendering Optimization

### Virtual Scrolling

```vue
<template>
  <VirtualScroller
    :items="largeList"
    :item-height="50"
    :height="500"
    :buffer="10"
  >
    <template #default="{ item, index }">
      <div :class="['item', { even: index % 2 === 0 }]">
        {{ item.name }}
      </div>
    </template>
  </VirtualScroller>
</template>

<script setup>
import { ref } from 'vue'
import { useVirtualList } from '@vueuse/core'

const searchQuery = ref('')
const allItems = ref(/* large array of items */)

const { list, containerProps, wrapperProps } = useVirtualList(
  allItems,
  {
    itemHeight: 50,
    overscan: 10,
  }
)
</script>

<style scoped>
.item {
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid #eee;
}

.item.even {
  background-color: #f9f9f9;
}
</style>
```

### Deferred Components

```vue
<template>
  <div>
    <HeavyComponent v-if="isVisible" />
    <button @click="isVisible = true">Show Heavy Component</button>
  </div>
</template>

<script setup>
import { ref, defineAsyncComponent } from 'vue'

const isVisible = ref(false)
const HeavyComponent = defineAsyncComponent(() => 
  import('@/components/HeavyComponent.vue')
)
</script>
```

## Rendering Modes Comparison

| Mode | Description | Use Case |
|------|-------------|----------|
| **SSR** | Rendered on server, hydrated on client | Content-heavy sites, SEO |
| **SSG** | Pre-rendered at build time | Blogs, documentation |
| **CSR** | Rendered entirely in browser | Web applications, dashboards |
| **ISR** | Revalidates in background | E-commerce, news sites |
| **DSG** | Deferred static generation | Large sites with many pages |

## Rendering Hooks

### Lifecycle Hooks

```vue
<script setup>
// Server and client
onMounted(() => {
  console.log('Mounted on client')
})

onBeforeMount(() => {
  console.log('Before mount')
})

onBeforeUnmount(() => {
  console.log('Before unmount')
})

onUnmounted(() => {
  console.log('Unmounted')
})


// SSR only
onServerPrefetch(async () => {
  // Pre-fetch data on server
  await fetchData()
})


// Client only
onBeforeUpdate(() => {
  console.log('Before update')
})


onUpdated(() => {
  console.log('Updated')
})

onActivated(() => {
  console.log('Activated')
})

onDeactivated(() => {
  console.log('Deactivated')
})
</script>
```

### Error Handling

```vue
<template>
  <div>
    <ErrorBoundary>
      <ComponentThatMightError />
      <template #fallback="{ error }">
        <p>An error occurred: {{ error.message }}</p>
        <button @click="resetError">Try again</button>
      </template>
    </ErrorBoundary>
  </div>
</template>

<script setup>
import { onErrorCaptured, ref } from 'vue'

const error = ref(null)

onErrorCaptured((err, instance, info) => {
  error.value = err
  // Prevent the error from propagating further
  return false
})

function resetError() {
  error.value = null
}
</script>
```

## Rendering Optimization Techniques

### `v-once` for Static Content

```vue
<template>
  <div>
    <!-- This will never change -->
    <div v-once>{{ staticContent }}</div>
    
    <!-- This can change -->
    <div>{{ dynamicContent }}</div>
  </div>
</template>
```

### `v-memo` for Expensive Updates

```vue
<template>
  <div v-for="item in items" :key="item.id" v-memo="[item.id === selected]">
    <p>ID: {{ item.id }}</p>
    <p>Selected: {{ item.id === selected ? 'Yes' : 'No' }}</p>
  </div>
</template>
```

### Keep-Alive for State Preservation

```vue
<template>
  <KeepAlive :include="cachedComponents">
    <component :is="currentComponent" />
  </KeepAlive>
</template>

<script setup>
import { ref, computed } from 'vue'

const currentComponent = ref('ComponentA')
const cachedComponents = computed(() => {
  return ['ComponentA', 'ComponentB']
})
</script>
```

## Rendering Performance Monitoring

### Using Performance API

```ts
function measurePerf() {
  // Start measuring
  performance.mark('start-loading')
  
  // Your code here
  
  // Stop measuring
  performance.mark('end-loading')
  performance.measure('Page Load', 'start-loading', 'end-loading')
  
  // Get the measurement
  const measures = performance.getEntriesByName('Page Load')
  console.log('Page load time:', measures[0].duration)
}
```

### Using Web Vitals

```ts
import { getCLS, getFID, getLCP } from 'web-vitals'

getCLS(console.log)
getFID(console.log)
getLCP(console.log)
```

## Server-Sent Events (SSE)

```vue
<template>
  <div>
    <div v-for="message in messages" :key="message.id">
      {{ message.text }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const messages = ref([])
let eventSource = null

onMounted(() => {
  eventSource = new EventSource('/api/events')
  
  eventSource.onmessage = (event) => {
    messages.value.push(JSON.parse(event.data))
  }
  
  eventSource.onerror = (error) => {
    console.error('EventSource failed:', error)
    eventSource.close()
  }
})

onUnmounted(() => {
  if (eventSource) {
    eventSource.close()
  }
})
</script>
```

## Web Components

### Using Web Components

```vue
<template>
  <div>
    <my-web-component :data="componentData">
      <p>Default slot content</p>
    </my-web-component>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const componentData = ref({
  title: 'Hello',
  items: ['One', 'Two', 'Three']
})

// Register the web component
if (process.client) {
  await import('@webcomponents/webcomponentsjs')
  await import('my-web-component')
}
</script>
```

### Creating Web Components

```ts
// components/MyComponent.ce.vue
<template>
  <div>
    <h1>{{ title }}</h1>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'MyComponent',
  props: {
    title: {
      type: String,
      default: 'Hello World'
    }
  }
}
</script>
```

```ts
// main.ts
import { defineCustomElement } from 'vue'
import MyComponent from './components/MyComponent.ce.vue'

// Convert to custom element constructor
const MyElement = defineCustomElement(MyComponent)

// Register the custom element
customElements.define('my-element', MyElement)
```

## Rendering Strategies for Mobile

### Adaptive Loading

```vue
<template>
  <div>
    <component :is="currentView" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineAsyncComponent } from 'vue'

const isMobile = ref(false)

const DesktopView = defineAsyncComponent(() => import('@/views/DesktopView.vue'))
const MobileView = defineAsyncComponent(() => import('@/views/MobileView.vue'))

const currentView = computed(() => {
  return isMobile.value ? MobileView : DesktopView
})

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})
</script>
```

### Touch vs Mouse Events

```vue
<template>
  <div 
    @touchstart="handleTouchStart"
    @mousedown="handleMouseDown"
    @touchmove.passive="handleTouchMove"
    @mousemove.passive="handleMouseMove"
    @touchend="handleTouchEnd"
    @mouseup="handleMouseUp"
    @touchcancel="handleTouchCancel"
  >
    <!-- Content -->
  </div>
</template>

<script setup>
const isTouchDevice = ref(false)

const handleTouchStart = (e) => {
  isTouchDevice.value = true
  // Handle touch start
}

const handleMouseDown = (e) => {
  if (!isTouchDevice.value) {
    // Handle mouse down
  }
}

// Similar handlers for other events
</script>
```

## Rendering Large Lists

### Window Virtualization

```vue
<template>
  <RecycleScroller
    class="scroller"
    :items="items"
    :item-size="50"
    key-field="id"
    v-slot="{ item }"
  >
    <div class="item">
      {{ item.name }}
    </div>
  </RecycleScroller>
</template>

<script setup>
import { RecycleScroller } from 'vue-virtual-scroller'
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'

const items = ref(/* large array of items */)
</script>

<style scoped>
.scroller {
  height: 500px;
  overflow-y: auto;
}

.item {
  height: 50px;
  padding: 12px;
  border-bottom: 1px solid #eee;
}
</style>
```

### Infinite Scrolling

```vue
<template>
  <div class="infinite-scroll" @scroll="handleScroll">
    <div v-for="item in visibleItems" :key="item.id" class="item">
      {{ item.content }}
    </div>
    <div v-if="isLoading" class="loading">
      Loading more...
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const items = ref([])
const visibleItems = ref([])
const isLoading = ref(false)
const page = ref(1)
const pageSize = 20

const loadMore = async () => {
  if (isLoading.value) return
  
  isLoading.value = true
  
  try {
    const newItems = await fetchItems(page.value, pageSize)
    items.value = [...items.value, ...newItems]
    visibleItems.value = items.value.slice(0, page.value * pageSize)
    page.value++
  } catch (error) {
    console.error('Error loading items:', error)
  } finally {
    isLoading.value = false
  }
}

const handleScroll = (e) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target
  const threshold = 100 // pixels from bottom
  
  if (scrollHeight - (scrollTop + clientHeight) < threshold) {
    loadMore()
  }
}

// Initial load
onMounted(() => {
  loadMore()
})
</script>

<style scoped>
.infinite-scroll {
  height: 500px;
  overflow-y: auto;
  border: 1px solid #eee;
}

.item {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.loading {
  padding: 16px;
  text-align: center;
  color: #666;
}
</style>
```

## Rendering Optimization for Animations

### CSS Transitions

```vue
<template>
  <div>
    <button @click="show = !show">Toggle</button>
    <Transition name="fade">
      <p v-if="show">Hello</p>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

### JavaScript Animations

```vue
<template>
  <div ref="el" class="box"></div>
  <button @click="animate">Animate</button>
</template>

<script setup>
import { ref } from 'vue'
import { useElementSize, useRafFn } from '@vueuse/core'

const el = ref(null)
const { width } = useElementSize(el)
const x = ref(0)

function animate() {
  x.value = 0
  
  const start = performance.now()
  const duration = 1000 // ms
  
  function step(timestamp) {
    const progress = (timestamp - start) / duration
    
    if (progress < 1) {
      x.value = easeInOutQuad(progress) * (width.value - 100)
      requestAnimationFrame(step)
    } else {
      x.value = width.value - 100
    }
  }
  
  requestAnimationFrame(step)
}

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
}
</script>

<style scoped>
.box {
  width: 100%;
  height: 100px;
  background-color: #f0f0f0;
  position: relative;
  margin-bottom: 20px;
  overflow: hidden;
}

.box::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 100px;
  height: 100%;
  background-color: #42b983;
  transform: translateX(v-bind('x + "px"'));
  transition: transform 0.1s linear;
}
</style>
```

### FLIP Animations

```vue
<template>
  <div>
    <button @click="toggle">Toggle</button>
    <div class="container">
      <div 
        v-for="item in items" 
        :key="item.id"
        class="item"
        :style="getItemStyle(item)"
        @click="selectItem(item)"
      >
        {{ item.id }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const items = ref(Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  selected: false
})))

const selectedItem = ref(null)

function toggle() {
  items.value = [...items.value].reverse()
}

function selectItem(item) {
  selectedItem.value = selectedItem.value === item.id ? null : item.id
}

function getItemStyle(item) {
  const isSelected = selectedItem.value === item.id
  return {
    order: isSelected ? -1 : 0,
    transform: isSelected ? 'scale(1.1)' : 'scale(1)',
    zIndex: isSelected ? 1 : 0,
    background: isSelected ? '#42b983' : '#f0f0f0',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  }
}
</script>

<style scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 20px;
}

.item {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  cursor: pointer;
  will-change: transform, background;
}
</style>
```

## Rendering Performance Monitoring

### Using Performance Observer

```ts
function observePaintTiming() {
  if (window.PerformancePaintTiming) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log(entry.name, entry.startTime, entry.duration)
      }
    })
    
    observer.observe({ entryTypes: ['paint'] })
    
    return () => observer.disconnect()
  }
}

// Start observing
const stopObserving = observePaintTiming()

// Later, when you want to stop
// stopObserving()
```

### Long Tasks API

```ts
if ('PerformanceLongTaskTiming' in window) {
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      console.log('Long task detected:', entry)
    }
  })
  
  observer.observe({ entryTypes: ['longtask'] })
}
```

### Memory Usage

```ts
function logMemory() {
  if ('memory' in performance) {
    console.log('Memory usage:', performance.memory)
  }
}

// Log memory usage every 5 seconds
setInterval(logMemory, 5000)
```

## Rendering Best Practices

1. **Minimize Component Re-renders**
   - Use `v-once` for static content
   - Use `v-memo` for expensive component updates
   - Use computed properties for derived state

2. **Optimize Component Updates**
   - Split large components into smaller ones
   - Use `shallowRef` and `shallowReactive` for large objects/arrays
   - Avoid inline functions in templates

3. **Lazy Load Non-Critical Components**
   - Use `defineAsyncComponent` for code splitting
   - Load components conditionally
   - Prefetch components that will be needed soon

4. **Optimize Lists**
   - Use `v-for` with `:key`
   - Implement virtual scrolling for long lists
   - Use `v-show` instead of `v-if` when toggling visibility frequently

5. **Optimize Assets**
   - Compress images
   - Use modern image formats (WebP, AVIF)
   - Lazy load images and iframes
   - Use responsive images with `srcset` and `sizes`

6. **Use Web Workers**
   - Offload heavy computations
   - Keep the main thread responsive

7. **Optimize CSS**
   - Use CSS containment
   - Avoid complex selectors
   - Use `will-change` sparingly
   - Use `content-visibility: auto` for offscreen content

8. **Monitor Performance**
   - Use the Performance API
   - Monitor Web Vitals
   - Set up performance budgets
   - Use the Chrome DevTools Performance panel

9. **Progressive Enhancement**
   - Build a solid baseline experience
   - Enhance with JavaScript where supported
   - Test on various devices and network conditions

10. **Server-Side Rendering**
    - Use SSR for content-heavy pages
    - Implement streaming SSR for faster time-to-content
    - Use `useSSRContext()` for server-only data
