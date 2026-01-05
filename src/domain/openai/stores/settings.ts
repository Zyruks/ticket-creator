import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_OPENAI_CONFIG } from '../constants';
import type { OpenAIConfig, OpenAIModel } from '../types';
import { getDefaultTemperature, supportsTemperature } from '../utils';

interface SettingsState {
	config: OpenAIConfig;
	isConfigured: boolean;

	// Actions
	setApiKey: (apiKey: string) => void;
	setModel: (model: OpenAIModel) => void;
	setMaxCompletionTokens: (maxCompletionTokens: number) => void;
	setTemperature: (temperature: number) => void;
	resetConfig: () => void;
}

export const useSettingsStore = create<SettingsState>()(
	persist(
		(set) => ({
			config: DEFAULT_OPENAI_CONFIG,
			isConfigured: false,

			setApiKey: (apiKey) =>
				set((state) => ({
					config: { ...state.config, apiKey },
					isConfigured: apiKey.length > 0,
				})),

			setModel: (model) =>
				set((state) => {
					const newConfig = { ...state.config, model };
					// Auto-adjust temperature for reasoning models
					if (!supportsTemperature(model)) {
						newConfig.temperature = getDefaultTemperature(model);
					}
					return { config: newConfig };
				}),

			setMaxCompletionTokens: (maxCompletionTokens) =>
				set((state) => ({
					config: { ...state.config, maxCompletionTokens },
				})),

			setTemperature: (temperature) =>
				set((state) => ({
					config: { ...state.config, temperature },
				})),

			resetConfig: () =>
				set({
					config: DEFAULT_OPENAI_CONFIG,
					isConfigured: false,
				}),
		}),
		{
			name: 'ticket-creator-settings',
		},
	),
);
