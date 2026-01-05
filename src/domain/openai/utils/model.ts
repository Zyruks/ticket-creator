import type { OpenAIModel } from '../types';

/**
 * Models that use reasoning and don't support temperature customization
 * These models only support the default temperature value of 1
 * Includes both o-series reasoning models and GPT-5+ reasoning models
 * @see https://platform.openai.com/docs/guides/reasoning
 */
const REASONING_MODELS: OpenAIModel[] = [
	// o-series reasoning models
	'o1',
	'o3',
	'o3-mini',
	// GPT-5 family - all are reasoning models
	'gpt-5',
	'gpt-5-mini',
	'gpt-5-nano',
	'gpt-5.2',
	'gpt-5.2-codex',
];

/**
 * Check if a model supports the temperature parameter
 * @param model - The OpenAI model to check
 * @returns true if the model supports custom temperature values
 */
export function supportsTemperature(model: OpenAIModel): boolean {
	return !REASONING_MODELS.includes(model);
}

/**
 * Get the default temperature for a model
 * @param model - The OpenAI model
 * @returns The default temperature value
 */
export function getDefaultTemperature(model: OpenAIModel): number {
	return supportsTemperature(model) ? 0.7 : 1.0;
}
