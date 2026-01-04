import { cn } from '@common';
import { BookOpen, FolderTree, Settings, Ticket } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
	{ to: '/', icon: Ticket, label: 'Create Ticket' },
	{ to: '/training', icon: BookOpen, label: 'Training Examples' },
	{ to: '/context', icon: FolderTree, label: 'Repository Context' },
	{ to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
	const classes = {
		container: cn('w-64 border-r bg-card h-screen sticky top-0 hidden md:block'),
		navItem: (isActive: boolean) =>
			cn(
				'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
				isActive
					? 'bg-primary text-primary-foreground'
					: 'text-muted-foreground hover:bg-muted hover:text-foreground'
			),
	};

	const renderNavItems = () =>
		navItems.map((item) => (
			<li key={item.to}>
				<NavLink to={item.to} className={({ isActive }) => classes.navItem(isActive)}>
					<item.icon className="h-4 w-4" />
					{item.label}
				</NavLink>
			</li>
		));

	const renderFooter = () => (
		<div className="absolute bottom-4 left-3 right-3">
			<div className="p-3 bg-muted rounded-lg text-xs text-muted-foreground">
				<p className="font-medium mb-1">Quick Tips</p>
				<ul className="space-y-1">
					<li>• Add training examples for better results</li>
					<li>• Import repo context for file references</li>
					<li>• Use ⌘+Enter to generate quickly</li>
				</ul>
			</div>
		</div>
	);

	return (
		<aside className={classes.container}>
			<div className="p-6">
				<h1 className="text-xl font-bold flex items-center gap-2">
					<Ticket className="h-6 w-6 text-primary" />
					Ticket Creator
				</h1>
				<p className="text-xs text-muted-foreground mt-1">AI-Powered ClickUp Tickets</p>
			</div>

			<nav className="px-3">
				<ul className="space-y-1">{renderNavItems()}</ul>
			</nav>

			{renderFooter()}
		</aside>
	);
}
