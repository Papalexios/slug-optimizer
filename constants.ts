import { AIProvider } from './types.ts';

export const URL_BATCH_SIZE = 50;
export const INITIAL_DISPLAY_COUNT = 50;

export const AI_PROVIDERS: { id: AIProvider; name: string }[] = [
  { id: 'gemini', name: 'Google Gemini' },
  { id: 'openai', name: 'OpenAI' },
  { id: 'claude', name: 'Anthropic Claude' },
  { id: 'openrouter', name: 'OpenRouter' },
];

export const AI_MODELS: Record<AIProvider, { value: string; name: string }[]> = {
  gemini: [
    { value: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash' },
  ],
  openai: [
    { value: 'gpt-4o', name: 'GPT-4o' },
    { value: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
    { value: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
  ],
  claude: [
    { value: 'claude-3-opus-20240229', name: 'Claude 3 Opus' },
    { value: 'claude-3-sonnet-20240229', name: 'Claude 3 Sonnet' },
    { value: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku' },
  ],
  openrouter: [], // User-defined
};