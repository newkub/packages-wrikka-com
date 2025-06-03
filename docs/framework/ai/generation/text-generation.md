# Text Generation

The Text Generation API allows you to generate human-like text based on a given prompt. This is useful for a variety of applications including content creation, chatbots, and more.

## Basic Usage

```typescript
import { createAIClient } from '@wrikka/ai-sdk';

const ai = createAIClient({
  apiKey: 'your-api-key',
});

const response = await ai.generateText({
  prompt: 'Write a short story about a robot learning to feel emotions.',
  maxTokens: 500,
  temperature: 0.7,
});

console.log(response.text);
```

## API Reference

### `generateText(options: TextGenerationOptions): Promise<TextGenerationResponse>`

Generates text based on the provided prompt and options.

#### Parameters

- `options` (Object):
  - `prompt` (string, required): The input text that will be used to generate the completion.
  - `maxTokens` (number, optional, default: 1000): The maximum number of tokens to generate.
  - `temperature` (number, optional, default: 0.7): Controls randomness. Lower values make the output more deterministic.
  - `topP` (number, optional, default: 1.0): Nucleus sampling parameter.
  - `frequencyPenalty` (number, optional, default: 0.0): Penalize new tokens based on their frequency in the text so far.
  - `presencePenalty` (number, optional, default: 0.0): Penalize new tokens based on whether they appear in the text so far.
  - `stop` (string | string[], optional): Up to 4 sequences where the API will stop generating further tokens.
  - `n` (number, optional, default: 1): How many completions to generate for each prompt.
  - `stream` (boolean, optional, default: false): Whether to stream back partial progress.
  - `user` (string, optional): A unique identifier representing your end-user.

#### Returns

- `Promise<TextGenerationResponse>`: An object containing:
  - `text` (string): The generated text.
  - `tokens` (number): The number of tokens used.
  - `model` (string): The model used for generation.
  - `id` (string): The ID of the generation.

## Examples

### Basic Text Completion

```typescript
const response = await ai.generateText({
  prompt: 'The future of AI is',
  maxTokens: 50,
});
```

### Chat Completion

```typescript
const messages = [
  { role: 'system', content: 'You are a helpful assistant.' },
  { role: 'user', content: 'What is the capital of France?' },
];

const response = await ai.generateText({
  prompt: messages.map(m => `${m.role}: ${m.content}`).join('\n'),
  maxTokens: 100,
});
```

### Code Generation

```typescript
const response = await ai.generateText({
  prompt: '// A function that reverses a string in JavaScript\nfunction reverseString',
  maxTokens: 200,
  temperature: 0.2,  // Lower temperature for more deterministic code
});
```

## Best Practices

1. **Be Specific with Prompts**: The more specific your prompt, the better the results.
2. **Use Temperature Wisely**: Lower temperatures (0.2-0.5) for factual responses, higher (0.7-1.0) for creative tasks.
3. **Set Max Tokens**: Always set a reasonable maxTokens to control response length.
4. **Handle Errors**: Always wrap API calls in try/catch blocks.

## Error Handling

```typescript
try {
  const response = await ai.generateText({
    prompt: 'Generate some text',
    maxTokens: 100,
  });
  console.log(response.text);
} catch (error) {
  console.error('Error generating text:', error.message);
  if (error.response) {
    console.error('Status:', error.response.status);
    console.error('Data:', error.response.data);
  }
}
```

## Rate Limits

- Free tier: 1000 requests/day
- Pro tier: 10,000 requests/day
- Enterprise: Custom limits available

## Model Information

- **Default Model**: `wrikka-text-davinci-003`
- **Max Tokens**: 4000 tokens
- **Training Data**: Up to October 2023

## Next Steps

- [Image Generation](/framework/ai/generation/image-generation)
- [Video Generation](/framework/ai/generation/video-generation)
- [Audio Generation](/framework/ai/generation/audio-generation)
