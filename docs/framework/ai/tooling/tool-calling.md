# Tool Calling (MCP)

Model Control Protocol (MCP) enables AI models to interact with external tools and services. This documentation covers how to define, register, and use tools within the Wrikka AI ecosystem.

## Overview

Tool Calling allows AI models to:
- Execute code
- Query databases
- Call external APIs
- Perform complex calculations
- Interact with the file system
- And more

## Quick Start

### 1. Define a Tool

```typescript
// tools/weather.ts
import { createTool } from '@wrikka/ai-sdk';

const getWeather = createTool({
  name: 'get_weather',
  description: 'Get the current weather for a location',
  parameters: {
    type: 'object',
    properties: {
      location: {
        type: 'string',
        description: 'The city and state, e.g., San Francisco, CA',
      },
      unit: {
        type: 'string',
        enum: ['celsius', 'fahrenheit'],
        default: 'celsius',
      },
    },
    required: ['location'],
  },
  handler: async ({ location, unit }) => {
    // Implementation to fetch weather data
    const response = await fetch(
      `https://api.weatherapi.com/v1/current.json?key=YOUR_API_KEY&q=${location}`
    );
    const data = await response.json();
    
    if (unit === 'celsius') {
      return {
        temperature: data.current.temp_c,
        condition: data.current.condition.text,
        location: data.location.name,
      };
    } else {
      return {
        temperature: data.current.temp_f,
        condition: data.current.condition.text,
        location: data.location.name,
      };
    }
  },
});

export default getWeather;
```

### 2. Register the Tool

```typescript
// app.ts
import { createAIClient } from '@wrikka/ai-sdk';
import getWeather from './tools/weather';

const ai = createAIClient({
  apiKey: 'your-api-key',
  tools: [getWeather],
});
```

### 3. Use the Tool

```typescript
// Use the tool directly
const weather = await ai.tools.get_weather({
  location: 'Tokyo',
  unit: 'celsius',
});

console.log(weather);
// { temperature: 22, condition: 'Sunny', location: 'Tokyo' }

// Or let the AI decide when to use the tool
const response = await ai.chat({
  messages: [
    { role: 'user', content: "What's the weather like in Paris?" },
  ],
  tools: ['get_weather'],
});

console.log(response.choices[0].message);
// { role: 'assistant', content: 'The weather in Paris is...', tool_calls: [...] }
```

## Tool Definition

### `createTool(options: ToolOptions): Tool`

Creates a new tool that can be used by the AI.

**Parameters:**
- `name` (string): A unique identifier for the tool.
- `description` (string): A description of what the tool does.
- `parameters` (JSON Schema): The input parameters the tool accepts.
- `handler` (function): The function that implements the tool's logic.
- `validate` (function, optional): Custom validation function.
- `timeout` (number, optional): Maximum execution time in milliseconds.

## Built-in Tools

The SDK includes several built-in tools:

### 1. `fetch`

Make HTTP requests:

```typescript
const response = await ai.tools.fetch({
  url: 'https://api.example.com/data',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### 2. `executeCode`

Execute code in a sandboxed environment:

```typescript
const result = await ai.tools.executeCode({
  language: 'python',
  code: 'def add(a, b):\n    return a + b\n\nadd(2, 3)',
  timeout: 5000, // ms
});
```

### 3. `queryDatabase`

Query a database:

```typescript
const users = await ai.tools.queryDatabase({
  connectionId: 'production-db',
  query: 'SELECT * FROM users WHERE age > ?',
  params: [18],
});
```

## Advanced Usage

### Tool Composition

Combine multiple tools into a single operation:

```typescript
const analyzeWeather = createTool({
  name: 'analyze_weather',
  description: 'Analyze weather patterns',
  parameters: {
    type: 'object',
    properties: {
      locations: {
        type: 'array',
        items: { type: 'string' },
        description: 'List of locations to analyze',
      },
    },
    required: ['locations'],
  },
  handler: async ({ locations }) => {
    const weatherData = await Promise.all(
      locations.map(location => 
        ai.tools.get_weather({ location })
      )
    );
    
    // Analyze the data
    const analysis = await ai.chat({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a weather analyst. Compare the weather in these locations.',
        },
        {
          role: 'user',
          content: `Compare the weather in these locations: ${JSON.stringify(weatherData)}`,
        },
      ],
    });
    
    return analysis.choices[0].message.content;
  },
});
```

### Tool Permissions

Control which tools are available:

```typescript
const ai = createAIClient({
  apiKey: 'your-api-key',
  tools: [getWeather, fetch],
  toolPermissions: {
    // Allow all tools
    default: 'allow',
    // Block specific tools
    block: ['executeCode', 'queryDatabase'],
  },
});
```

### Error Handling

Handle tool execution errors:

```typescript
try {
  const result = await ai.tools.get_weather({
    location: 'Invalid Location',
  });
} catch (error) {
  if (error.code === 'TOOL_EXECUTION_ERROR') {
    console.error('Tool execution failed:', error.message);
    console.error('Tool:', error.toolName);
    console.error('Parameters:', error.parameters);
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## Best Practices

1. **Idempotency**: Make tool handlers idempotent when possible.
2. **Validation**: Always validate input parameters.
3. **Timeouts**: Set appropriate timeouts for long-running operations.
4. **Error Handling**: Provide clear error messages.
5. **Security**: Never expose sensitive information in tool responses.
6. **Rate Limiting**: Implement rate limiting for external API calls.
7. **Caching**: Cache frequent or expensive operations.

## Security Considerations

- **Input Validation**: Always validate and sanitize input parameters.
- **Output Filtering**: Remove sensitive information from tool responses.
- **Access Control**: Restrict tool access based on user permissions.
- **Audit Logging**: Log tool usage for security and debugging.
- **Rate Limiting**: Prevent abuse of external services.

## Rate Limits

- Free tier: 100 tool calls/minute
- Pro tier: 1,000 tool calls/minute
- Enterprise: Custom limits available

## Next Steps

- [Thinking](/framework/ai/tooling/thinking)
- [Search](/framework/ai/tooling/search)
- [Research](/framework/ai/tooling/research)
