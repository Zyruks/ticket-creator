/**
 * Ticket Store - Manages generated tickets and current session
 */

import type { GeneratedTicket } from '@domain/ticket';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TicketState {
	currentTicket: GeneratedTicket | null;
	history: GeneratedTicket[];
	isGenerating: boolean;
	streamedContent: string;
	error: string | null;

	// Actions
	setCurrentTicket: (ticket: GeneratedTicket) => void;
	updateCurrentTicketContent: (content: string) => void;
	clearCurrentTicket: () => void;
	addToHistory: (ticket: GeneratedTicket) => void;
	deleteFromHistory: (id: string) => void;
	clearHistory: () => void;
	setIsGenerating: (isGenerating: boolean) => void;
	setStreamedContent: (content: string) => void;
	appendStreamedContent: (content: string) => void;
	setError: (error: string | null) => void;
}

function generateId(): string {
	return `ticket-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

export const useTicketStore = create<TicketState>()(
	persist(
		(set) => ({
			currentTicket: null,
			history: [],
			isGenerating: false,
			streamedContent: '',
			error: null,

			setCurrentTicket: (ticket) =>
				set({
					currentTicket: ticket,
					streamedContent: '',
					error: null,
				}),

			updateCurrentTicketContent: (content) =>
				set((state) => ({
					currentTicket: state.currentTicket
						? {
								...state.currentTicket,
								content,
								updatedAt: new Date().toISOString(),
							}
						: null,
				})),

			clearCurrentTicket: () =>
				set({
					currentTicket: null,
					streamedContent: '',
					error: null,
				}),

			addToHistory: (ticket) =>
				set((state) => ({
					history: [ticket, ...state.history].slice(0, 50), // Keep last 50
				})),

			deleteFromHistory: (id) =>
				set((state) => ({
					history: state.history.filter((t) => t.id !== id),
				})),

			clearHistory: () => set({ history: [] }),

			setIsGenerating: (isGenerating) => set({ isGenerating }),

			setStreamedContent: (content) => set({ streamedContent: content }),

			appendStreamedContent: (content) =>
				set((state) => ({
					streamedContent: state.streamedContent + content,
				})),

			setError: (error) => set({ error }),
		}),
		{
			name: 'ticket-creator-tickets',
			partialize: (state) => ({
				history: state.history,
			}),
		}
	)
);

/**
 * Generate a new ticket and add it to history
 */
export function createTicket(request: string, content: string): GeneratedTicket {
	const now = new Date().toISOString();
	return {
		id: generateId(),
		request,
		content,
		createdAt: now,
		updatedAt: now,
	};
}
