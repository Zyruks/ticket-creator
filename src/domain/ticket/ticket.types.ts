/**
 * Ticket Domain Types
 */

export interface TicketTemplate {
	id: string;
	name: string;
	content: string;
	isDefault: boolean;
}

export interface GeneratedTicket {
	id: string;
	request: string;
	content: string;
	createdAt: string;
	updatedAt: string;
}
