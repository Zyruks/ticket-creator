/**
 * System prompts and templates for OpenAI ticket generation
 */

import type { TicketTemplate } from '../ticket/ticket.types';
import type { TrainingExample } from '../training/training.types';

/**
 * Build the system prompt for ticket generation
 */
export function buildSystemPrompt(
	template: TicketTemplate,
	repoContext: string | null,
	examples: TrainingExample[]
): string {
	let prompt = `You are an expert technical writer who creates clear, actionable tickets for software development teams. You specialize in frontend development tickets.

## Your Task
Generate a well-structured ticket based on the user's request. Follow the exact template format provided.

## Ticket Template
Use this exact structure for all tickets:

${template.content}

## Guidelines
1. **Objective**: Write 1-2 clear sentences describing what needs to be done and why
2. **Acceptance Criteria**: List specific, testable requirements using "Must" statements
3. **Resources**: Include placeholder links if not specified
4. **Additional Notes**: Add relevant technical details, edge cases, or environment info

## Important Rules
- Be specific and actionable
- Use technical terms appropriately for frontend development
- Keep language professional but concise
- If information is missing, make reasonable assumptions based on context
`;

	// Add repository context if available
	if (repoContext) {
		prompt += `
## Repository Context
The following is the structure of the codebase you'll be working with:

\`\`\`
${repoContext}
\`\`\`

Use this context to reference specific files, components, or directories when relevant to the ticket.
`;
	}

	// Add few-shot examples if available
	if (examples.length > 0) {
		prompt += `
## Examples
Here are examples of well-written tickets to learn from:

`;
		for (let i = 0; i < examples.length; i++) {
			const example = examples[i];
			prompt += `### Example ${i + 1}
**Request:** ${example.input}

**Generated Ticket:**
${example.output}

---

`;
		}
	}

	return prompt;
}

/**
 * Build the user prompt for a specific ticket request
 */
export function buildUserPrompt(request: string): string {
	return `Please create a ticket for the following request:

${request}

Generate a complete, well-structured ticket following the template provided.`;
}
