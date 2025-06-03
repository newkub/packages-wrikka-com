# Vite Configuration

VitePress is built on [Vite](https://vitejs.dev/), and you can customize the Vite configuration to extend its functionality.

## Basic Vite Configuration

Create or modify the Vite configuration in `.vitepress/config.js`:

```javascript
// .vitepress/config.js
import { defineConfig } from 'vitepress'

export default defineConfig({
  // Vite config
  vite: {
    // Vite config options
    server: {
      port: 3000,
      fs: {
        // Allow serving files from one level up from the package root
        allow: ['..']
      }
    },
    // Build options
    build: {
      minify: 'terser',
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            // Split vendor modules
            'vue': ['vue', 'vue-router', 'vuex'],
            // Split code into chunks
            'components': ['@/components/**/*.vue'],
            'utils': ['@/utils/**/*.js']
          }
        }
      }
    },
    // CSS preprocessor options
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss";`
        },
        less: {
          modifyVars: {
            'primary-color': '#1890ff',
            'link-color': '#1890ff',
            'border-radius-base': '2px',
          },
          javascriptEnabled: true
        }
      }
    },
    // Plugins
    plugins: [
      // Add Vite plugins here
    ],
    // Alias
    resolve: {
      alias: {
        '@': '/path/to/src',
        'components': '/path/to/components'
      }
    },
    // Environment variables
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
    },
    // Optimize deps
    optimizeDeps: {
      include: ['vue', 'vue-router', 'vuex'],
      exclude: ['your-package-to-exclude']
    },
    // Log level
    logLevel: 'info',
    // Clear screen
    clearScreen: true,
    // Custom CSS dev source map
    cssDevSourcemap: true,
    // Custom build target
    esbuild: {
      jsxFactory: 'h',
      jsxFragment: 'Fragment',
      target: 'es2020',
      // Minify
      minify: true
    },
    // JSON options
    json: {
      namedExports: true,
      stringify: false
    },
    // Dep optimization options
    server: {
      // Proxy configuration
      proxy: {
        '/api': {
          target: 'http://jsonplaceholder.typicode.com',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      },
      // Enable CORS
      cors: true,
      // Open browser on server start
      open: true,
      // Enable HTTPS
      https: {
        key: fs.readFileSync('path/to/key.pem'),
        cert: fs.readFileSync('path/to/cert.pem')
      },
      // Host
      host: '0.0.0.0',
      // Port
      port: 3000,
      // Strict port
      strictPort: false,
      // Force pre-bundling
      force: true
    }
  },
  // ... other VitePress config
})
```

## Using Vite Plugins

You can use any Vite plugin in your VitePress project. Here are some useful ones:

### 1. Vue 3 Support

```bash
npm install -D @vitejs/plugin-vue
```

```javascript
// .vitepress/config.js
import vue from '@vitejs/plugin-vue'

export default {
  vite: {
    plugins: [vue()]
  }
}
```

### 2. Auto Import Components

```bash
npm install -D unplugin-vue-components
```

```javascript
// .vitepress/config.js
import Components from 'unplugin-vue-components/vite'

export default {
  vite: {
    plugins: [
      Components({
        // Allow auto load markdown components under `./src/components/`
        extensions: ['vue', 'md'],
        // Allow auto import and register components used in markdown
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: 'src/components.d.ts',
      })
    ]
  }
}
```

### 3. Icons

```bash
npm install -D unplugin-icons
```

```javascript
// .vitepress/config.js
import Icons from 'unplugin-icons/vite'

export default {
  vite: {
    plugins: [
      Icons({ compiler: 'vue3' })
    ]
  }
}
```

### 4. Markdown Enhancements

```bash
npm install -D vite-plugin-md
```

```javascript
// .vitepress/config.js
import Markdown from 'vite-plugin-md'

export default {
  vite: {
    plugins: [
      Markdown({
        // Default options passed to markdown-it
        // See: https://markdown-it.github.io/markdown-it/
        markdownItOptions: {
          html: true,
          linkify: true,
          typographer: true,
        },
        // A function providing the Markdown It instance gets the ability to apply custom settings/plugins
        markdownItSetup(md) {
          // Add anchor links to headings
          md.use(require('markdown-it-anchor'))
          // Add table of contents support
          md.use(require('markdown-it-toc-done-right'))
          // Add code syntax highlighting with prismjs
          md.use(require('markdown-it-prism'))
        },
        // Class for the container div
        wrapperClasses: 'markdown-body',
      })
    ]
  }
}
```

### 5. Environment Variables

Create a `.env` file in your project root:

```sh
VITE_APP_TITLE=My App
VITE_API_URL=https://api.example.com
```

Access environment variables in your Vue components:

```vue
<template>
  <div>
    <h1>{{ title }}</h1>
    <p>API URL: {{ apiUrl }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const title = import.meta.env.VITE_APP_TITLE
const apiUrl = import.meta.env.VITE_API_URL
</script>
```

## Customizing the Build

### 1. Build Output Directory

```javascript
// .vitepress/config.js
export default {
  vite: {
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      // Generate source maps
      sourcemap: true,
      // Minify with terser
      minify: 'terser',
      // Terser options
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      },
      // Chunk size warning limit
      chunkSizeWarningLimit: 1000,
      // Rollup options
      rollupOptions: {
        // External dependencies
        external: ['vue', 'vue-router'],
        // Output options
        output: {
          // Manual chunks
          manualChunks: {
            'vue': ['vue', 'vue-router', 'vuex'],
            'element-plus': ['element-plus'],
            'echarts': ['echarts']
          },
          // Entry file names
          entryFileNames: 'assets/js/[name].[hash].js',
          // Chunk file names
          chunkFileNames: 'assets/js/[name].[hash].js',
          // Asset file names
          assetFileNames: 'assets/[ext]/[name].[hash].[ext]'
        }
      }
    }
  }
}
```

### 2. Copy Public Assets

Place files in the `public` directory to copy them to the output directory as-is.

### 3. PWA Support

```bash
npm install -D vite-plugin-pwa
```

```javascript
// .vitepress/config.js
import { VitePWA } from 'vite-plugin-pwa'

export default {
  vite: {
    plugins: [
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
        manifest: {
          name: 'My App',
          short_name: 'App',
          description: 'My Awesome App',
          theme_color: '#ffffff',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        }
      })
    ]
  }
}
```

## Custom Server

You can customize the Vite dev server:

```javascript
// .vitepress/config.js
export default {
  vite: {
    server: {
      // Enable HTTPS
      https: {
        key: fs.readFileSync('path/to/server.key'),
        cert: fs.readFileSync('path/to/server.crt')
      },
      // Configure CORS
      cors: true,
      // Proxy API requests
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, '')
        }
      },
      // Enable HMR
      hmr: {
        overlay: true
      },
      // Watch options
      watch: {
        usePolling: true,
        interval: 100
      },
      // Open browser
      open: true,
      // Host
      host: '0.0.0.0',
      // Port
      port: 3000,
      // Strict port
      strictPort: false
    }
  }
}
```

## Custom Build Commands

Add custom scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "vitepress dev",
    "build": "vitepress build",
    "preview": "vitepress preview",
    "build:staging": "cross-env NODE_ENV=staging vitepress build",
    "build:prod": "cross-env NODE_ENV=production vitepress build",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .gitignore",
    "format": "prettier --write ."
  }
}
```

## Environment-Specific Configurations

You can have different configurations for different environments:

```javascript
// .vitepress/config.js
const isProduction = process.env.NODE_ENV === 'production'
const isStaging = process.env.NODE_ENV === 'staging'

export default {
  // Base config
  title: 'My App',
  description: 'My Awesome App',
  
  // Environment-specific overrides
  ...(isProduction && {
    base: '/production-subpath/',
    outDir: 'dist/production'
  }),
  
  ...(isStaging && {
    base: '/staging-subpath/',
    outDir: 'dist/staging',
    // Disable analytics in staging
    head: [
      ['script', { src: 'analytics.js' }]
    ]
  }),
  
  // Vite config
  vite: {
    define: {
      __APP_ENV__: JSON.stringify(process.env.NODE_ENV || 'development')
    },
    ...(isProduction && {
      build: {
        minify: 'terser',
        sourcemap: false
      }
    })
  }
}
```

## Customizing the Markdown Parser

You can customize how Markdown is processed:

```javascript
// .vitepress/config.js
import markdownIt from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor'

export default {
  markdown: {
    // Custom markdown-it instance
    config: (md) => {
      md.use(markdownItAnchor, {
        level: [1, 2, 3],
        permalink: markdownItAnchor.permalink.headerLink({
          safariReaderFix: true
        })
      })
      
      // Add custom containers
      md.use(require('markdown-it-container'), 'warning', {
        validate: function(params) {
          return params.trim().match(/^warning\s+(.*)$/)
        },
        render: function (tokens, idx) {
          const m = tokens[idx].info.trim().match(/^warning\s+(.*)$/)
          if (tokens[idx].nesting === 1) {
            return '<div class="warning">' + md.utils.escapeHtml(m[1]) + '\n'
          } else {
            return '</div>\n'
          }
        }
      })
    },
    // Line numbers
    lineNumbers: true,
    // External links open in new tab
    externalLinks: {
      target: '_blank',
      rel: 'noopener noreferrer'
    },
    // Table of contents
    toc: {
      level: [2, 3, 4],
      listType: 'ul'
    },
    // Anchor links
    anchor: {
      level: [1, 2, 3, 4],
      permalink: true,
      permalinkBefore: true,
      permalinkSymbol: '#'
    },
    // Custom theme for syntax highlighting
    theme: {
      light: 'github-light',
      dark: 'github-dark'
    },
    // Custom code block languages
    languages: [
      // Add custom language definition for mermaid
      {
        name: 'mermaid',
        ext: '.mmd',
        aliases: ['mermaid-code'],
        process: (code) => {
          return `<div class="mermaid">${code}</div>`
        }
      }
    ]
  }
}
```

## Performance Optimization

### 1. Code Splitting

```javascript
// .vitepress/config.js
export default {
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vue': ['vue', 'vue-router', 'vuex'],
            'ui': ['element-plus', 'ant-design-vue'],
            'utils': ['lodash', 'dayjs', 'axios']
          }
        }
      }
    }
  }
}
```

### 2. Preload Directives

```javascript
// .vitepress/config.js
export default {
  head: [
    // Preload critical resources
    ['link', { rel: 'preload', as: 'style', href: '/assets/css/critical.css' }],
    ['link', { rel: 'preload', as: 'font', href: '/fonts/your-font.woff2', crossorigin: 'anonymous' }],
    // Preconnect to external domains
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    // Prefetch resources
    ['link', { rel: 'prefetch', href: '/assets/other-page.js' }]
  ]
}
```

### 3. Lazy Loading Components

```vue
<template>
  <div>
    <button @click="show = true">Load Component</button>
    <Suspense v-if="show">
      <template #default>
        <LazyComponent />
      </template>
      <template #fallback>
        <div>Loading...</div>
      </template>
    </Suspense>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const show = ref(false)
const LazyComponent = () => import('./HeavyComponent.vue')
</script>
```

## Debugging

### 1. Enable Debug Logs

```bash
# Linux/Mac
export DEBUG=vite:*
# Windows
set DEBUG=vite:*

# Run dev server
npm run dev
```

### 2. Inspect Vite's Intermediate State

```bash
# Inspect the resolved Vite config
npx vite inspect

# Inspect the production bundle
npx vite-bundle-visualizer
```

### 3. Profile Build Performance

```bash
# Generate CPU profile
node --cpu-prof --heap-prof -r @vitejs/plugin-vue/register vite build

# Then open the generated .cpuprofile file in Chrome DevTools
```

## TypeScript Support

### 1. Type Checking in Vue SFCs

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    "moduleResolution": "node",
    "strict": true,
    "jsx": "preserve",
    "sourceMap": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "lib": ["esnext", "dom", "dom.iterable", "scripthost"],
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.d.ts",
    "src/**/*.tsx",
    "src/**/*.vue",
    "tests/**/*.ts",
    "tests/**/*.tsx"
  ],
  "exclude": ["node_modules"]
}
```

### 2. Type Declarations

```typescript
// env.d.ts
/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// For .md files (if using markdown as Vue components)
declare module '*.md' {
  import { ComponentOptions } from 'vue'
  const Component: ComponentOptions
  export default Component
}

// For environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test'
    VITE_APP_TITLE: string
    VITE_API_URL: string
  }
}

// For Vite's import.meta.env
interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_API_URL: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
```
