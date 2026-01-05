import type { OpenAIConfig } from '../types';

export const DEFAULT_OPENAI_CONFIG: OpenAIConfig = {
	apiKey: '',
	model: 'gpt-5-mini',
	maxTokens: 2000,
	temperature: 0.7,
};
