import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { RepositoryContext } from '../types';

interface RepositoryState {
	context: RepositoryContext | null;
	isLoaded: boolean;

	// Actions
	clearContext: () => void;
	importFromJson: (jsonString: string) => boolean;
	setContext: (context: RepositoryContext) => void;
}

export const useRepositoryStore = create<RepositoryState>()(
	persist(
		(set) => ({
			context: null,
			isLoaded: false,

			clearContext: () =>
				set({
					context: null,
					isLoaded: false,
				}),

			importFromJson: (jsonString) => {
				try {
					const parsed = JSON.parse(jsonString) as RepositoryContext;

					// Basic validation
					if (!parsed.meta || !parsed.tree || !parsed.compactTree) {
						console.error('Invalid repository context JSON');
						return false;
					}

					set({
						context: parsed,
						isLoaded: true,
					});

					return true;
				} catch (error) {
					console.error('Failed to parse repository context JSON:', error);
					return false;
				}
			},

			setContext: (context) =>
				set({
					context,
					isLoaded: true,
				}),
		}),
		{
			name: 'ticket-creator-repository',
		},
	),
);
