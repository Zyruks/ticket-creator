import type { TemplateCategory, TemplateCategoryInfo } from '../types';

export const TEMPLATE_CATEGORIES: Record<TemplateCategory, TemplateCategoryInfo> = {
	feat: {
		description: 'New feature or enhancement',
		icon: '✨',
		label: 'Feature',
	},
	fix: {
		description: 'Bug fix or issue resolution',
		icon: '🐛',
		label: 'Bug Fix',
	},
	refactor: {
		description: 'Code restructuring without behavior change',
		icon: '♻️',
		label: 'Refactor',
	},
	docs: {
		description: 'Documentation updates',
		icon: '📝',
		label: 'Documentation',
	},
	chore: {
		description: 'Maintenance tasks, dependencies, configs',
		icon: '🔧',
		label: 'Chore',
	},
	style: {
		description: 'UI/UX styling changes',
		icon: '🎨',
		label: 'Style',
	},
	test: {
		description: 'Adding or updating tests',
		icon: '🧪',
		label: 'Test',
	},
	perf: {
		description: 'Performance improvements',
		icon: '⚡',
		label: 'Performance',
	},
};
