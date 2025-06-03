# Customizing the Navbar

The navbar appears at the top of every page and can be customized to include navigation links, search, and other elements.

## Basic Configuration

Configure the navbar in your `.vitepress/config.js`:

```javascript
export default {
  themeConfig: {
    nav: [
      { text: 'Guide', link: '/guide/' },
      { text: 'Components', link: '/components/' },
      { text: 'API', link: '/api/' }
    ]
  }
}
```

## Nested Dropdown Menus

Create dropdown menus with nested items:

```javascript
{
  text: 'Guide',
  items: [
    { text: 'Getting Started', link: '/guide/getting-started' },
    { text: 'Configuration', link: '/guide/configuration' },
    { text: 'Deployment', link: '/guide/deployment' }
  ]
}
```

## Active Links

Control when a nav item should be active:

```javascript
{
  text: 'Guide',
  link: '/guide/',
  activeMatch: '^/guide/.*$' // Regex to match active state
}
```

## Icons in Navbar

Add icons to your navigation items:

```javascript
{
  text: 'GitHub',
  link: 'https://github.com/your-org/your-repo',
  icon: 'github'
}
```

## Right-aligned Items

To right-align items, use the `end` key:

```javascript
{
  nav: [
    // Left-aligned items
    { text: 'Guide', link: '/guide/' },
    // Right-aligned items
    {
      text: 'Links',
      items: [
        { text: 'GitHub', link: 'https://github.com' },
        { text: 'Twitter', link: 'https://twitter.com' }
      ]
    }
  ]
}
```

## Search Box

Add a search box to your navbar:

```javascript
{
  themeConfig: {
    algolia: {
      appId: 'YOUR_APP_ID',
      apiKey: 'YOUR_API_KEY',
      indexName: 'YOUR_INDEX_NAME'
    }
  }
}
```

## Custom Navbar Component

For advanced customization, you can replace the default navbar with a custom component:

1. Create a custom component:

```vue
<!-- .vitepress/theme/components/CustomNavbar.vue -->
<template>
  <nav class="custom-navbar">
    <div class="logo">
      <a href="/">
        <img src="/logo.svg" alt="Logo">
      </a>
    </div>
    <div class="nav-links">
      <a v-for="item in navItems" :key="item.text" :href="item.link">
        {{ item.text }}
      </a>
    </div>
  </nav>
</template>

<script>
export default {
  props: {
    navItems: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped>
.custom-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo img {
  height: 2rem;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-links a {
  text-decoration: none;
  color: #2c3e50;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: #42b983;
}
</style>
```

2. Register the component in your theme:

```javascript
// .vitepress/theme/index.js
import DefaultTheme from 'vitepress/theme'
import CustomNavbar from './components/CustomNavbar.vue'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('CustomNavbar', CustomNavbar)
  }
}
```

3. Use the custom navbar in your layout:

```vue
<!-- .vitepress/theme/Layout.vue -->
<template>
  <div class="layout">
    <CustomNavbar :nav-items="navItems" />
    <Content />
    <Footer />
  </div>
</template>

<script>
import DefaultTheme from 'vitepress/theme/Layout.vue'

export default {
  extends: DefaultTheme,
  computed: {
    navItems() {
      return this.$frontmatter.navItems || []
    }
  }
}
</script>
```

## Responsive Navbar

For a responsive navbar that works on mobile devices, you can use CSS media queries or a UI library like VueUse's `useBreakpoints`:

```vue
<template>
  <nav class="navbar">
    <div class="logo">
      <a href="/">My Site</a>
    </div>
    <button class="menu-button" @click="isOpen = !isOpen">
      <span class="menu-icon">☰</span>
    </button>
    <div class="nav-links" :class="{ 'is-open': isOpen }">
      <a v-for="item in navItems" :key="item.text" :href="item.link">
        {{ item.text }}
      </a>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useBreakpoints } from '@vueuse/core';

const isOpen = ref(false);
const breakpoints = useBreakpoints({
  mobile: 640,
  tablet: 768,
  desktop: 1024,
});

const isMobile = breakpoints.smaller('tablet');

// Close menu when clicking outside
const handleClickOutside = (event) => {
  if (!event.target.closest('.navbar')) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

.menu-button {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-links a {
  text-decoration: none;
  color: #2c3e50;
  font-weight: 500;
  transition: color 0.3s;
}

.nav-links a:hover {
  color: #42b983;
}

@media (max-width: 768px) {
  .menu-button {
    display: block;
  }

  .nav-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #fff;
    flex-direction: column;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .nav-links.is-open {
    display: flex;
  }
}
</style>
```
