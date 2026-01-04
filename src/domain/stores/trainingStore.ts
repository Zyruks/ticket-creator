/**
 * Training Store - Manages training examples for few-shot learning
 */

import type { TrainingExample } from '@domain/training';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TrainingState {
	examples: TrainingExample[];

	// Actions
	addExample: (input: string, output: string) => void;
	updateExample: (id: string, updates: Partial<Pick<TrainingExample, 'input' | 'output'>>) => void;
	deleteExample: (id: string) => void;
	importExamples: (examples: TrainingExample[]) => void;
	clearExamples: () => void;
}

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

			updateExample: (id, updates) =>
				set((state) => ({
					examples: state.examples.map((example) =>
						example.id === id
							? {
									...example,
									...updates,
									updatedAt: new Date().toISOString(),
								}
							: example
					),
				})),

			deleteExample: (id) =>
				set((state) => ({
					examples: state.examples.filter((example) => example.id !== id),
				})),

			importExamples: (examples) =>
				set((state) => ({
					examples: [
						...state.examples,
						...examples.map((e) => ({
							...e,
							id: e.id || generateId(),
							createdAt: e.createdAt || new Date().toISOString(),
							updatedAt: new Date().toISOString(),
						})),
					],
				})),

			clearExamples: () => set({ examples: [] }),
		}),
		{
			name: 'ticket-creator-training',
		}
	)
);
