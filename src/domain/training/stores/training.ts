import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TrainingExample } from '../types';

interface TrainingState {
	examples: TrainingExample[];

	// Actions
	addExample: (input: string, output: string) => void;
	clearExamples: () => void;
	deleteExample: (id: string) => void;
	importExamples: (examples: TrainingExample[]) => void;
	updateExample: (id: string, updates: Partial<Pick<TrainingExample, 'input' | 'output'>>) => void;
}

/**
 * Generate a unique training example ID
 */
function generateId(): string {
	return `example-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const useTrainingStore = create<TrainingState>()(
	persist(
		(set) => ({
			examples: [],

			addExample: (input, output) =>
				set((state) => ({
					examples: [
						...state.examples,
						{
							id: generateId(),
							input,
							output,
							createdAt: new Date().toISOString(),
							updatedAt: new Date().toISOString(),
						},
					],
				})),

			clearExamples: () => set({ examples: [] }),

			deleteExample: (id) =>
				set((state) => ({
					examples: state.examples.filter((example) => example.id !== id),
				})),

			importExamples: (examples) =>
				set((state) => ({
					examples: [
						...state.examples,
						...examples.map((example) => ({
							...example,
							id: example.id || generateId(),
							createdAt: example.createdAt || new Date().toISOString(),
							updatedAt: new Date().toISOString(),
						})),
					],
				})),

			updateExample: (id, updates) =>
				set((state) => ({
					examples: state.examples.map((example) =>
						example.id === id
							? {
									...example,
									...updates,
									updatedAt: new Date().toISOString(),
								}
							: example,
					),
				})),
		}),
		{
			name: 'ticket-creator-training',
		},
	),
);
