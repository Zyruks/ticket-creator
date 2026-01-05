import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_TICKET_TEMPLATE, TICKET_TEMPLATES } from '../constants';
import type { TicketTemplate } from '../types';

interface TemplateState {
	/**
	 * Currently selected template
	 */
	selectedTemplate: TicketTemplate;

	/**
	 * All available templates
	 */
	templates: TicketTemplate[];

	/**
	 * Get a template by its ID
	 */
	getTemplateById: (id: string) => TicketTemplate | undefined;

	/**
	 * Reset to default template
	 */
	resetTemplate: () => void;

	/**
	 * Select a template by ID
	 */
	selectTemplate: (templateId: string) => void;
}

export const useTemplateStore = create<TemplateState>()(
	persist(
		(set, get) => ({
			selectedTemplate: DEFAULT_TICKET_TEMPLATE,
			templates: TICKET_TEMPLATES,

			getTemplateById: (id) => {
				return get().templates.find((template) => template.id === id);
			},

			resetTemplate: () =>
				set({
					selectedTemplate: DEFAULT_TICKET_TEMPLATE,
				}),

			selectTemplate: (templateId) => {
				const template = get().templates.find((t) => t.id === templateId);
				if (template) {
					set({ selectedTemplate: template });
				}
			},
		}),
		{
			name: 'ticket-creator-template',
			partialize: (state) => ({
				selectedTemplate: state.selectedTemplate,
			}),
		},
	),
);
