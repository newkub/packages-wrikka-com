# Search Engine Optimization (SEO)

Optimize your VitePress site for search engines with these SEO best practices.

## Basic SEO Configuration

Configure basic SEO in your `.vitepress/config.js`:

```javascript
// .vitepress/config.js
export default {
  // Site-level SEO
  title: 'My Awesome Project',
  description: 'A brief description of your project',
  head: [
    // Basic meta tags
    ['meta', { name: 'author', content: 'Your Name' }],
    ['meta', { name: 'keywords', content: 'keywords, for, your, site' }],
    
    // Open Graph / Facebook
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: 'https://your-site.com/' }],
    ['meta', { property: 'og:title', content: 'My Awesome Project' }],
    ['meta', { property: 'og:description', content: 'A brief description of your project' }],
    ['meta', { property: 'og:image', content: 'https://your-site.com/og-image.jpg' }],
    
    // Twitter
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@yourtwitter' }],
    ['meta', { name: 'twitter:creator', content: '@yourtwitter' }],
    ['meta', { name: 'twitter:title', content: 'My Awesome Project' }],
    ['meta', { name: 'twitter:description', content: 'A brief description of your project' }],
    ['meta', { name: 'twitter:image', content: 'https://your-site.com/twitter-image.jpg' }],
    
    // Favicon
    ['link', { rel: 'icon', href: '/favicon.ico' }],
    ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' }],
    ['link', { rel: 'manifest', href: '/site.webmanifest' }],
  ],
  // ... other config
}
```

## Dynamic SEO with Frontmatter

Customize SEO on a per-page basis using frontmatter:

```yaml
---
title: Page Title
description: A detailed description of this specific page
meta:
  - name: keywords
    content: specific, keywords, for, this, page
  - property: og:title
    content: Custom OG Title
  - property: og:description
    content: Custom OG Description
  - property: og:image
    content: https://your-site.com/custom-og-image.jpg
---
```

## Sitemap Generation

Generate a sitemap using the `vitepress-plugin-sitemap`:

1. Install the plugin:

```bash
npm install vitepress-plugin-sitemap -D
```

2. Configure in `.vitepress/config.js`:

```javascript
import { defineConfig } from 'vitepress'
import { createSitemap } from 'vitepress-plugin-sitemap'

export default defineConfig({
  // ... other config
  head: [
    // ... other head tags
    ...createSitemap({
      hostname: 'https://your-site.com',
      // Optional: Change frequency and priority
      changefreq: 'daily',
      priority: 0.8,
      // Optional: Exclude specific paths
      exclude: ['/secret/'],
      // Optional: Customize lastmod
      lastmod: new Date(),
    })
  ]
})
```

## Canonical URLs

Add canonical URLs to prevent duplicate content issues:

```javascript
// .vitepress/config.js
export default {
  // ... other config
  head: [
    // ... other head tags
    ['link', { rel: 'canonical', href: 'https://your-site.com/current-page' }]
  ]
}
```

## Structured Data (JSON-LD)

Add structured data to improve rich results in search:

```javascript
// .vitepress/theme/components/StructuredData.vue
<script setup>
import { usePageData } from 'vitepress'
import { computed } from 'vue'

const { frontmatter, site } = usePageData()

const structuredData = computed(() => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  'name': frontmatter.value.title || site.value.title,
  'description': frontmatter.value.description || site.value.description,
  'url': site.value.themeConfig.siteUrl + frontmatter.value.relativePath.replace(/\.md$/, '.html'),
  'publisher': {
    '@type': 'Organization',
    'name': site.value.themeConfig.author || 'Your Organization',
    'logo': {
      '@type': 'ImageObject',
      'url': site.value.themeConfig.siteUrl + '/logo.png'
    }
  },
  'datePublished': frontmatter.value.date || new Date().toISOString(),
  'dateModified': frontmatter.value.updated ? new Date(frontmatter.value.updated).toISOString() : new Date().toISOString()
}))
</script>

<template>
  <script type="application/ld+json" v-html="JSON.stringify(structuredData, null, 2)" />
</template>
```

Then use it in your layout:

```vue
<template>
  <StructuredData />
  <!-- rest of your layout -->
</template>

<script setup>
import StructuredData from './components/StructuredData.vue'
</script>
```

## Social Media Preview Images

Generate and configure social media preview images:

1. Create a base template in `.vitepress/public/og-template.html`
2. Use a service like Vercel OG Image Generation or a local script to generate images
3. Configure in your frontmatter:

```yaml
---
meta:
  - property: og:image
    content: https://your-site.com/og-image.png?title=Your%20Title&description=Your%20Description
  - name: twitter:image
    content: https://your-site.com/og-image.png?title=Your%20Title&description=Your%20Description
---
```

## Robots.txt

Create a `robots.txt` file in your `public` directory:

```
# .vitepress/public/robots.txt
User-agent: *
Allow: /

Sitemap: https://your-site.com/sitemap.xml
```

## Performance Optimization

Improve your site's Core Web Vitals:

1. Optimize images:
   - Use modern formats like WebP
   - Specify width and height
   - Use responsive images with `srcset`

2. Preload critical resources:

```javascript
// .vitepress/config.js
export default {
  head: [
    // Preload critical resources
    ['link', { rel: 'preload', as: 'style', href: '/assets/css/critical.css' }],
    ['link', { rel: 'preload', as: 'font', href: '/fonts/your-font.woff2', crossorigin: 'anonymous' }],
  ]
}
```

3. Lazy load non-critical resources:

```html
<img loading="lazy" src="image.jpg" alt="Description" />
```

## Analytics

### Google Analytics 4

```javascript
// .vitepress/theme/index.js
export default {
  enhanceApp({ app, router, siteData }) {
    if (typeof window !== 'undefined') {
      // Google Tag Manager
      ;(function (w, d, s, l, i) {
        w[l] = w[l] || []
        w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
        const f = d.getElementsByTagName(s)[0],
          j = d.createElement(s),
          dl = l != 'dataLayer' ? '&l=' + l : ''
        j.async = true
        j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl
        f.parentNode.insertBefore(j, f)
      })(window, document, 'script', 'dataLayer', 'YOUR-GTM-ID')
    }
  }
}
```

### Plausible Analytics

```javascript
// .vitepress/config.js
export default {
  head: [
    ['script', { defer: '', 'data-domain': 'yourdomain.com', src: 'https://plausible.io/js/plausible.js' }]
  ]
}
```

## Internationalization (i18n)

Set up hreflang tags for multilingual sites:

```javascript
// .vitepress/config.js
export default {
  locales: {
    '/en/': {
      lang: 'en-US',
      title: 'My Site',
      description: 'My site description',
    },
    '/fr/': {
      lang: 'fr-FR',
      title: 'Mon Site',
      description: 'Description de mon site',
    },
  },
  head: [
    ['link', { rel: 'alternate', hreflang: 'en', href: 'https://your-site.com/en/' }],
    ['link', { rel: 'alternate', hreflang: 'fr', href: 'https://your-site.com/fr/' }],
    ['link', { rel: 'alternate', hreflang: 'x-default', href: 'https://your-site.com/en/' }],
  ]
}
```
