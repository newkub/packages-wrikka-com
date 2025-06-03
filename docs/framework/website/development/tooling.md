# Development Tooling

This guide covers the essential development tools and configurations that come with the framework to enhance your development experience.

## Built-in Scripts

Your `package.json` includes several useful scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "run-p type-check build-only",
    "preview": "vite preview",
    "test:unit": "vitest",
    "test:e2e": "cypress run",
    "test": "run-p test:unit test:e2e",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .gitignore",
    "format": "prettier --write src/", 
    "type-check": "vue-tsc --noEmit",
    "prepare": "husky install"
  }
}
```

## VS Code Configuration

### Recommended Extensions

1. **Volar** - Vue 3 language features
2. **TypeScript Vue Plugin (Volar)** - TypeScript support for Vue files
3. **ESLint** - JavaScript/TypeScript linting
4. **Prettier** - Code formatter
5. **Stylelint** - CSS/SCSS linting
6. **DotENV** - .env file support
7. **GitLens** - Git supercharged
8. **Path Intellisense** - Path autocompletion

### Settings

Add to `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  "eslint.validate": [
    "javascript",
    "javascriptreact",
    "typescript",
    "typescriptreact",
    "vue"
  ],
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "files.associations": {
    "*.css": "postcss"
  },
  "files.exclude": {
    "**/.git": true,
    "**/.DS_Store": true,
    "**/node_modules": false,
    "**/dist": false
  },
  "search.exclude": {
    "**/node_modules": true,
    "**/dist": true,
    "**/.nuxt": true,
    "**/.next": true
  }
}
```

## Browser Extensions

1. **Vue.js devtools** - Inspect Vue components and state
2. **Redux DevTools** - For Pinia state inspection
3. **Apollo Client DevTools** - If using GraphQL
4. **React Developer Tools** - For debugging React components (if used)
5. **JSON Formatter** - Better JSON viewing

## Debugging

### VS Code Debugger

Add this to `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "vuejs: chrome",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/src",
      "breakOnLoad": true,
      "sourceMapPathOverrides": {
        "webpack:///src/*": "${webRoot}/*"
      }
    },
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Tests",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "test:unit"],
      "port": 9229,
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

### Debugging in Chrome

1. Add `debugger` statements in your code
2. Open Chrome DevTools (F12)
3. Go to Sources > Page
4. Find your file and set breakpoints

## Testing

### Unit Testing with Vitest

Example test file:

```ts
// tests/unit/example.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld.vue'

describe('HelloWorld', () => {
  it('renders properly', () => {
    const wrapper = mount(HelloWorld, {
      props: { msg: 'Hello Vitest' },
    })
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})
```

### Component Testing with Testing Library

```ts
// tests/component/Button.spec.ts
import { render, screen } from '@testing-library/vue'
import Button from '@/components/Button.vue'

describe('Button', () => {
  it('renders button text', () => {
    render(Button, {
      slots: {
        default: 'Click me',
      },
    })
    
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

### E2E Testing with Cypress

Example test:

```ts
// cypress/e2e/home.cy.ts
describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('displays the index page', () => {
    cy.get('h1').should('contain', 'Welcome')
  })
})
```

## Performance Profiling

### Web Vitals

```ts
// src/main.ts
import { createApp } from 'vue'
import { getCLS, getFID, getLCP } from 'web-vitals'

const app = createApp(App)

if (process.env.NODE_ENV === 'production') {
  getCLS(console.log)
  getFID(console.log)
  getLCP(console.log)
}
```

### Bundle Analysis

```bash
# Install the analyzer
npm install -D rollup-plugin-visualizer

# Add to vite.config.ts
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    // ...
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
})
```

## Git Hooks

Pre-commit hooks are set up with Husky and lint-staged:

```json
// package.json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx,vue}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,html,css,scss}": [
      "prettier --write"
    ]
  }
}
```

## Environment Variables

Create a `.env` file:

```sh
VITE_API_URL=https://api.example.com
VITE_APP_TITLE=My App
```

Access in your code:

```ts
const apiUrl = import.meta.env.VITE_API_URL
```

## EditorConfig

Create a `.editorconfig` file:

```ini
root = true

[*]
charset = utf-8
end_of_line = lf
indent_size = 2
indent_style = space
insert_final_newline = true
trim_trailing_whitespace = true

[*.md]
trim_trailing_whitespace = false
```

## VS Code Snippets

Create `.vscode/vue.code-snippets`:

```json
{
  "Vue 3 Setup": {
    "prefix": "v3setup",
    "body": [
      "<script setup lang=\"ts\">",
      "// Composition API code here",
      "</script>\n",
      "",
      "<template>",
      "  <div>\n    ",
      "  </div>",
      "</template>\n",
      "",
      "<style scoped>\n",
      "</style>"
    ]
  }
}
```

## Recommended VS Code Settings

```json
{
  "editor.tabSize": 2,
  "editor.detectIndentation": false,
  "editor.renderWhitespace": "selection",
  "editor.renderControlCharacters": true,
  "editor.minimap.enabled": true,
  "files.autoSave": "onFocusChange",
  "files.autoSaveDelay": 1000,
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,
  "files.trimFinalNewlines": true,
  "emmet.includeLanguages": {
    "vue-html": "html",
    "javascript": "javascriptreact"
  },
  "emmet.syntaxProfiles": {
    "vue-html": "html",
    "vue": "html"
  },
  "javascript.updateImportsOnFileMove.enabled": "always",
  "typescript.updateImportsOnFileMove.enabled": "always",
  "javascript.suggest.autoImports": true,
  "typescript.suggest.autoImports": true,
  "editor.bracketPairColorization.enabled": true,
  "editor.guides.bracketPairs": "active"
}
```

## Terminal Integration

### Custom Aliases

Add to your shell config (`.zshrc` or `.bashrc`):

```bash
# Project navigation
alias pj='cd ~/projects'

# Git shortcuts
alias gs='git status'
alias ga='git add .'
alias gc='git commit -m'
alias gp='git push'

# Package managers
alias nr='npm run'
alias ni='npm install'
alias nid='npm install -D'

# Common scripts
alias dev='npm run dev'
alias build='npm run build'
alias test='npm test'
alias lint='npm run lint'

# Docker
alias dc='docker-compose'
alias dcu='docker-compose up -d'
alias dcd='docker-compose down'

# Process management
alias ports='lsof -i -P -n | grep LISTEN'
```

### Git Configuration

```bash
# Set your Git identity
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set default branch name to main
git config --global init.defaultBranch main

# Set VS Code as default editor
git config --global core.editor "code --wait"

# Set default pull behavior
git config --global pull.rebase true

# Set credential helper (for HTTPS)
git config --global credential.helper store

# Set line endings (Windows)
git config --global core.autocrlf true

# Set line endings (Mac/Linux)
git config --global core.autocrlf input
```

## Performance Monitoring

### Web Vitals

```ts
// src/utils/web-vitals.ts
import { getCLS, getFID, getLCP, getFCP, getTTFB, Metric } from 'web-vitals'

type PerfEntryHandler = (metric: Metric) => void

const reportWebVitals = (onPerfEntry?: PerfEntryHandler) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    getCLS(onPerfEntry)
    getFID(onPerfEntry)
    getLCP(onPerfEntry)
    getFCP(onPerfEntry)
    getTTFB(onPerfEntry)
  }
}

export default reportWebVitals
```

### Error Tracking

```ts
// src/utils/error-handler.ts
export function setupErrorHandling(app: App) {
  // Global error handler
  app.config.errorHandler = (err, vm, info) => {
    console.error('Vue error:', err)
    // Send to error tracking service
    trackError({
      error: err,
      component: vm?.$options.name,
      info,
    })
  }

  // Unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled rejection:', event.reason)
    trackError({
      error: event.reason,
      type: 'unhandledrejection',
    })
  })
}
```

## Documentation

### JSDoc Comments

```ts
/**
 * Calculates the sum of two numbers
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Sum of a and b
 * @example
 * // returns 5
 * sum(2, 3)
 */
function sum(a: number, b: number): number {
  return a + b
}
```

### Storybook

1. Install Storybook:

```bash
npx storybook@latest init
```

2. Create a story:

```tsx
// src/stories/Button.stories.tsx
import type { Meta, StoryObj } from '@storybook/vue3'
import Button from '@/components/Button.vue'

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['primary', 'secondary', 'danger'],
    },
    size: {
      control: { type: 'select' },
      options: ['small', 'medium', 'large'],
    },
    onClick: { action: 'clicked' },
  },
}

export default meta

type Story = StoryObj<typeof Button>

export const Primary: Story = {
  args: {
    label: 'Button',
    variant: 'primary',
  },
}

export const Secondary: Story = {
  args: {
    label: 'Button',
    variant: 'secondary',
  },
}
```

3. Run Storybook:

```bash
npm run storybook
```

## Continuous Integration

Example GitHub Actions workflow (`.github/workflows/ci.yml`):

```yaml
name: CI

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Use Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Lint
      run: npm run lint
    
    - name: Type check
      run: npm run type-check
    
    - name: Test
      run: npm test
    
    - name: Build
      run: npm run build
    
    - name: E2E Tests
      uses: cypress-io/github-action@v5
      with:
        start: npm run dev
        wait-on: 'http://localhost:3000'
        wait-on-timeout: 120
        browser: chrome
        headless: true
```

## Performance Budget

Create a `performance-budget.json` file:

```json
{
  "performance": {
    "hints": "warning",
    "maxEntrypointSize": 512000,
    "maxAssetSize": 512000
  }
}
```

## Bundle Analysis

Run after build:

```bash
npx vite-bundle-visualizer
```

## Code Coverage

Add to `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
})
```

Run tests with coverage:

```bash
npm test -- --coverage
```
