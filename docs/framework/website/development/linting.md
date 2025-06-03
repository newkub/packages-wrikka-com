# Linting and Code Quality

Maintaining code quality is crucial for any project. Our framework comes with pre-configured linting and formatting tools to ensure consistent code style and catch potential issues early.

## ESLint

[ESLint](https://eslint.org/) is used to identify and report on patterns found in your code.

### Configuration

ESLint is configured in `.eslintrc.js`:

```js
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    '@vue/typescript/recommended',
    'plugin:prettier/recommended',
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module',
  },
  rules: {
    // Add your custom rules here
    'vue/multi-word-component-names': 'off',
  },
}
```

### Running ESLint

```bash
# Lint all files
npm run lint

# Fix auto-fixable issues
npm run lint:fix
```

## Prettier

[Prettier](https://prettier.io/) is an opinionated code formatter that ensures consistent code style.

### Configuration

Prettier is configured in `.prettierrc`:

```json
{
  "semi": false,
  "singleQuote": true,
  "printWidth": 100,
  "trailingComma": "es5",
  "tabWidth": 2,
  "endOfLine": "auto"
}
```

### Running Prettier

```bash
# Format all files
npm run format

# Check formatting
npm run format:check
```

## TypeScript

TypeScript helps catch errors during development through static type checking.

### Configuration

TypeScript is configured in `tsconfig.json`:

```json
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
    "skipLibCheck": true,
    "types": ["vite/client", "@types/node"],
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.d.ts",
    "src/**/*.tsx",
    "src/**/*.vue"
  ]
}
```

### Type Checking

```bash
# Run type checking
npm run type-check

# Watch for type errors
npm run type-check:watch
```

## Editor Integration

### VS Code

For the best development experience, install these extensions:

- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) - Vue 3 support
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)

Add this to your VS Code settings (`settings.json`):

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.validate": ["javascript", "javascriptreact", "typescript", "typescriptreact", "vue"]
}
```

## Git Hooks

Pre-commit hooks are set up using [lint-staged](https://github.com/okonet/lint-staged) and [Husky](https://typicode.github.io/husky/).

### Configuration

```json
// package.json
{
  "lint-staged": {
    "*.{js,jsx,vue,ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{json,md,html,css,scss}": ["prettier --write"]
  }
}
```

### Setup

```bash
# Install Husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npx lint-staged"
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
      
      - name: Build
        run: npm run build
```

## Custom Rules

You can extend the default rules by modifying the respective configuration files. For example, to add custom ESLint rules:

```js
// .eslintrc.js
module.exports = {
  // ...
  rules: {
    // Your custom rules here
    'vue/max-attributes-per-line': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/multi-word-component-names': 'off',
  },
}
```

## Best Practices

1. **Run Linters Before Committing**: Ensure your code passes all linting rules before committing.
2. **Fix Warnings**: Don't ignore linter warnings; they often indicate potential issues.
3. **Consistent Formatting**: Let Prettier handle code formatting to maintain consistency.
4. **Type Safety**: Use TypeScript types effectively to catch errors early.
5. **Editor Integration**: Configure your editor to show linting and formatting issues in real-time.
