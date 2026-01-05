import type { TicketTemplate } from '../types';
import choreTemplate from './templates/chore.md?raw';
import docsTemplate from './templates/docs.md?raw';
import featTemplate from './templates/feat.md?raw';
import fixTemplate from './templates/fix.md?raw';
import perfTemplate from './templates/perf.md?raw';
import refactorTemplate from './templates/refactor.md?raw';
import styleTemplate from './templates/style.md?raw';
import testTemplate from './templates/test.md?raw';

/**
 * Feature Template - For new features and enhancements
 */
export const FEATURE_TEMPLATE: TicketTemplate = {
	category: 'feat',
	content: featTemplate,
	description: 'New feature or enhancement request',
	example: {
		request: 'Add a dark mode toggle to the settings page',
		output: `## Objective / Problem Statement
Implement a dark mode toggle in the settings page that allows users to switch between light and dark themes, improving accessibility and user preference support.

## Acceptance Criteria
- Must add a toggle switch in the Settings page under "Appearance" section
- Must persist theme preference to localStorage
- Must apply theme changes immediately without page reload
- Must respect system preference as default (prefers-color-scheme)
- Must include smooth transition animation between themes
- Must ensure all components support both themes

## Resources
- **Designs (Figma):** [link to dark mode designs]
- **Documentation:** [Tailwind Dark Mode docs]
- **API Specs:** N/A (client-side only)

## 📝 Additional Notes
- Use Tailwind's \`dark:\` variant for styling
- Consider using CSS custom properties for theme colors
- Test with components: Button, Card, Input, Select, Dialog`,
	},
	id: 'feature',
	isDefault: true,
	name: 'Feature',
};

/**
 * Bug Fix Template - For bug reports and fixes
 */
export const BUG_TEMPLATE: TicketTemplate = {
	category: 'fix',
	content: fixTemplate,
	description: 'Bug report and fix request',
	example: {
		request: 'The submit button is not disabled while the form is submitting, causing duplicate submissions',
		output: `## Bug Description
When users click the submit button on the ticket generation form, the button remains enabled during the API call, allowing multiple clicks that result in duplicate ticket generations and API calls.

## Steps to Reproduce
1. Navigate to the Home page
2. Enter a ticket request in the textarea
3. Click the "Generate" button
4. Quickly click the button again before the response arrives
5. Observe multiple tickets being generated

## Expected Behavior
The submit button should be disabled immediately upon click and remain disabled until the API response is received or an error occurs.

## Acceptance Criteria
- Must disable the Generate button when isGenerating is true
- Must show loading spinner or "Generating..." text while processing
- Must re-enable button after success or error
- Must not allow form submission via Enter key while generating
- Must add test for button disabled state

## Environment
- Browser: Chrome 120
- OS: macOS Sonoma
- Version: 1.0.0

## 📝 Additional Notes
- Check useTicketStore for isGenerating state
- Related to InputSection component
- Consider debouncing as additional protection`,
	},
	id: 'bug',
	isDefault: false,
	name: 'Bug Fix',
};

/**
 * Refactor Template - For code improvements without behavior change
 */
export const REFACTOR_TEMPLATE: TicketTemplate = {
	category: 'refactor',
	content: refactorTemplate,
	description: 'Code restructuring without behavior change',
	example: {
		request: 'Refactor the openai service to separate API calls from utility functions',
		output: `## Objective
Separate the OpenAI service file into distinct modules for API interactions and utility functions, improving code organization, testability, and maintainability.

## Current State
The \`openai.service.ts\` file contains both API call functions (createClient, sendCompletion) and utility functions (buildPrompt, estimateTokens, imageUtils). This makes the file large and mixes concerns.

## Proposed Changes
- Create \`services/api.ts\` for OpenAI API interactions
- Create \`utils/prompts.ts\` for prompt building utilities
- Create \`utils/tokens.ts\` for token estimation
- Create \`utils/images.ts\` for image attachment handling
- Update barrel exports in index.ts

## Acceptance Criteria
- Must maintain all existing exports and function signatures
- Must improve module separation (single responsibility)
- Must update all import statements across codebase
- Must ensure all existing tests pass
- Must not change any function behavior

## 📝 Additional Notes
- Follow existing domain folder structure pattern
- Use barrel exports (index.ts) for clean imports
- Consider adding JSDoc comments during refactor`,
	},
	id: 'refactor',
	isDefault: false,
	name: 'Refactor',
};

/**
 * Documentation Template - For docs updates
 */
export const DOCS_TEMPLATE: TicketTemplate = {
	category: 'docs',
	content: docsTemplate,
	description: 'Documentation updates and additions',
	example: {
		request: 'Document the template store API and usage examples',
		output: `## Objective
Create comprehensive documentation for the useTemplateStore hook, including API reference, usage examples, and integration patterns.

## Scope
- README.md: Add template store section
- JSDoc comments in template.ts store file
- Usage examples in code comments

## Acceptance Criteria
- Must document all store state properties
- Must document all store actions with parameters
- Must include TypeScript types in examples
- Must provide usage example for template selection
- Must explain persistence behavior (localStorage)

## 📝 Additional Notes
- Target audience: developers extending the application
- Follow existing documentation patterns in codebase
- Include both simple and advanced usage examples`,
	},
	id: 'docs',
	isDefault: false,
	name: 'Documentation',
};

/**
 * Chore Template - For maintenance tasks
 */
export const CHORE_TEMPLATE: TicketTemplate = {
	category: 'chore',
	content: choreTemplate,
	description: 'Maintenance tasks, dependencies, configs',
	example: {
		request: 'Update all npm dependencies to latest versions',
		output: `## Objective
Update all project dependencies to their latest compatible versions to ensure security patches, bug fixes, and access to new features.

## Tasks
- [ ] Run \`pnpm outdated\` to identify outdated packages
- [ ] Update patch versions: \`pnpm update\`
- [ ] Review and update minor versions individually
- [ ] Test application after each major update
- [ ] Update lock file and commit

## Acceptance Criteria
- Must update all dependencies with security vulnerabilities
- Must ensure all tests pass after updates
- Must verify application builds successfully
- Must test critical user flows manually
- Must document any breaking changes in PR

## 📝 Additional Notes
- Pay special attention to: React, Zustand, OpenAI SDK
- Check changelogs for breaking changes before major updates
- Consider pinning versions that cause issues`,
	},
	id: 'chore',
	isDefault: false,
	name: 'Chore',
};

/**
 * Style Template - For UI/UX changes
 */
export const STYLE_TEMPLATE: TicketTemplate = {
	category: 'style',
	content: styleTemplate,
	description: 'UI/UX styling and visual changes',
	example: {
		request: 'Update the card components to have rounded corners and subtle shadows',
		output: `## Objective
Enhance the visual appearance of Card components by adding rounded corners and subtle drop shadows to create depth and improve the overall UI aesthetic.

## Design Reference
- Border radius: 12px (rounded-xl)
- Shadow: subtle elevation shadow (shadow-sm)
- Hover state: slightly elevated shadow (shadow-md)

## Acceptance Criteria
- Must apply rounded-xl to all Card components
- Must add shadow-sm for default state
- Must add shadow-md on hover with smooth transition
- Must ensure shadows work in both light and dark modes
- Must maintain consistent spacing and padding

## 📝 Additional Notes
- Update the base Card component in ui/card.tsx
- Use Tailwind classes for consistency
- Transition duration: 150ms ease-in-out
- Test in: Chrome, Firefox, Safari`,
	},
	id: 'style',
	isDefault: false,
	name: 'Style',
};

/**
 * Test Template - For test additions
 */
export const TEST_TEMPLATE: TicketTemplate = {
	category: 'test',
	content: testTemplate,
	description: 'Adding or updating tests',
	example: {
		request: 'Add unit tests for the ticket store',
		output: `## Objective
Add comprehensive unit tests for the useTicketStore to ensure reliable state management for ticket generation, history, and error handling.

## Test Scope
- Unit tests for all store actions
- State transition tests
- Persistence tests (localStorage)
- Edge case handling

## Acceptance Criteria
- Must test setCurrentTicket action
- Must test addToHistory with max limit (50)
- Must test deleteFromHistory
- Must test clearHistory
- Must test error state management
- Must test streaming content accumulation
- Must achieve 90%+ coverage for store

## 📝 Additional Notes
- Use Vitest for unit testing
- Mock localStorage for persistence tests
- Consider using @testing-library/react for hook testing
- Create test fixtures for sample tickets`,
	},
	id: 'test',
	isDefault: false,
	name: 'Test',
};

/**
 * Performance Template - For optimization tasks
 */
export const PERF_TEMPLATE: TicketTemplate = {
	category: 'perf',
	content: perfTemplate,
	description: 'Performance improvements and optimization',
	example: {
		request: 'Optimize the repository tree rendering for large codebases',
		output: `## Objective
Improve the rendering performance of the repository tree component when displaying large codebases (1000+ files) to prevent UI lag and improve user experience.

## Current Performance
- Initial render: 800ms for 1000 nodes
- Scroll performance: Janky, drops below 30fps
- Memory usage: 150MB for large trees

## Target Performance
- Initial render: <200ms for 1000 nodes
- Scroll performance: Smooth 60fps
- Memory usage: <50MB for large trees

## Acceptance Criteria
- Must implement virtualized list rendering
- Must lazy-load collapsed folder contents
- Must memoize tree node components
- Must reduce re-renders on expand/collapse
- Must include performance benchmarks in PR

## 📝 Additional Notes
- Consider using react-window or @tanstack/virtual
- Profile with React DevTools Profiler
- Test with repo-context.json from large monorepos
- Measure with Chrome Performance tab`,
	},
	id: 'perf',
	isDefault: false,
	name: 'Performance',
};

export const TICKET_TEMPLATES: TicketTemplate[] = [
	FEATURE_TEMPLATE,
	BUG_TEMPLATE,
	REFACTOR_TEMPLATE,
	DOCS_TEMPLATE,
	CHORE_TEMPLATE,
	STYLE_TEMPLATE,
	TEST_TEMPLATE,
	PERF_TEMPLATE,
];

export const DEFAULT_TICKET_TEMPLATE = FEATURE_TEMPLATE;
