# Video Generation

The Video Generation API allows you to create, edit, and enhance videos using AI. This powerful tool can be used for creating marketing content, educational materials, and more.

## Basic Usage

```typescript
import { createAIClient } from '@wrikka/ai-sdk';

const ai = createAIClient({
  apiKey: 'your-api-key',
});

const response = await ai.generateVideo({
  prompt: 'A drone flying over a tropical beach at sunset, 4K, cinematic',
  duration: 10, // seconds
  resolution: '1080p',
});

console.log(response.videoUrl); // URL of the generated video
```

## API Reference

### `generateVideo(options: VideoGenerationOptions): Promise<VideoGenerationResponse>`

Generates a video based on the provided prompt and options.

#### Parameters

- `options` (Object):
  - `prompt` (string, required): A detailed text description of the desired video.
  - `duration` (number, optional, default: 5): Duration of the video in seconds (1-60).
  - `resolution` (string, optional, default: '720p'): Resolution of the video. Must be one of '480p', '720p', '1080p', or '4k'.
  - `fps` (number, optional, default: 30): Frames per second (24-60).
  - `style` (string, optional): Visual style (e.g., 'cinematic', 'animated', 'realistic').
  - `aspectRatio` (string, optional): Aspect ratio (e.g., '16:9', '9:16', '1:1').
  - `seed` (number, optional): Random seed for reproducible results.
  - `negativePrompt` (string, optional): What to avoid in the video.

#### Returns

- `Promise<VideoGenerationResponse>`: An object containing:
  - `videoId` (string): Unique identifier for the generated video.
  - `status` (string): Generation status ('processing', 'completed', 'failed').
  - `videoUrl` (string, optional): URL to download the generated video (if completed).
  - `thumbnailUrl` (string): URL of the video thumbnail.
  - `duration` (number): Duration of the video in seconds.
  - `createdAt` (string): Timestamp of when the generation was initiated.

## Examples

### Basic Video Generation

```typescript
const response = await ai.generateVideo({
  prompt: 'A futuristic city with flying cars at night, cyberpunk style',
  duration: 15,
  resolution: '1080p',
  style: 'cyberpunk',
});

console.log('Video URL:', response.videoUrl);
```

### Video Generation with Negative Prompt

```typescript
const response = await ai.generateVideo({
  prompt: 'A peaceful forest with sunlight streaming through the trees',
  negativePrompt: 'animals, people, buildings',
  duration: 8,
  resolution: '720p',
  style: 'cinematic',
});
```

## Video Editing

Edit an existing video:

```typescript
const response = await ai.editVideo({
  video: 'path/to/input.mp4',
  prompt: 'Add a sunset sky in the background',
  mask: 'path/to/mask.png', // Optional
  outputResolution: '1080p',
});

console.log('Edited video URL:', response.videoUrl);
```

## Video Enhancement

Enhance video quality:

```typescript
const response = await ai.enhanceVideo({
  video: 'path/to/input.mp4',
  enhancement: '4k_upscale', // Options: 'denoise', 'stabilize', 'color_correct', '4k_upscale'
  outputResolution: '4k',
});

console.log('Enhanced video URL:', response.videoUrl);
```

## Checking Video Status

For longer videos, you may need to check the status:

```typescript
const status = await ai.getVideoStatus({
  videoId: 'video_123456',
});

console.log('Video status:', status.status);
if (status.status === 'completed') {
  console.log('Download URL:', status.videoUrl);
}
```

## Best Practices

1. **Be Specific**: Detailed prompts yield better results.
2. **Consider Duration**: Longer videos take more time and resources.
3. **Use Negative Prompts**: Help guide the AI away from unwanted content.
4. **Check Status**: For videos longer than 10 seconds, use the status endpoint.
5. **Respect Copyright**: Only use content you have rights to modify.

## Error Handling

```typescript
try {
  const response = await ai.generateVideo({
    prompt: 'A beautiful mountain landscape',
    duration: 10,
    resolution: '1080p',
  });
  
  if (response.status === 'completed') {
    console.log('Video URL:', response.videoUrl);
  } else {
    console.log('Video is processing. Status:', response.status);
  }
} catch (error) {
  console.error('Error generating video:', error.message);
  if (error.response) {
    console.error('Status:', error.response.status);
    console.error('Data:', error.response.data);
  }
}
```

## Rate Limits

- Free tier: 5 minutes of video/day
- Pro tier: 60 minutes of video/day
- Enterprise: Custom limits available

## Model Information

- **Default Model**: `wrikka-video-beta-002`
- **Max Duration**: 60 seconds per video
- **Processing Time**: ~1-2 minutes per 10 seconds of video

## Next Steps

- [Audio Generation](/framework/ai/generation/audio-generation)
- [Text Generation](/framework/ai/generation/text-generation)
- [Image Generation](/framework/ai/generation/image-generation)
