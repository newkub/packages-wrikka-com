# Framework Integration

This guide explains how to integrate the Wrikka AI SDK with popular JavaScript frameworks.

## Installation

```bash
# Using npm
npm install @wrikka/ai-sdk

# Using yarn
yarn add @wrikka/ai-sdk

# Using pnpm
pnpm add @wrikka/ai-sdk
```

## React Integration

```tsx
import { createAIClient } from '@wrikka/ai-sdk';
import { useEffect, useState } from 'react';

function App() {
  const [response, setResponse] = useState('');

  useEffect(() => {
    const ai = createAIClient({
      apiKey: 'your-api-key',
    });

    const fetchData = async () => {
      const result = await ai.generateText({
        prompt: 'Hello, React!',
      });
      setResponse(result.text);
    };

    fetchData();
  }, []);

  return <div>{response}</div>;
}

export default App;
```

## Vue Integration

```vue
<template>
  <div>
    <p>{{ response }}</p>
  </div>
</template>

<script>
import { createAIClient } from '@wrikka/ai-sdk';

export default {
  data() {
    return {
      response: '',
    };
  },
  async mounted() {
    const ai = createAIClient({
      apiKey: 'your-api-key',
    });

    const result = await ai.generateText({
      prompt: 'Hello, Vue!',
    });
    
    this.response = result.text;
  },
};
</script>
```

## Next.js Integration

For server-side rendering with Next.js, create a utility file to manage the AI client:

```typescript
// lib/ai.ts
import { createAIClient } from '@wrikka/ai-sdk';

const ai = createAIClient({
  apiKey: process.env.AI_API_KEY,
});

export default ai;
```

Then use it in your pages or API routes:

```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import ai from '../../lib/ai';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const result = await ai.generateText({
    prompt: 'Hello, Next.js!',
  });

  res.status(200).json({ text: result.text });
}
```

## Nuxt.js Integration

Create a plugin for Nuxt:

```typescript
// plugins/ai.ts
import { defineNuxtPlugin } from '#app';
import { createAIClient } from '@wrikka/ai-sdk';

export default defineNuxtPlugin((nuxtApp) => {
  const ai = createAIClient({
    apiKey: process.env.AI_API_KEY,
  });

  return {
    provide: {
      ai,
    },
  };
});
```

Use it in your components:

```vue
<template>
  <div>
    <p>{{ response }}</p>
  </div>
</template>

<script setup>
const { $ai } = useNuxtApp();
const response = ref('');

onMounted(async () => {
  const result = await $ai.generateText({
    prompt: 'Hello, Nuxt!',
  });
  response.value = result.text;
});
</script>
```

## Angular Integration

Create an AI service:

```typescript
// src/app/ai.service.ts
import { Injectable } from '@angular/core';
import { createAIClient } from '@wrikka/ai-sdk';

@Injectable({
  providedIn: 'root',
})
export class AIService {
  private ai = createAIClient({
    apiKey: 'your-api-key',
  });

  async generateText(prompt: string) {
    return this.ai.generateText({ prompt });
  }
}
```

Use it in your components:

```typescript
// src/app/app.component.ts
import { Component, OnInit } from '@angular/core';
import { AIService } from './ai.service';

@Component({
  selector: 'app-root',
  template: '{{ response }}',
})
export class AppComponent implements OnInit {
  response = '';

  constructor(private aiService: AIService) {}

  async ngOnInit() {
    const result = await this.aiService.generateText('Hello, Angular!');
    this.response = result.text;
  }
}
```

## Svelte Integration

```svelte
<script>
  import { onMount } from 'svelte';
  import { createAIClient } from '@wrikka/ai-sdk';

  let response = '';

  onMount(async () => {
    const ai = createAIClient({
      apiKey: 'your-api-key',
    });

    const result = await ai.generateText({
      prompt: 'Hello, Svelte!',
    });
    
    response = result.text;
  });
</script>

<div>
  {response}
</div>
```

## Configuration Options

All framework integrations support the following configuration options:

```typescript
const ai = createAIClient({
  // Required: Your API key
  apiKey: 'your-api-key',
  
  // Optional: Base URL for the API (default: 'https://api.wrikka.ai/v1')
  baseUrl: 'https://api.wrikka.ai/v1',
  
  // Optional: Default headers for all requests
  headers: {
    'X-Custom-Header': 'value',
  },
  
  // Optional: Timeout in milliseconds (default: 30000)
  timeout: 30000,
  
  // Optional: Enable debug mode (default: false)
  debug: false,
});
```

## Next Steps

- Learn about [AI Generation](/framework/ai/generation/text-generation)
- Explore [AI Agents](/framework/ai/agents/create-agents)
- Check out the [API Reference](/framework/ai/composables/mcp)
