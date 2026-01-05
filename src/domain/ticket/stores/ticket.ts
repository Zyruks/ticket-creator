import { getTimestamp } from '@common';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { GeneratedTicket } from '../types';

interface TicketState {
	currentTicket: GeneratedTicket | null;
	error: string | null;
	history: GeneratedTicket[];
	isGenerating: boolean;
	streamedContent: string;

	// Actions
	addToHistory: (ticket: GeneratedTicket) => void;
	appendStreamedContent: (content: string) => void;
	clearCurrentTicket: () => void;
	clearHistory: () => void;
	deleteFromHistory: (id: string) => void;
	setCurrentTicket: (ticket: GeneratedTicket) => void;
	setError: (error: string | null) => void;
	setIsGenerating: (isGenerating: boolean) => void;
	setStreamedContent: (content: string) => void;
	updateCurrentTicketContent: (content: string) => void;
}

export const useTicketStore = create<TicketState>()(
	persist(
		(set) => ({
			currentTicket: null,
			error: null,
			history: [],
			isGenerating: false,
			streamedContent: '',

			addToHistory: (ticket) =>
				set((state) => ({
					history: [ticket, ...state.history].slice(0, 50), // Keep last 50
				})),

			appendStreamedContent: (content) =>
				set((state) => ({
					streamedContent: state.streamedContent + content,
				})),

			clearCurrentTicket: () =>
				set({
					currentTicket: null,
					error: null,
					streamedContent: '',
				}),

			clearHistory: () => set({ history: [] }),

			deleteFromHistory: (id) =>
				set((state) => ({
					history: state.history.filter((ticket) => ticket.id !== id),
				})),

			setCurrentTicket: (ticket) =>
				set({
					currentTicket: ticket,
					error: null,
					streamedContent: '',
				}),

			setError: (error) => set({ error }),

			setIsGenerating: (isGenerating) => set({ isGenerating }),

			setStreamedContent: (content) => set({ streamedContent: content }),

			updateCurrentTicketContent: (content) =>
				set((state) => ({
					currentTicket: state.currentTicket
						? {
								...state.currentTicket,
								content,
								updatedAt: getTimestamp(),
							}
						: null,
				})),
		}),
		{
			name: 'ticket-creator-tickets',
			partialize: (state) => ({
				history: state.history,
			}),
		},
	),
);
