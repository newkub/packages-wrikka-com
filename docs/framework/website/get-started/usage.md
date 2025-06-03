# Getting Started

## Prerequisites

- Node.js 16.0.0 or higher
- npm, yarn, or pnpm
- Basic knowledge of Vue.js and TypeScript

## Installation

### Create a New Project

```bash
# Using npm
npm create our-framework@latest my-app

# Using yarn
yarn create our-framework my-app

# Using pnpm
pnpm create our-framework my-app
```

This will create a new directory called `my-app` with the following structure:

```
my-app/
├── .vscode/             # VS Code settings
├── node_modules/        # Dependencies
├── public/             # Static files
├── src/
│   ├── assets/         # Static assets
│   ├── components/      # Vue components
│   ├── composables/     # Composable functions
│   ├── layouts/         # Layout components
│   ├── pages/           # Application pages
│   ├── plugins/         # Vue plugins
│   ├── stores/          # State management
│   ├── app.vue          # Main app component
│   └── main.ts          # Application entry point
├── .env                 # Environment variables
├── .gitignore           # Git ignore file
├── package.json         # Project configuration
├── README.md           # Project documentation
└── tsconfig.json       # TypeScript configuration
```

## Development Server

Start the development server:

```bash
# Navigate to your project
cd my-app

# Start the development server
npm run dev

# or
yarn dev

# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see your application.

## Building for Production

To create a production build:

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## Project Structure

### Pages

Create `.vue` files in the `src/pages` directory to automatically generate routes. For example:

- `pages/index.vue` → `/`
- `pages/users/index.vue` → `/users`
- `pages/users/[id].vue` → `/users/1`, `/users/2`, etc.

### Components

Place your Vue components in the `src/components` directory. They'll be automatically imported when used in your templates.

### Layouts

Define layouts in the `src/layouts` directory and use them in your pages:

```vue
<script setup>
// pages/index.vue
definePageMeta({
  layout: 'default'
})
</script>
```

### API Routes

Create API endpoints by adding files to the `src/server/api` directory:

```ts
// server/api/hello.ts
export default defineEventHandler((event) => {
  return { message: 'Hello World' }
})
```

Access it at `/api/hello`.

## Next Steps

- Learn about [routing](/framework/website/frontend/routing)
- Explore [components](/framework/website/frontend/components)
- Read about [state management](/framework/website/frontend/state)
- Check out [deployment options](/framework/website/frontend/deployment)
