# Components API

VitePress provides several built-in components to enhance your documentation.

## Badge

Display badges:

```vue
<Badge type="tip">New</Badge>
<Badge type="warning">Beta</Badge>
<Badge type="danger">Deprecated</Badge>
```

## CodeGroup

Group code blocks with tabs:

```vue
<CodeGroup>
  <CodeBlock title="NPM">
  ```bash
  npm install my-package
  ```
  </CodeBlock>
  <CodeBlock title="Yarn">
  ```bash
  yarn add my-package
  ```
  </CodeBlock>
</CodeGroup>
```

## OutboundLink

External links with an icon:

```vue
<OutboundLink href="https://github.com">GitHub</OutboundLink>
```

## ClientOnly

Render component only on client-side:

```vue
<ClientOnly>
  <HeavyComponent />
</ClientOnly>
```

## Custom Layouts

Create custom layouts in `.vitepress/theme/layouts`:

```vue
<!-- .vitepress/theme/layouts/CustomLayout.vue -->
<template>
  <div class="custom-layout">
    <slot name="header" />
    <main class="content">
      <Content />
    </main>
    <slot name="footer" />
  </div>
</template>

<script setup>
import DefaultTheme from 'vitepress/theme/Layout.vue'
</script>

<style scoped>
.custom-layout {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.content {
  margin-top: 2rem;
}
</style>
```

Use the layout in Markdown:

```yaml
---
layout: CustomLayout
---

# My Custom Layout

Content goes here
