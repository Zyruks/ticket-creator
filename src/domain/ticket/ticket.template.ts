/**
 * Default ClickUp Ticket Template
 */

import type { TicketTemplate } from './ticket.types';

export const DEFAULT_TICKET_TEMPLATE: TicketTemplate = {
	id: 'default-clickup',
	name: 'ClickUp Standard',
	isDefault: true,
	content: `## Objective / Problem Statement
Describe the issue or goal in one or two sentences.

## Acceptance Criteria
- Must do this
- Must do that
- Must also do this

## Resources
- **Designs (Figma):** [link]
- **Documentation:** [link]
- **Relevant Chat/Email:** [link]

## 📝 Additional Notes
Environment details (if bug), edge cases, or constraints.`,
};
