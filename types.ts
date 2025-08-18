export interface URLResult {
  id: number;
  originalUrl: string;
  currentSlug: string;
  proposedSlug: string;
}

export enum ExportType {
  PLUGIN = 'plugin',
  WP_CLI = 'wp-cli',
  SQL = 'sql',
}

export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error';
}

export type AIProvider = 'gemini' | 'openai' | 'claude' | 'openrouter';

export type KeyValidationStatus = 'idle' | 'validating' | 'valid' | 'invalid';

export interface AIConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
}
