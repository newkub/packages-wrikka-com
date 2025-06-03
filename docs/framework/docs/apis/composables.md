# Composables API

VitePress provides several built-in composables to help you build interactive documentation.

## useData

Access page and site data:

```vue
<script setup>
import { useData } from 'vitepress'

const { site, page, frontmatter, theme, title } = useData()

// site: Site data from .vitepress/config.js
// page: Current page data
// frontmatter: Current page frontmatter
// theme: Resolved theme config
// title: Current page title
</script>
```

## useRoute

Access the current route information:

```vue
<script setup>
import { useRoute } from 'vitepress'

const route = useRoute()

// route.path: Current path
// route.data: Route data
// route.hash: Current hash
// route.params: Route parameters
</script>
```

## useRouter

Programmatic navigation:

```vue
<script setup>
import { useRouter } from 'vitepress'

const router = useRouter()

// Navigate to a new page
function goToPage(path) {
  router.go(path)
}

// Get all routes
const routes = router.getRoutes()
</script>
```

## useSidebar

Access sidebar items:

```vue
<script setup>
import { useSidebar } from 'vitepress/theme'

const { hasSidebar, sidebarGroups, hasAside } = useSidebar()
</script>
```

## useDarkMode

Handle dark mode:

```vue
<script setup>
import { useDarkMode } from 'vitepress/theme'

const { isDark, toggle } = useDarkMode()
</script>

<template>
  <button @click="toggle">
    {{ isDark ? 'Light' : 'Dark' }} Mode
  </button>
</template>
```
