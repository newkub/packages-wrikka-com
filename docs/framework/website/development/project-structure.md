# Project Structure

Understanding the project structure is key to working effectively with our framework. This guide explains the purpose of each directory and file in a typical project.

## Overview

```
my-app/
├── .vscode/             # VS Code settings
├── node_modules/        # Dependencies
├── public/             # Static files
├── src/
│   ├── assets/         # Static assets (images, fonts, etc.)
│   ├── components/     # Vue components
│   ├── composables/    # Composable functions
│   ├── layouts/        # Layout components
│   ├── pages/          # Application pages (file-based routing)
│   ├── plugins/        # Vue plugins
│   ├── server/         # Server-side code
│   │   ├── api/        # API routes
│   │   ├── middleware/ # Server middleware
│   │   └── plugins/    # Server plugins
│   ├── stores/         # State management (Pinia)
│   ├── types/          # TypeScript type definitions
│   ├── app.vue         # Main app component
│   └── main.ts         # Application entry point
├── .env                # Environment variables
├── .env.example        # Example environment variables
├── .gitignore          # Git ignore file
├── app.config.ts       # Application configuration
├── package.json        # Project configuration
├── README.md           # Project documentation
├── tsconfig.json       # TypeScript configuration
└── vite.config.ts      # Vite configuration
```

## Key Directories

### `src/`

Contains all your application's source code.

### `src/assets/`

Store static assets like images, fonts, and styles that are processed by the build system.

### `src/components/`

Contains your Vue components. Components here are auto-imported and can be used in your templates without explicit imports.

### `src/composables/`

Contains [Composition API](https://v3.vuejs.org/guide/composition-api-introduction.html) composables. These are reusable pieces of logic that can be shared across components.

### `src/layouts/`

Layouts are used to define the page structure that will be shared across multiple pages.

### `src/pages/`

This directory uses file-based routing. Each `.vue` file becomes a route in your application.

### `src/plugins/`

Vue plugins that you want to run when instantiating the Vue application.

### `src/server/`

Contains server-side code that runs on the server.

#### `src/server/api/`

API routes. Each file in this directory becomes an API endpoint.

#### `src/server/middleware/`

Server middleware that runs on every request.

### `src/stores/`

[Pinia](https://pinia.vuejs.org/) stores for state management.

## Configuration Files

### `app.config.ts`

Application configuration that can be accessed throughout your app.


```ts
export default defineAppConfig({
  // Application title
  title: 'My App',
  
  // Theme configuration
  theme: {
    primaryColor: '#3b82f6',
    // ...
  },
  
  // API configuration
  api: {
    baseURL: process.env.API_URL || '/api',
    // ...
  }
})
```

### `vite.config.ts`

[Vite](https://vitejs.dev/config/) configuration file.

## Environment Variables

### `.env`

Environment variables are exposed to your application via `import.meta.env`.

```sh
# Server port
VITE_PORT=3000

# API base URL
VITE_API_URL=/api
```

## TypeScript Support

The framework includes TypeScript support out of the box. You can find type definitions in the `src/types/` directory.

## Best Practices

1. **Component Organization**: Group related components in subdirectories.
2. **Naming Conventions**: Use kebab-case for file names and PascalCase for component names.
3. **State Management**: Use Pinia for global state that needs to be shared across components.
4. **Environment Variables**: Prefix all custom environment variables with `VITE_` to make them available to your client-side code.
