/**
 * Settings Store - Manages OpenAI configuration
 */

import { DEFAULT_OPENAI_CONFIG, type OpenAIConfig, type OpenAIModel } from '@domain/openai';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
	config: OpenAIConfig;
	isConfigured: boolean;

	// Actions
	setApiKey: (apiKey: string) => void;
	setModel: (model: OpenAIModel) => void;
	setMaxTokens: (maxTokens: number) => void;
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
				set((state) => ({
					config: { ...state.config, model },
				})),

			setMaxTokens: (maxTokens) =>
				set((state) => ({
					config: { ...state.config, maxTokens },
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
		}
	)
);
