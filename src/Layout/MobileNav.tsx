import { cn } from '@common';
import { Button } from '@components';
import { BookOpen, FolderTree, Menu, Settings, Ticket, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
	{ to: '/', icon: Ticket, label: 'Create' },
	{ to: '/training', icon: BookOpen, label: 'Training' },
	{ to: '/context', icon: FolderTree, label: 'Context' },
	{ to: '/settings', icon: Settings, label: 'Settings' },
];

export function MobileNav() {
	const [isOpen, setIsOpen] = useState(false);

	const classes = {
		container: cn('md:hidden'),
		header: cn(
			'fixed top-0 right-0 left-0 z-50 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
		),
		overlay: {
			button: cn('fixed inset-0 z-40 h-full w-full cursor-default bg-background/80 backdrop-blur-sm'),
			container: cn('fixed top-14 right-0 left-0 z-50'),
		},
		menuItem: (isActive: boolean) =>
			cn(
				'flex items-center gap-3 rounded-lg px-4 py-3 font-medium text-base transition-colors',
				isActive
					? 'bg-primary text-primary-foreground'
					: 'text-muted-foreground hover:bg-muted hover:text-foreground',
			),
		bottomNav: cn(
			'fixed right-0 bottom-0 left-0 z-50 h-16 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
		),
		bottomItem: (isActive: boolean) =>
			cn('flex flex-col items-center gap-1 rounded-lg px-3 py-2 transition-colors', 'text-muted-foreground', {
				'text-primary': isActive,
			}),
	};

	const renderMenuOverlay = () => {
		if (!isOpen) return null;

		return (
			<>
				<button
					type="button"
					className={classes.overlay.button}
					onClick={() => setIsOpen(false)}
					aria-label="Close menu"
				/>
				<div className={classes.overlay.container}>
					<nav className="border-b bg-background p-4">
						<ul className="space-y-2">
							{navItems.map((item) => (
								<li key={item.to}>
									<NavLink
										to={item.to}
										onClick={() => setIsOpen(false)}
										className={({ isActive }) => classes.menuItem(isActive)}
									>
										<item.icon className="h-5 w-5" />
										{item.label}
									</NavLink>
								</li>
							))}
						</ul>
					</nav>
				</div>
			</>
		);
	};

	const renderBottomNav = () => (
		<nav className={classes.bottomNav}>
			<ul className="flex h-full items-center justify-around">
				{navItems.map((item) => (
					<li key={item.to}>
						<NavLink
							to={item.to}
							className={({ isActive }) => classes.bottomItem(isActive)}
						>
							<item.icon className="h-5 w-5" />
							<span className="text-xs">{item.label}</span>
						</NavLink>
					</li>
				))}
			</ul>
		</nav>
	);

	return (
		<div className={classes.container}>
			<header className={classes.header}>
				<div className="flex h-full items-center justify-between px-4">
					<h1 className="flex items-center gap-2 font-bold">
						<Ticket className="h-5 w-5 text-primary" />
						Ticket Creator
					</h1>
					<Button
						variant="ghost"
						size="icon"
						onClick={() => setIsOpen(!isOpen)}
					>
						{isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
					</Button>
				</div>
			</header>

			{renderMenuOverlay()}
			{renderBottomNav()}
		</div>
	);
}
