# Customizing the Sidebar

The sidebar can be customized to create a navigation structure that fits your documentation needs.

## Basic Configuration

Create a `sidebar.ts` file in your `.vitepress` directory:

```typescript
// .vitepress/sidebar.ts
import { defineConfig } from 'vitepress';

export default defineConfig({
  themeConfig: {
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Introduction', link: '/guide/' },
          { text: 'Getting Started', link: '/guide/getting-started' },
        ]
      },
      {
        text: 'Components',
        items: [
          { text: 'Button', link: '/components/button' },
          { text: 'Input', link: '/components/input' },
        ]
      }
    ]
  }
});
```

## Nested Sidebar Groups

You can create collapsible groups:

```typescript
{
  text: 'Advanced',
  collapsed: false, // Default is false
  items: [
    { text: 'Performance', link: '/advanced/performance' },
    { text: 'SSR', link: '/advanced/ssr' },
    { text: 'Deployment', link: '/advanced/deployment' }
  ]
}
```

## Multiple Sidebars

For different sections:

```typescript
{
  '/guide/': [
    {
      text: 'Guide',
      items: [
        { text: 'Introduction', link: '/guide/' },
        { text: 'Getting Started', link: '/guide/getting-started' },
      ]
    }
  ],
  '/components/': [
    {
      text: 'Components',
      items: [
        { text: 'Button', link: '/components/button' },
        { text: 'Input', link: '/components/input' },
      ]
    }
  ]
}
```

## Dynamic Sidebar

You can generate the sidebar programmatically:

```typescript
// .vitepress/sidebar.ts
import { readdirSync } from 'fs';
import { join } from 'path';

function getGuideSidebar() {
  const guidePath = join(__dirname, '../guide');
  const files = readdirSync(guidePath)
    .filter(file => file.endsWith('.md') && file !== 'index.md')
    .map(file => ({
      text: formatTitle(file),
      link: `/guide/${file.replace(/\.md$/, '')}`
    }));

  return [
    {
      text: 'Guide',
      items: [
        { text: 'Introduction', link: '/guide/' },
        ...files
      ]
    }
  ];
}

export default {
  '/guide/': getGuideSidebar()
};
```

## Icons in Sidebar

Add icons to your sidebar items:

```typescript
{
  text: 'Guide',
  items: [
    { 
      text: 'Introduction', 
      link: '/guide/',
      icon: 'material-symbols:info-outline'
    },
    { 
      text: 'Getting Started', 
      link: '/guide/getting-started',
      icon: 'material-symbols:play-arrow'
    }
  ]
}
```

## Active Link Customization

Control which link is considered active:

```typescript
{
  text: 'Guide',
  items: [
    { 
      text: 'Introduction', 
      link: '/guide/',
      activeMatch: '^/guide/.*$' // Regex to match active state
    }
  ]
}
```

## Sidebar with Badges

```typescript
{
  text: 'Features',
  items: [
    { 
      text: 'Dark Mode', 
      link: '/features/dark-mode',
      badge: 'New' 
    },
    { 
      text: 'i18n', 
      link: '/features/i18n',
      badge: {
        text: 'Beta',
        type: 'warning'
      }
    }
  ]
}
```

## Sidebar with Custom Components

You can use custom components in your sidebar:

```typescript
{
  text: 'Custom',
  items: [
    {
      text: 'Custom Component',
      link: '/custom/component',
      component: 'CustomSidebarItem',
      props: {
        // Props to pass to the custom component
        icon: 'star',
        count: 5
      }
    }
  ]
}
```
