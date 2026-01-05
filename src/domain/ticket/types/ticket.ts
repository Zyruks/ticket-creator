export type TemplateCategory = 'feat' | 'fix' | 'refactor' | 'docs' | 'chore' | 'style' | 'test' | 'perf';


export interface TemplateCategoryInfo {
	/**
	 * Brief description of when to use this category
	 */
	description: string;

	/**
	 * Emoji icon for visual identification
	 */
	icon: string;

	/**
	 * Display label for the category
	 */
	label: string;
}

export interface TicketTemplate {
	/**
	 * Category based on conventional commits
	 */
	category: TemplateCategory;

	/**
	 * The markdown template structure
	 */
	content: string;

	/**
	 * Brief description of what this template is for
	 */
	description: string;

	/**
	 * Example of a fully generated ticket using this template
	 */
	example: TicketExample;

	/**
	 * Unique identifier for the template
	 */
	id: string;

	/**
	 * Whether this is the default template
	 */
	isDefault: boolean;

	/**
	 * Display name for the template
	 */
	name: string;
}


export interface TicketExample {
	/**
	 * The generated ticket content
	 */
	output: string;

	/**
	 * Sample user request that would generate this ticket
	 */
	request: string;
}

export interface GeneratedTicket {
	/**
	 * The generated ticket markdown content
	 */
	content: string;

	/**
	 * ISO timestamp when ticket was created
	 */
	createdAt: string;

	/**
	 * Unique identifier for the ticket
	 */
	id: string;

	/**
	 * Original user request that generated this ticket
	 */
	request: string;

	/**
	 * ISO timestamp when ticket was last updated
	 */
	updatedAt: string;
}
