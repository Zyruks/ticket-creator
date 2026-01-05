import { cn } from '@common';
import { BookOpen, FolderTree, Github, Heart, Settings, Ticket } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const navItems = [
	{ to: '/', icon: Ticket, label: 'Create Ticket' },
	{ to: '/training', icon: BookOpen, label: 'Training Examples' },
	{ to: '/context', icon: FolderTree, label: 'Repository Context' },
	{ to: '/settings', icon: Settings, label: 'Settings' },
];

export function Sidebar() {
	const classes = {
		container: cn('sticky top-0 hidden h-screen w-64 border-r bg-card md:block'),
		navItem: (isActive: boolean) =>
			cn(
				'flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-sm transition-colors',
				'text-muted-foreground hover:bg-muted hover:text-foreground',
				{ 'bg-primary text-primary-foreground': isActive },
			),
	};

	const renderNavItems = () =>
		navItems.map((item) => (
			<li key={item.to}>
				<NavLink
					to={item.to}
					className={({ isActive }) => classes.navItem(isActive)}
				>
					<item.icon className="h-4 w-4" />
					{item.label}
				</NavLink>
			</li>
		));

	const renderFooter = () => (
		<div className="absolute right-3 bottom-4 left-3 space-y-3">
			<div className="rounded-lg bg-muted p-3 text-muted-foreground text-xs">
				<p className="mb-1 font-medium">Quick Tips</p>
				<ul className="space-y-1">
					<li>• Add training examples for better results</li>
					<li>• Import repo context for file references</li>
					<li>• Use ⌘+Enter to generate quickly</li>
				</ul>
			</div>
			<div className="flex flex-col items-center gap-1 text-muted-foreground text-xs">
				<p className="flex items-center gap-1">
					Made with <Heart className="h-3 w-3 fill-red-500 text-red-500" /> by{' '}
					<a
						href="https://x.com/zyruks"
						target="_blank"
						rel="noopener noreferrer"
						className="font-medium text-foreground hover:underline"
					>
						@zyruks
					</a>
				</p>
				<a
					href="https://github.com/zyruks/ticket-creator"
					target="_blank"
					rel="noopener noreferrer"
					className="flex items-center gap-1 text-foreground hover:underline"
				>
					<Github className="h-3 w-3" />
					<span className="font-medium">Open Source</span>
				</a>
			</div>
		</div>
	);

	return (
		<aside className={classes.container}>
			<div className="p-6">
				<h1 className="flex items-center gap-2 font-bold text-foreground text-xl">
					<Ticket className="h-6 w-6 text-primary" />
					Ticket Creator
				</h1>
				<p className="mt-1 text-muted-foreground text-xs">AI-Powered Tickets Generation</p>
			</div>

			<nav className="px-3">
				<ul className="space-y-1">{renderNavItems()}</ul>
			</nav>

			{renderFooter()}
		</aside>
	);
}
