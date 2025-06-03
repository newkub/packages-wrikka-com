# @kowork/rpc

## Introduction

@kowork/rpc is a TypeScript-first RPC framework that enables you to build end-to-end typesafe APIs. It provides a seamless way to define your backend procedures and call them from your frontend with full type safety.

## Features

- Full end-to-end type safety between client and server
- Automatic type inference for API routes
- Simplified API creation with minimal boilerplate
- Built-in validation using schema validators
- Optimized network requests with batching support
- Seamless integration with the rest of the Kowork ecosystem

## Installation

```bash
# npm
npm install @kowork/rpc

# yarn
yarn add @kowork/rpc

# pnpm
pnpm add @kowork/rpc

# bun
bun add @kowork/rpc
```

## Usage

### Server-side setup

```typescript
// server/api.ts
import { createRPC } from '@kowork/rpc';

export const rpc = createRPC()
  .procedure('hello', {
    input: z.object({ name: z.string() }),
    handler: async ({ input }) => {
      return `Hello, ${input.name}!`;
    }
  })
  .procedure('getUsers', {
    handler: async () => {
      return [{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }];
    }
  });

// Export type to be used on the client
export type AppRPC = typeof rpc;
```

### Client-side usage

```typescript
// client/index.ts
import { createRPCClient } from '@kowork/rpc/client';
import type { AppRPC } from '../server/api';

const client = createRPCClient<AppRPC>({
  url: '/api/rpc'
});

// Type-safe RPC calls
async function main() {
  // Fully typed response
  const greeting = await client.hello({ name: 'World' });
  console.log(greeting); // "Hello, World!"
  
  const users = await client.getUsers();
  console.log(users); // [{ id: 1, name: 'User 1' }, { id: 2, name: 'User 2' }]
}
```

## API Reference

### Server

- `createRPC()` - Creates a new RPC router
- `procedure(name, options)` - Defines a new procedure with name and options
- `middleware(fn)` - Adds middleware to the router

### Client

- `createRPCClient<T>(options)` - Creates a client for the given router type
- `client.query(name, input?)` - Makes a query to the specified procedure
- `client.mutation(name, input?)` - Makes a mutation to the specified procedure
