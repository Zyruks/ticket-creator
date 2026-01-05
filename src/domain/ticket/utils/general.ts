import type { GeneratedTicket } from '../types';

/**
 * Generate a unique ticket ID
 */
function generateId(): string {
	return `ticket-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

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
