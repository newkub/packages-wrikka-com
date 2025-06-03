# Custom Slots

Slots allow you to inject custom content into specific parts of the layout.

## Available Slots

### `header`

Replaces the default header section.

```vue
<template #header>
  <CustomHeader />
</template>
```

### `sidebar`

Replaces the default sidebar.

```vue
<template #sidebar>
  <CustomSidebar />
</template>
```

### `content`

Replaces the main content area.

```vue
<template #content>
  <CustomContent />
</template>
```

### `footer`

Replaces the default footer.

```vue
<template #footer>
  <CustomFooter />
</template>
```

## Example Usage

```vue
<template>
  <Layout>
    <template #header>
      <header class="custom-header">
        <h1>My Custom Header</h1>
        <nav>
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </nav>
      </header>
    </template>

    <template #default>
      <main class="main-content">
        <slot />
      </main>
    </template>


    <template #footer>
      <footer class="custom-footer">
        <p>&copy; 2025 My Awesome Site</p>
      </footer>
    </template>
  </Layout>
</template>

<script setup>
import { Layout } from 'your-theme';
</script>

<style scoped>
.custom-header {
  background: #2c3e50;
  color: white;
  padding: 1rem;
}

.custom-footer {
  text-align: center;
  padding: 1rem;
  background: #f5f5f5;
}
</style>
```

## Dynamic Slots

You can also use dynamic slot names:

```vue
<template>
  <Layout>
    <template v-for="(content, name) in customSlots" :key="name" v-slot:[name]>
      <component :is="content" />
    </template>
  </Layout>
</template>

<script setup>
import { ref } from 'vue';

const customSlots = ref({
  header: 'CustomHeader',
  footer: 'CustomFooter'
});
</script>
```

## Scoped Slots

Some components provide scoped slots for more advanced customization:

```vue
<template>
  <DataTable :items="items">
    <template #item.name="{ value }">
      <strong>{{ value.toUpperCase() }}</strong>
    </template>
  </DataTable>
</template>
```
