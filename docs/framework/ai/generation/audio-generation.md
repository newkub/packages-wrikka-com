# Audio Generation

The Audio Generation API enables you to generate, modify, and enhance audio content using AI. This includes text-to-speech, music generation, sound effects, and audio processing capabilities.

## Basic Usage

```typescript
import { createAIClient } from '@wrikka/ai-sdk';

const ai = createAIClient({
  apiKey: 'your-api-key',
});

// Text-to-speech example
const ttsResponse = await ai.generateSpeech({
  text: 'Hello, welcome to the future of AI-generated audio.',
  voice: 'alloy',
  responseFormat: 'mp3',
});

console.log('Audio URL:', ttsResponse.audioUrl);
```

## API Reference

### Text-to-Speech

#### `generateSpeech(options: SpeechGenerationOptions): Promise<SpeechGenerationResponse>`

Converts text into natural-sounding speech.

**Parameters:**
- `text` (string, required): The text to convert to speech.
- `voice` (string, optional, default: 'alloy'): Voice to use. Options: 'alloy', 'echo', 'fable', 'onyx', 'nova', 'shimmer'.
- `model` (string, optional, default: 'tts-1'): Model to use. Options: 'tts-1' (standard), 'tts-1-hd' (higher quality).
- `speed` (number, optional, default: 1.0): Speed of the generated audio (0.25 to 4.0).
- `responseFormat` (string, optional, default: 'mp3'): Format of the audio. Options: 'mp3', 'opus', 'aac', 'flac', 'wav', 'pcm'.

**Returns:**
- `audioUrl` (string): URL to download the generated audio.
- `duration` (number): Duration of the audio in seconds.
- `text` (string): The input text (normalized).
- `model` (string): Model used for generation.

### Music Generation

#### `generateMusic(options: MusicGenerationOptions): Promise<MusicGenerationResponse>`

Generates original music based on a description.

**Parameters:**
- `prompt` (string, required): Description of the music to generate.
- `duration` (number, optional, default: 30): Duration in seconds (10-600).
- `style` (string, optional): Music style/genre (e.g., 'classical', 'electronic', 'jazz', 'rock').
- `mood` (string, optional): Desired mood (e.g., 'happy', 'sad', 'energetic', 'calm').
- `bpm` (number, optional): Beats per minute.
- `instruments` (string[], optional): Array of instruments to include.

**Returns:**
- `audioUrl` (string): URL to download the generated music.
- `duration` (number): Duration of the music in seconds.
- `bpm` (number): Actual BPM of the generated music.
- `key` (string): Musical key of the composition.

### Sound Effects

#### `generateSoundEffect(options: SoundEffectOptions): Promise<SoundEffectResponse>`

Generates sound effects based on a description.

**Parameters:**
- `description` (string, required): Description of the sound effect.
- `duration` (number, optional, default: 5): Duration in seconds (1-30).
- `intensity` (number, optional, default: 0.5): Intensity of the effect (0.0 to 1.0).

**Returns:**
- `audioUrl` (string): URL to download the sound effect.
- `duration` (number): Duration of the effect in seconds.
- `category` (string): Category of the sound effect.

## Examples

### Text-to-Speech with Custom Voice

```typescript
const response = await ai.generateSpeech({
  text: 'This is a demonstration of the text-to-speech capabilities.',
  voice: 'nova',
  speed: 1.1,
  model: 'tts-1-hd',
});

console.log('Listen to your audio:', response.audioUrl);
```

### Generate Background Music

```typescript
const music = await ai.generateMusic({
  prompt: 'Upbeat electronic music for a tech product demo',
  duration: 60,
  style: 'electronic',
  mood: 'energetic',
  bpm: 128,
  instruments: ['synth', 'drums', 'bass']
});

console.log('Generated music:', music.audioUrl);
```

### Create Custom Sound Effects

```typescript
const sfx = await ai.generateSoundEffect({
  description: 'Laser gun firing in space with reverb',
  duration: 3,
  intensity: 0.8
});

console.log('Sound effect ready:', sfx.audioUrl);
```

## Audio Processing

### Transcribe Audio

```typescript
const transcription = await ai.transcribeAudio({
  file: 'path/to/audio.mp3',
  language: 'en',
  responseFormat: 'json',
  temperature: 0.2
});

console.log('Transcription:', transcription.text);
```

### Enhance Audio Quality

```typescript
const enhanced = await ai.enhanceAudio({
  file: 'path/to/input.mp3',
  enhancement: 'noise_reduction', // Options: 'noise_reduction', 'de_reverb', 'voice_enhance', 'normalize'
  outputFormat: 'mp3'
});

console.log('Enhanced audio:', enhanced.audioUrl);
```

## Best Practices

1. **Be Specific**: Detailed prompts yield better results, especially for music generation.
2. **Use Appropriate Formats**: Choose the right format for your use case (MP3 for web, WAV for editing).
3. **Consider Duration**: Longer audio takes more time to generate.
4. **Respect Copyright**: Only use generated audio in ways that comply with the terms of service.
5. **Test Different Voices**: Try different voices to find the best match for your content.

## Error Handling

```typescript
try {
  const response = await ai.generateSpeech({
    text: 'This is a test of the error handling system.',
    voice: 'alloy'
  });
  console.log('Audio URL:', response.audioUrl);
} catch (error) {
  console.error('Error generating audio:', error.message);
  if (error.response) {
    console.error('Status:', error.response.status);
    console.error('Data:', error.response.data);
  }
}
```

## Rate Limits

- Free tier: 1000 characters/day for TTS, 5 minutes/day for music
- Pro tier: 100,000 characters/day for TTS, 120 minutes/day for music
- Enterprise: Custom limits available

## Model Information

- **TTS Model**: `tts-1` (standard), `tts-1-hd` (higher quality)
- **Music Model**: `wrikka-music-001`
- **Max Duration**: 10 minutes per audio file
- **Supported Formats**: MP3, WAV, AAC, FLAC, OPUS, PCM

## Next Steps

- [Text Generation](/framework/ai/generation/text-generation)
- [Image Generation](/framework/ai/generation/image-generation)
- [Video Generation](/framework/ai/generation/video-generation)
