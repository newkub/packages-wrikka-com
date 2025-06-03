# AI SDK Overview

Welcome to the Wrikka AI SDK documentation! This SDK provides powerful tools and APIs to integrate AI capabilities into your applications.

## Key Features

- **Generation**: Text, image, video, and audio generation capabilities
- **Tooling**: Comprehensive AI tooling including embeddings, tool calling, and more
- **Agents**: Create and manage AI agents for complex tasks
- **APIs**: Easy-to-use APIs and components for seamless integration

## Getting Started

1. [Design Principles](/framework/ai/get-started/design-principles)
2. [Framework Integration](/framework/ai/get-started/framework-integration)

## Quick Start

```typescript
import { createAIClient } from '@wrikka/ai-sdk';

const ai = createAIClient({
  apiKey: 'your-api-key',
});

// Example: Generate text
const response = await ai.generateText({
  prompt: 'Hello, world!',
  maxTokens: 100,
});
```

## Next Steps

- Explore the [Generation](/framework/ai/generation/text-generation) capabilities
- Learn about [AI Agents](/framework/ai/agents/create-agents)
- Check out the [API Reference](/framework/ai/composables/mcp)

## Support

Need help? Check out our [GitHub repository](https://github.com/wrikka/ai-sdk) or join our [community forum](https://community.wrikka.com).