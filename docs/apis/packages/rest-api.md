# @kowork/rest-api

## Introduction

@kowork/rest-api is a functional programming approach to REST API interactions, combining the simplicity of fetch with the power of functional programming patterns from fp-ts. It provides a type-safe way to handle HTTP requests and responses with proper error handling.

## Features

- Type-safe REST API client
- Functional programming approach with Either/TaskEither patterns
- Built-in error handling
- Automatic request/response transformation
- Middleware support for request/response processing
- Seamless integration with the Kowork ecosystem

## Installation

```bash
# npm
npm install @kowork/rest-api

# yarn
yarn add @kowork/rest-api

# pnpm
pnpm add @kowork/rest-api

# bun
bun add @kowork/rest-api
```

## Usage

### Basic Example

```typescript
import { createClient } from '@kowork/rest-api';

// Create a client instance
const api = createClient({
  baseURL: 'https://api.example.com',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Make a GET request
const getUsers = async () => {
  const response = await api.get('/users');
  
  // The response is wrapped in an Either type
  if (response.isRight()) {
    return response.right;
  } else {
    console.error('Error fetching users:', response.left);
    throw new Error('Failed to fetch users');
  }
};

// Make a POST request with a body
const createUser = async (userData) => {
  const response = await api.post('/users', { body: userData });
  
  return response.match({
    right: (data) => data,
    left: (error) => {
      console.error('Error creating user:', error);
      throw error;
    }
  });
};
```

## API Reference

### `createClient(options)`

Creates a new REST API client instance with the given options.

#### Options

- `baseURL`: Base URL for all requests
- `headers`: Default headers to include with every request
- `timeout`: Request timeout in milliseconds
- `middleware`: Array of middleware functions for request/response processing
- `fetch`: Custom fetch implementation (defaults to global fetch)

### Client Methods

- `get(url, options)`: Perform a GET request
- `post(url, options)`: Perform a POST request
- `put(url, options)`: Perform a PUT request
- `patch(url, options)`: Perform a PATCH request
- `delete(url, options)`: Perform a DELETE request

### Request Options

- `params`: Query parameters object
- `headers`: Request headers
- `body`: Request body (automatically serialized for JSON)
- `signal`: AbortSignal for cancellation
- `responseType`: Expected response type ('json', 'text', 'blob', etc.)
