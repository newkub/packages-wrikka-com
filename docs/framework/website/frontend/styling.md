# Styling in Your Application

This guide covers the various ways to style your components in our framework.

## Built-in CSS Support

### Scoped Styles

Use the `scoped` attribute to scope CSS to the current component only:

```vue
<template>
  <div class="example">Hello</div>
</template>

<style scoped>
.example {
  color: red;
}
</style>
```

### CSS Modules

Use CSS Modules by adding `.module` before the file extension:

```vue
<template>
  <div :class="$style.red">Red Text</div>
</template>

<style module>
.red {
  color: red;
}
</style>
```

## Pre-processors

### Sass/SCSS

Install the preprocessor:

```bash
npm install -D sass
```

Then use it in your components:

```vue
<template>
  <div class="example">Hello</div>
</template>

<style lang="scss" scoped>
$primary-color: #42b983;

.example {
  color: $primary-color;
  
  &:hover {
    opacity: 0.8;
  }
}
</style>
```

## CSS-in-JS

### Using `v-bind` in CSS

You can use component state in CSS with `v-bind`:

```vue
<template>
  <div class="text">Hello</div>
</template>

<script setup>
const color = ref('red')
</script>

<style scoped>
.text {
  color: v-bind(color);
}
</style>
```

## Utility-First CSS with UnoCSS

Our framework comes with [UnoCSS](https://unocss.dev/) for utility-first CSS:

```vue
<template>
  <div class="p-4 text-blue-500 hover:text-blue-700">
    Hover over me
  </div>
</template>
```

## Global Styles

Add global styles in `assets/main.css`:

```css
/* assets/main.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Custom global styles */
:root {
  --primary-color: #42b983;
}

body {
  @apply bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100;
}
```

## Responsive Design

Use responsive variants with breakpoint prefixes:

```vue
<template>
  <div class="w-full md:w-1/2 lg:w-1/3 p-4">
    Responsive content
  </div>
</template>
```

## Dark Mode

Toggle dark mode with a button:

```vue
<template>
  <button @click="toggleDark()">
    Toggle Dark Mode
  </button>
</template>

<script setup>
const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<style>
/* These styles will automatically apply in dark mode */
:root.dark {
  --color-background: #1a1a1a;
  --color-text: #ffffff;
}
</style>
```

## Animations

### CSS Transitions

```vue
<template>
  <Transition name="fade">
    <div v-if="show" class="transition-opacity duration-300">
      Fade transition
    </div>
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

## Best Practices

1. **Component-Scoped Styles**: Prefer scoped styles for component-specific styles
2. **CSS Variables**: Use CSS variables for theming and dynamic values
3. **Utility Classes**: Leverage utility classes for common styles
4. **Responsive Design**: Design mobile-first and use responsive variants
5. **Performance**: Be mindful of CSS selector complexity and unused styles
