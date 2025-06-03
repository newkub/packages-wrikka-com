# Customizing the Theme

VitePress provides flexible theming options to customize the look and feel of your documentation site.

## Basic Theme Customization

### Colors

Define your color scheme in `.vitepress/theme/index.js`:

```javascript
// .vitepress/theme/index.js
export default {
  enhanceApp({ app }) {
    // ...
  },
  setup() {
    // ...
  },
  // Customize theme colors
  colors: {
    primary: '#3eaf7c',
    accent: '#4dabf7',
    background: '#fff',
    text: '#2c3e50',
    border: '#eaeaea',
    codeBg: '#f6f8fa',
    codeColor: '#476582',
    tip: '#42b983',
    warning: '#e7c000',
    danger: '#e53935',
    detailsBg: '#f8f8f8',
  },
  // Customize typography
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
    fontSize: '16px',
    lineHeight: 1.6,
    headings: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif',
      fontWeight: '600',
      lineHeight: 1.25,
    },
  },
  // Layout
  layout: {
    headerHeight: '3.6rem',
    sidebarWidth: '20rem',
    contentWidth: '46rem',
    footerHeight: 'auto',
  },
  // Responsive breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
  },
}
```

## Custom Layouts

Create custom layouts by adding Vue components to `.vitepress/theme/layouts/`.

### Default Layout

```vue
<!-- .vitepress/theme/layouts/Layout.vue -->
<template>
  <div class="layout">
    <header class="header">
      <NavBar />
    </header>
    <div class="container">
      <aside v-if="hasSidebar" class="sidebar">
        <Sidebar />
      </aside>
      <main class="content">
        <Content />
      </main>
    </div>
    <footer class="footer">
      <Footer />
    </footer>
  </div>
</template>

<script>
import DefaultTheme from 'vitepress/theme/Layout.vue'
import { usePageData } from 'vitepress'

export default {
  extends: DefaultTheme,
  setup() {
    const { frontmatter } = usePageData()
    const hasSidebar = computed(() => frontmatter.value.sidebar !== false)
    
    return { hasSidebar }
  }
}
</script>

<style>
:root {
  --c-brand: #3eaf7c;
  --c-brand-light: #4abf8a;
  --c-text: #2c3e50;
  --c-text-light: #476582;
  --c-text-lighter: #90a4b7;
  --c-border: #eaecef;
  --c-bg: #ffffff;
  --c-bg-light: #f8f8f8;
  --c-bg-lighter: #f3f4f5;
  --c-bg-navbar: var(--c-bg);
  --c-bg-sidebar: var(--c-bg);
  --c-bg-arrow: #cccccc;
}

.dark {
  --c-bg: #1a1a1a;
  --c-bg-light: #242424;
  --c-bg-lighter: #2e2e2e;
  --c-text: #e0e0e0;
  --c-text-light: #a0a0a0;
  --c-text-lighter: #6a6a6a;
  --c-border: #3a3a3a;
  --c-bg-navbar: var(--c-bg);
  --c-bg-sidebar: var(--c-bg-light);
  --c-bg-arrow: #666666;
}

.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: var(--c-bg-navbar);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.container {
  display: flex;
  flex: 1;
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 0 1.5rem;
  width: 100%;
}

.content {
  flex: 1;
  padding: 2rem 0;
  width: 0;
}

.sidebar {
  width: var(--sidebar-width);
  padding: 2rem 1rem 2rem 0;
  position: sticky;
  top: var(--header-height);
  height: calc(100vh - var(--header-height));
  overflow-y: auto;
  background-color: var(--c-bg-sidebar);
  border-right: 1px solid var(--c-border);
}

.footer {
  padding: 2rem 0;
  text-align: center;
  color: var(--c-text-light);
  font-size: 0.875rem;
  border-top: 1px solid var(--c-border);
}

@media (max-width: 959px) {
  .sidebar {
    display: none;
  }
  
  .content {
    width: 100%;
    padding: 1rem 0;
  }
}
</style>
```

### Custom Page Layout

Create a custom layout for specific pages:

```vue
<!-- .vitepress/theme/layouts/Home.vue -->
<template>
  <div class="home-layout">
    <div class="hero">
      <h1>{{ frontmatter.hero?.title || 'Welcome' }}</h1>
      <p class="description">{{ frontmatter.hero?.tagline || 'Documentation' }}</p>
      <div class="actions">
        <a
          v-for="action in frontmatter.actions"
          :key="action.text"
          :href="action.link"
          class="action-button"
          :class="{ primary: action.type === 'primary' }"
        >
          {{ action.text }}
        </a>
      </div>
    </div>
    <div class="features">
      <div v-for="feature in frontmatter.features" :key="feature.title" class="feature">
        <h3>{{ feature.title }}</h3>
        <p>{{ feature.details }}</p>
      </div>
    </div>
    <Content class="home-content" />
  </div>
</template>

<script>
export default {
  setup() {
    const { frontmatter } = usePageData()
    return { frontmatter }
  }
}
</script>

<style scoped>
.home-layout {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.hero {
  text-align: center;
  padding: 4rem 0 2rem;
}

.hero h1 {
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 1rem;
  line-height: 1.2;
  color: var(--c-text);
}

.description {
  max-width: 600px;
  margin: 0 auto 2rem;
  font-size: 1.25rem;
  color: var(--c-text-light);
  line-height: 1.5;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

.action-button {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  border: 1px solid var(--c-brand);
  background-color: transparent;
  color: var(--c-brand);
}

.action-button.primary {
  background-color: var(--c-brand);
  color: white;
}

.action-button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 4rem 0;
}

.feature {
  padding: 1.5rem;
  border-radius: 8px;
  background-color: var(--c-bg-light);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.feature:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.feature h3 {
  margin-top: 0;
  color: var(--c-brand);
}

.home-content {
  padding: 2rem 0;
  max-width: 800px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2.5rem;
  }
  
  .features {
    grid-template-columns: 1fr;
  }
}
</style>
```

## Dark Mode

VitePress has built-in dark mode support. Toggle it with the theme switch in the navbar.

### Customizing Dark Mode

```css
/* Override dark mode styles */
.dark {
  --c-bg: #1a1a1a;
  --c-bg-light: #242424;
  --c-bg-lighter: #2e2e2e;
  --c-text: #e0e0e0;
  --c-text-light: #a0a0a0;
  --c-text-lighter: #6a6a6a;
  --c-border: #3a3a3a;
}

/* Component-specific dark mode overrides */
.dark .custom-component {
  background-color: var(--c-bg-light);
  border-color: var(--c-border);
}
```

## Custom Components

Create reusable components in `.vitepress/theme/components/`:

```vue
<!-- .vitepress/theme/components/CustomComponent.vue -->
<template>
  <div class="custom-component">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'CustomComponent'
}
</script>

<style scoped>
.custom-component {
  padding: 1.5rem;
  border-radius: 8px;
  background-color: var(--c-bg-light);
  border: 1px solid var(--c-border);
  margin: 1rem 0;
}
</style>
```

## Custom CSS

Add custom CSS in `.vitepress/theme/style.css`:

```css
/* Custom styles */
:root {
  --c-brand: #3eaf7c;
  --c-brand-light: #4abf8a;
}

/* Custom component styles */
.custom-component {
  margin: 2rem 0;
  padding: 1.5rem;
  border-radius: 8px;
  background-color: var(--c-bg-light);
  border: 1px solid var(--c-border);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .custom-component {
    margin: 1rem 0;
    padding: 1rem;
  }
}
```

## Extending the Default Theme

Extend the default theme by importing and re-exporting it:

```javascript
// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import './styles/custom.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    // Register global components
    app.component('MyGlobalComponent', /* ... */)
  },
  setup() {
    // Use composition API
  }
}
```

## Theme Extensions

You can also use community themes by installing them via npm:

```bash
npm install vitepress-theme-xxx
```

Then in your `.vitepress/config.js`:

```javascript
export default {
  theme: 'vitepress-theme-xxx',
  themeConfig: {
    // Theme-specific options
  }
}
```
