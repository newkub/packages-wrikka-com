import { OpenAI } from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';

// Type definitions
interface TextGenerationParams {
  prompt: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

type ProviderConfig = 
  | { provider: 'openai' }
  | { provider: 'anthropic' }
  | { provider: 'gemini' };

type GenTextOptions = TextGenerationParams & ProviderConfig;

// Client factories
const createOpenAIClient = () => new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const createAnthropicClient = () => new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const createGeminiClient = () => new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Generator functions
const openAIGenerator = async (params: TextGenerationParams) => {
  const client = createOpenAIClient();
  const response = await client.chat.completions.create({
    model: params.model || 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: params.prompt }],
    ...(params.maxTokens !== undefined && { max_tokens: params.maxTokens }),
    ...(params.temperature !== undefined && { temperature: params.temperature }),
  });
  return response.choices[0]?.message?.content || '';
};

const anthropicGenerator = async (params: TextGenerationParams) => {
  const client = createAnthropicClient();
  const response = await client.messages.create({
    model: params.model || 'claude-3-haiku-20240307',
    messages: [{ role: 'user', content: params.prompt }],
    max_tokens: params.maxTokens ?? 1024,
    ...(params.temperature !== undefined && { temperature: params.temperature }),
  });
  return response.content
    .filter((c): c is Anthropic.TextBlock => c.type === 'text')
    .map(c => c.text)
    .join('\n') || '';
};

const geminiGenerator = async (params: TextGenerationParams) => {
  const client = createGeminiClient();
  const model = client.getGenerativeModel({ model: params.model || 'gemini-pro' });
  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: params.prompt }] }],
    generationConfig: {
      ...(params.maxTokens !== undefined && { maxOutputTokens: params.maxTokens }),
      ...(params.temperature !== undefined && { temperature: params.temperature }),
    }
  });
  return result.response.text();
};

// Main function
export const generateText = async (options: GenTextOptions): Promise<string> => {
  try {
    const { provider, ...params } = options;
    const generators = {
      openai: openAIGenerator,
      anthropic: anthropicGenerator,
      gemini: geminiGenerator
    };
    
    return await generators[provider](params);
  } catch (err) {
    throw new Error(`Text generation failed: ${err instanceof Error ? err.message : String(err)}`);
  }
};

export type { GenTextOptions };