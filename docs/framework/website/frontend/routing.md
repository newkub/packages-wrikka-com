# Routing

Our framework provides a file-based routing system that automatically generates routes based on the files in the `src/pages` directory.

## Basic Routing

### Creating Pages

Create a `.vue` file in the `src/pages` directory to create a route. For example:

- `pages/index.vue` → `/`
- `pages/about.vue` → `/about`
- `pages/users/index.vue` → `/users`
- `pages/users/[id].vue` → `/users/1`, `/users/2`, etc.

### Dynamic Routes

Use square brackets to create dynamic route parameters:

- `pages/users/[id].vue` → Access via `const route = useRoute(); const userId = route.params.id`
- `pages/[...slug].vue` → Catch-all route

### Nested Routes

Create a nested route by creating a directory with the same name as a route and an `index.vue` file:

```
pages/
  users/
    index.vue    # /users
    [id].vue     # /users/1
    profile.vue  # /users/profile
```

## Navigation

### Programmatic Navigation

```vue
<script setup>
const router = useRouter()

// Navigate to a route
function goToAbout() {
  router.push('/about')
}

// Navigate with params
function goToUser(userId) {
  router.push({
    path: '/users/' + userId
  })
}

// Navigate with query params
function search(query) {
  router.push({
    path: '/search',
    query: { q: query }
  })
}
</script>
```

### Router Links

```vue
<template>
  <RouterLink to="/">Home</RouterLink>
  <RouterLink :to="{ name: 'user', params: { id: 1 }}">User 1</RouterLink>
  <RouterLink :to="{ path: '/search', query: { q: 'test' }}">Search</RouterLink>
</template>
```

## Route Guards

### Global Guards

```ts
// router.ts
const router = createRouter({
  // ...
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = checkAuth()
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else {
    next()
  }
})

export default router
```

### Per-Route Guards

```ts
const routes = [
  {
    path: '/dashboard',
    component: Dashboard,
    beforeEnter: (to, from, next) => {
      if (!isAuthenticated()) {
        next('/login')
      } else {
        next()
      }
    }
  }
]
```

### In-Component Guards

```vue
<script setup>
import { onBeforeRouteLeave } from 'vue-router'

onBeforeRouteLeave((to, from, next) => {
  if (hasUnsavedChanges.value) {
    if (confirm('You have unsaved changes. Leave?')) {
      next()
    } else {
      next(false)
    }
  } else {
    next()
  }
})
</script>
```

## Route Meta Fields

```ts
const routes = [
  {
    path: '/admin',
    component: Admin,
    meta: {
      requiresAuth: true,
      roles: ['admin']
    }
  }
]

// Access in components
const route = useRoute()
const meta = route.meta
```

## Lazy Loading Routes

```ts
const routes = [
  {
    path: '/dashboard',
    component: () => import('@/pages/Dashboard.vue')
  }
]
```

## Scroll Behavior

```ts
const router = createRouter({
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
      }
    } else {
      return { top: 0 }
    }
  },
})
```

## Route Transitions

```vue
<template>
  <RouterView v-slot="{ Component }">
    <Transition name="fade" mode="out-in">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
```

## Data Fetching

### Before Route Enter

```vue
<script setup>
const route = useRoute()
const post = ref(null)
const error = ref(null)

// Fetch data when component mounts
onMounted(async () => {
  try {
    const response = await fetch(`/api/posts/${route.params.id}`)
    post.value = await response.json()
  } catch (err) {
    error.value = err
  }
})
</script>
```

### Using Route Guards

```ts
const routes = [
  {
    path: '/posts/:id',
    component: PostDetail,
    beforeEnter: async (to, from, next) => {
      try {
        const response = await fetch(`/api/posts/${to.params.id}`)
        to.meta.post = await response.json()
        next()
      } catch (error) {
        next('/error')
      }
    }
  }
]
```

## Error Pages

### 404 Page

Create a `pages/[...all].vue` file:

```vue
<template>
  <div>
    <h1>404 - Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
    <RouterLink to="/">Go Home</RouterLink>
  </div>
</template>

<script setup>
// Optionally log the error
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

onMounted(() => {
  console.error(`Route not found: ${route.path}`)
})
</script>
```

## Route Aliases

```ts
const routes = [
  {
    path: '/home',
    component: Home,
    alias: ['/', '/welcome']
  }
]
```

## Redirects

```ts
const routes = [
  {
    path: '/old-route',
    redirect: '/new-route'
  },
  {
    path: '/old-route-2',
    redirect: { name: 'home' }
  },
  {
    path: '/search',
    redirect: to => {
      return { path: '/search', query: { q: to.params.searchText }}
    }
  }
]
```

## Nested Named Views

```html
<template>
  <div>
    <h1>User Settings</h1>
    <NavBar />
    <router-view name="sidebar" />
    <router-view />
  </div>
</template>
```

```ts
const routes = [
  {
    path: '/settings',
    component: UserSettings,
    children: [
      {
        path: 'profile',
        components: {
          default: UserProfile,
          sidebar: UserProfileSidebar
        }
      },
      {
        path: 'preferences',
        components: {
          default: UserPreferences,
          sidebar: UserPreferencesSidebar
        }
      }
    ]
  }
]
```

## Route Props

```ts
const routes = [
  {
    path: '/user/:id',
    component: User,
    props: true // Pass route.params as props
  },
  {
    path: '/about',
    component: About,
    props: { staticProp: 'Hello' } // Static props
  },
  {
    path: '/search',
    component: Search,
    props: route => ({ query: route.query.q }) // Function that returns props
  }
]
```

## Navigation Guards with Meta Fields

```ts
const routes = [
  {
    path: '/admin',
    component: Admin,
    meta: { requiresAuth: true, roles: ['admin'] }
  }
]

router.beforeEach((to, from, next) => {
  const isAuthenticated = checkAuth()
  const userRole = getUserRole()
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.roles && !to.meta.roles.includes(userRole)) {
    next('/unauthorized')
  } else {
    next()
  }
})
```

## Route Transitions with Meta Fields

```vue
<template>
  <RouterView v-slot="{ Component, route }">
    <Transition :name="route.meta.transition || 'fade'">
      <component :is="Component" />
    </Transition>
  </RouterView>
</template>

<script setup>
const route = useRoute()
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom transition */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(-100%);
}
</style>
```

## Dynamic Route Matching

### Optional Parameters

```ts
const routes = [
  // Will match /users and /users/posva
  { path: '/users/:userId?' },
  // Will match /users and /users/42
  { path: '/users/:userId(\\d+)?' }
]
```

### Repeatable Params

```ts
const routes = [
  // /:chapters -> matches /one/two
  { path: '/:chapters+' },
  // /:chapters -> matches /one, /one/two, etc.
  { path: '/:chapters*' }
]
```

### Sensitive and Strict Routing

```ts
const router = createRouter({
  history: createWebHistory(),
  routes: [
    // will match /users/posva but not:
    // - /users/posva/ because of strict: true
    // - /Users/posva because of sensitive: true
    { path: '/users/:id', sensitive: true, strict: true }
  ]
})
```

## Route Order

Routes are matched in the order they are defined. More specific routes should be defined first:

```ts
const routes = [
  // Dynamic segments start with a colon
  { path: '/users/:id', component: UserDetail },
  // This will match /users/new before the dynamic route
  { path: '/users/new', component: NewUser },
  // This will match /users at the end
  { path: '/users', component: UserList },
  // This will match everything else
  { path: '/:pathMatch(.*)*', component: NotFound }
]
```

## Route Components

### Passing Props to Route Components

```ts
const User = {
  props: ['id'],
  template: '<div>User {{ id }}</div>'
}

const router = createRouter({
  routes: [
    { path: '/user/:id', component: User, props: true },
    // For routes with named views, you have to define the `props` option for each named view:
    {
      path: '/user/:id',
      components: { default: User, sidebar: Sidebar },
      props: { default: true, sidebar: false }
    }
  ]
})
```

### Named Routes

```ts
const routes = [
  {
    name: 'user',
    path: '/user/:id',
    component: User
  }
]

// Navigate with name
router.push({ name: 'user', params: { id: 123 }})
```

### Nested Named Routes

```ts
const routes = [
  {
    path: '/user/:id',
    component: User,
    children: [
      {
        // UserProfile will be rendered inside User's <router-view>
        // when /user/:id/profile is matched
        path: 'profile',
        component: UserProfile,
        name: 'user-profile'
      },
      {
        // UserPosts will be rendered inside User's <router-view>
        // when /user/:id/posts is matched
        path: 'posts',
        component: UserPosts,
        name: 'user-posts'
      }
    ]
  }
]
```

## Route Configuration

### Base URL

```ts
const router = createRouter({
  history: createWebHistory('/base/url/'),
  routes
})
```

### Link Active Class

```ts
const router = createRouter({
  linkActiveClass: 'active-link',
  linkExactActiveClass: 'exact-active-link',
  routes
})
```

### Global Properties

```ts
const router = createRouter({
  routes
})

// Add global properties
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'My App'
  next()
})

// Scroll to top on route change
router.afterEach((to, from) => {
  window.scrollTo(0, 0)
})
```
