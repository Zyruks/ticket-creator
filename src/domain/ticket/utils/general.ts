import { generateId, getTimestamp } from '@common';
import type { GeneratedTicket } from '../types';

/**
 * Generate a new ticket and add it to history
 */
export function createTicket(request: string, content: string): GeneratedTicket {
	const now = getTimestamp();
	return {
		id: generateId('ticket'),
		request,
		content,
		createdAt: now,
		updatedAt: now,
	};
}
