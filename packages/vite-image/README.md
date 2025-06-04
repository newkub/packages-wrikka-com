# @wrikka/vite-image

A Vite plugin for optimizing and processing images in your Vite projects.

## Features

- 🖼️ Optimize images during build
- ⚡ Supports multiple image formats (PNG, JPG, JPEG, GIF, WebP, SVG, AVIF)
- 🔄 Automatic image processing in development and production
- 🛠️ Configurable optimization options

## Installation

```bash
# Using bun
bun add -D @wrikka/vite-image

# Using npm
npm install --save-dev @wrikka/vite-image

# Using yarn
yarn add --dev @wrikka/vite-image

# Using pnpm
pnpm add -D @wrikka/vite-image
```

## Usage

In your `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import viteImage from '@wrikka/vite-image';

export default defineConfig({
  plugins: [
    viteImage({
      // Optional: Disable in development
      enabled: process.env.NODE_ENV === 'production',
      
      // Optional: Customize included files
      include: ['**/*.{png,jpg,jpeg,gif,webp,svg,avif}'],
      
      // Optional: Disable optimization
      optimize: true,
      
      // Optional: Set image quality (0-100)
      quality: 80,
    }),
  ],
});
```

## Options

### `enabled`
- Type: `boolean`
- Default: `true`

Enable or disable the plugin.

### `include`
- Type: `string | string[]`
- Default: `['**/*.{png,jpg,jpeg,gif,webp,svg,avif}']`

File patterns to include for processing.

### `exclude`
- Type: `string | string[]`
- Default: `[]`

File patterns to exclude from processing.

### `optimize`
- Type: `boolean`
- Default: `true`


Enable or disable image optimization.

### `quality`
- Type: `number`
- Default: `80`
- Range: `0` to `100`

Quality level for image optimization.

## Development

### Build

```bash
bun run build
```

### Lint

```bash
bun run lint
```

### Format

```bash
bun run format
```

## License

MIT
