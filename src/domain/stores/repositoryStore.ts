/**
 * Repository Store - Manages repository context for ticket generation
 */

import type { RepositoryContext } from '@domain/repository';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RepositoryState {
	context: RepositoryContext | null;
	isLoaded: boolean;

	// Actions
	setContext: (context: RepositoryContext) => void;
	clearContext: () => void;
	importFromJson: (jsonString: string) => boolean;
}

export const useRepositoryStore = create<RepositoryState>()(
	persist(
		(set) => ({
			context: null,
			isLoaded: false,

			setContext: (context) =>
				set({
					context,
					isLoaded: true,
				}),

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
		}),
		{
			name: 'ticket-creator-repository',
		}
	)
);
