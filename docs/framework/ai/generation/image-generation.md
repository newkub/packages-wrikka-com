# Image Generation

The Image Generation API allows you to create and edit images using natural language prompts. This is useful for generating visual content, concept art, and design assets.

## Basic Usage

```typescript
import { createAIClient } from '@wrikka/ai-sdk';

const ai = createAIClient({
  apiKey: 'your-api-key',
});

const response = await ai.generateImage({
  prompt: 'A futuristic cityscape at sunset, digital art',
  n: 1,
  size: '1024x1024',
});

console.log(response.data[0].url); // URL of the generated image
```

## API Reference

### `generateImage(options: ImageGenerationOptions): Promise<ImageGenerationResponse>`

Generates images based on the provided prompt and options.

#### Parameters

- `options` (Object):
  - `prompt` (string, required): A text description of the desired image.
  - `n` (number, optional, default: 1): The number of images to generate (1-10).
  - `size` (string, optional, default: '1024x1024'): The size of the generated images. Must be one of '256x256', '512x512', or '1024x1024'.
  - `responseFormat` (string, optional, default: 'url'): The format in which the generated images are returned. Must be 'url' or 'b64_json'.
  - `user` (string, optional): A unique identifier representing your end-user.

#### Returns

- `Promise&lt;ImageGenerationResponse&gt;`: An object containing:
  - `created` (number): The timestamp when the image was generated.
  - `data` (Array&lt;ImageData&gt;): An array of generated images.
    - `url` (string, present if responseFormat is 'url'): The URL of the generated image.
    - `b64_json` (string, present if responseFormat is 'b64_json'): The base64-encoded JSON of the image.

## Examples

### Basic Image Generation

```typescript
const response = await ai.generateImage({
  prompt: 'A serene lake surrounded by mountains at sunrise, digital painting',
  n: 2,
  size: '512x512',
});

// Display the first image
console.log('Image URL:', response.data[0].url);
```

### Image Generation with Base64 Response

```typescript
const response = await ai.generateImage({
  prompt: 'A futuristic robot reading a book, digital art',
  responseFormat: 'b64_json',
});

// The image data is in response.data[0].b64_json
const imageData = response.data[0].b64_json;
```

## Image Editing

You can edit an existing image by providing an image and a mask:

```typescript
const response = await ai.editImage({
  image: 'path/to/image.png',
  mask: 'path/to/mask.png', // Optional
  prompt: 'Add a rainbow in the sky',
  n: 1,
  size: '512x512',
});

console.log('Edited image URL:', response.data[0].url);
```

## Image Variations

Generate variations of an existing image:

```typescript
const response = await ai.createImageVariation({
  image: 'path/to/image.png',
  n: 3,
  size: '512x512',
});

response.data.forEach((img, i) => {
  console.log(`Variation ${i + 1}:`, img.url);
});
```

## Best Practices

1. **Be Specific**: The more detailed your prompt, the better the results.
2. **Use References**: Include style references in your prompt (e.g., "in the style of Van Gogh").
3. **Iterate**: You may need to adjust your prompt and try again to get the desired result.
4. **Respect Copyright**: Ensure you have the right to use any source images for editing.

## Error Handling

```typescript
try {
  const response = await ai.generateImage({
    prompt: 'A beautiful landscape',
    n: 1,
    size: '1024x1024',
  });
  console.log('Image URL:', response.data[0].url);
} catch (error) {
  console.error('Error generating image:', error.message);
  if (error.response) {
    console.error('Status:', error.response.status);
    console.error('Data:', error.response.data);
  }
}
```

## Rate Limits

- Free tier: 50 images/day
- Pro tier: 500 images/day
- Enterprise: Custom limits available

## Model Information

- **Default Model**: `wrikka-image-alpha-001`
- **Max Images per Request**: 10
- **Supported Formats**: PNG, JPEG (for uploads)

## Next Steps

- [Video Generation](/framework/ai/generation/video-generation)
- [Audio Generation](/framework/ai/generation/audio-generation)
- [Text Generation](/framework/ai/generation/text-generation)
