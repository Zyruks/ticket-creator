import { cn } from '@common';
import { BookOpen, FolderTree, Menu, Settings, Ticket, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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
			'fixed top-0 left-0 right-0 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50'
		),
		overlay: {
			button: cn(
				'fixed inset-0 bg-background/80 backdrop-blur-sm z-40 w-full h-full cursor-default'
			),
			container: cn('fixed top-14 left-0 right-0 z-50'),
		},
		menuItem: (isActive: boolean) =>
			cn(
				'flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors',
				isActive
					? 'bg-primary text-primary-foreground'
					: 'text-muted-foreground hover:bg-muted hover:text-foreground'
			),
		bottomNav: cn(
			'fixed bottom-0 left-0 right-0 h-16 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50'
		),
		bottomItem: (isActive: boolean) =>
			cn(
				'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors',
				isActive ? 'text-primary' : 'text-muted-foreground'
			),
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
					<nav className="bg-background border-b p-4">
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
			<ul className="flex items-center justify-around h-full">
				{navItems.map((item) => (
					<li key={item.to}>
						<NavLink to={item.to} className={({ isActive }) => classes.bottomItem(isActive)}>
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
				<div className="flex items-center justify-between h-full px-4">
					<h1 className="font-bold flex items-center gap-2">
						<Ticket className="h-5 w-5 text-primary" />
						Ticket Creator
					</h1>
					<Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
						{isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
					</Button>
				</div>
			</header>

			{renderMenuOverlay()}
			{renderBottomNav()}
		</div>
	);
}
