# Animations in Vue 3

This guide covers various animation techniques in Vue 3, from simple transitions to complex animations.

## Built-in Transition Component

### Basic Fade Transition

```vue
<template>
  <button @click="show = !show">Toggle</button>
  
  <Transition name="fade">
    <p v-if="show">Hello, world!</p>
  </Transition>
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

### Slide Transition

```vue
<template>
  <button @click="show = !show">Toggle Slide</button>
  
  <Transition name="slide">
    <p v-if="show">Sliding content</p>
  </Transition>
</template>

<style scoped>
.slide-enter-active {
  transition: all 0.3s ease-out;
}

.slide-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
```

## Transition Modes

### Out-In Mode

```vue
<template>
  <button @click="isEditing = !isEditing">
    {{ isEditing ? 'Save' : 'Edit' }}
  </button>
  
  <Transition name="fade" mode="out-in">
    <button v-if="isEditing" key="save" @click="isEditing = false">
      Save
    </button>
    <button v-else key="edit" @click="isEditing = true">
      Edit
    </button>
  </Transition>
</template>
```

## List Transitions

### Staggered List

```vue
<template>
  <input v-model="query" placeholder="Filter items" />
  
  <TransitionGroup name="list" tag="ul" class="list">
    <li v-for="item in filteredItems" :key="item.id" class="list-item">
      {{ item.text }}
    </li>
  </TransitionGroup>
</template>

<script setup>
const items = ref([
  { id: 1, text: 'Item 1' },
  { id: 2, text: 'Item 2' },
  { id: 3, text: 'Item 3' },
  { id: 4, text: 'Item 4' },
  { id: 5, text: 'Item 5' }
])

const query = ref('')

const filteredItems = computed(() => {
  return items.value.filter(item => 
    item.text.toLowerCase().includes(query.value.toLowerCase())
  )
})
</script>

<style scoped>
.list {
  list-style: none;
  padding: 0;
}

.list-item {
  padding: 8px 0;
  border-bottom: 1px solid #eee;
  transition: all 0.5s;
}

.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Ensure leaving items are taken out of layout flow
   so that moving animations can be calculated correctly. */
.list-leave-active {
  position: absolute;
  width: 100%;
}

/* Staggering effect */
.list-move, /* apply transition to moving elements */
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* Ensure leaving items are taken out of layout flow */
.list-leave-active {
  position: absolute;
}
</style>
```

## JavaScript Hooks

```vue
<template>
  <button @click="show = !show">Toggle</button>
  
  <Transition
    @before-enter="onBeforeEnter"
    @enter="onEnter"
    @after-enter="onAfterEnter"
    @enter-cancelled="onEnterCancelled"
    @before-leave="onBeforeLeave"
    @leave="onLeave"
    @after-leave="onAfterLeave"
    @leave-cancelled="onLeaveCancelled"
  >
    <div v-if="show" class="box"></div>
  </Transition>
</template>

<script setup>
import { ref } from 'vue'
import gsap from 'gsap'

const show = ref(false)

function onBeforeEnter(el) {
  console.log('before enter')
  gsap.set(el, {
    scaleX: 0.25,
    scaleY: 0.25,
    opacity: 1
  })
}

function onEnter(el, done) {
  console.log('enter')
  gsap.to(el, {
    duration: 1,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
    ease: 'elastic.inOut(2.5, 1)',
    onComplete: done
  })
}

function onAfterEnter(el) {
  console.log('after enter')
}

function onEnterCancelled(el) {
  console.log('enter cancelled')
}

function onBeforeLeave(el) {
  console.log('before leave')
}

function onLeave(el, done) {
  console.log('leave')
  gsap.to(el, {
    duration: 0.7,
    scaleX: 0.1,
    scaleY: 0.1,
    opacity: 0,
    ease: 'elastic.in(1.7, 1)',
    onComplete: done
  })
}

function onAfterLeave(el) {
  console.log('after leave')
}

function onLeaveCancelled(el) {
  console.log('leave cancelled')
}
</script>

<style scoped>
.box {
  width: 100px;
  height: 100px;
  background-color: #42b983;
  margin-top: 10px;
}
</style>
```

## GSAP Integration

### Complex Timeline Animation

```vue
<template>
  <div class="container">
    <button @click="animate = !animate">Toggle Animation</button>
    <div class="box" ref="box"></div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import gsap from 'gsap'

const animate = ref(false)
const box = ref(null)
let tl = null

onMounted(() => {
  // Create timeline
  tl = gsap.timeline({ paused: true })
  
  // Add animations to timeline
  tl.to(box.value, { 
    x: 200, 
    duration: 1, 
    ease: 'power2.out' 
  })
  .to(box.value, { 
    y: 100, 
    duration: 0.5,
    rotation: 360,
    ease: 'bounce.out' 
  }, '>0.5')
  .to(box.value, {
    scale: 1.5,
    duration: 0.5,
    backgroundColor: '#ff6b6b',
    borderRadius: '50%',
    ease: 'elastic.out(1, 0.5)'
  })
  .to(box.value, {
    x: 0,
    y: 0,
    duration: 1,
    rotation: 0,
    scale: 1,
    backgroundColor: '#42b983',
    borderRadius: '0%',
    ease: 'back.out(1.7)'
  })
})

// Watch the animate ref and control the timeline
watch(animate, (newVal) => {
  if (newVal) {
    tl.play()
  } else {
    tl.reverse()
  }
})
</script>

<style scoped>
.container {
  padding: 20px;
}

.box {
  width: 100px;
  height: 100px;
  background-color: #42b983;
  margin-top: 20px;
}
</style>
```

## Motion One Integration

```vue
<template>
  <div class="container">
    <button @click="animateBox">Animate</button>
    <div class="box" ref="box"></div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { animate, stagger } from 'motion'

const box = ref(null)

function animateBox() {
  // Animate the box with Motion One
  animate(
    box.value,
    { 
      x: [0, 200, 0],
      rotate: [0, 180, 360],
      backgroundColor: ['#42b983', '#ff6b6b', '#42b983']
    },
    {
      duration: 2,
      easing: 'ease-in-out'
    }
  )
}
</script>

<style scoped>
.container {
  padding: 20px;
}

.box {
  width: 100px;
  height: 100px;
  background-color: #42b983;
  margin-top: 20px;
  border-radius: 8px;
}
</style>
```

## Viewport Animations

### Animate on Scroll

```vue
<template>
  <div class="container">
    <div 
      v-for="item in items" 
      :key="item.id" 
      class="item"
      :ref="el => { if (el) itemRefs[item.id] = el }"
    >
      {{ item.text }}
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { animate } from 'motion'

const items = ref([
  { id: 1, text: 'Item 1' },
  { id: 2, text: 'Item 2' },
  { id: 3, text: 'Item 3' },
  { id: 4, text: 'Item 4' },
  { id: 5, text: 'Item 5' }
])

const itemRefs = ref({})

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animate(
          entry.target,
          { opacity: [0, 1], y: [20, 0] },
          { duration: 0.6, delay: 0.1 * parseInt(entry.target.dataset.index) }
        )
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.1 })
  
  // Observe all items
  Object.values(itemRefs.value).forEach((el, index) => {
    if (el) {
      el.style.opacity = 0
      el.dataset.index = index
      observer.observe(el)
    }
  })
  
  // Cleanup
  return () => observer.disconnect()
})
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
}

.item {
  padding: 20px;
  background-color: #f0f0f0;
  border-radius: 8px;
  transform: translateY(20px);
}
</style>
```

## Performance Tips

1. **Use `will-change`** for elements that will be animated:
   ```css
   .animated-element {
     will-change: transform, opacity;
   }
   ```

2. **Use `transform` and `opacity`** for animations as they're optimized by the browser.

3. **Avoid animating properties** that trigger layout recalculations like `width`, `height`, `top`, `left`.

4. **Use `position: absolute`** for elements that move independently to reduce layout calculations.

5. **Debounce or throttle** scroll/resize event handlers that trigger animations.

6. **Use `requestAnimationFrame`** for complex JavaScript animations.

7. **Reduce the number of animated elements** on mobile devices.

8. **Test performance** with browser dev tools to identify bottlenecks.
