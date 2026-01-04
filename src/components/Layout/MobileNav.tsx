import { BookOpen, FolderTree, Menu, Settings, Ticket, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navItems = [
	{ to: '/', icon: Ticket, label: 'Create' },
	{ to: '/training', icon: BookOpen, label: 'Training' },
	{ to: '/context', icon: FolderTree, label: 'Context' },
	{ to: '/settings', icon: Settings, label: 'Settings' },
];

export function MobileNav() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div className="md:hidden">
			{/* Top Bar */}
			<header className="fixed top-0 left-0 right-0 h-14 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
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

			{/* Mobile Menu Overlay */}
			{isOpen && (
				<>
					<button
						type="button"
						className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 w-full h-full cursor-default"
						onClick={() => setIsOpen(false)}
						aria-label="Close menu"
					/>
					<div className="fixed top-14 left-0 right-0 z-50">
						<nav className="bg-background border-b p-4">
							<ul className="space-y-2">
								{navItems.map((item) => (
									<li key={item.to}>
										<NavLink
											to={item.to}
											onClick={() => setIsOpen(false)}
											className={({ isActive }) =>
												cn(
													'flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-colors',
													isActive
														? 'bg-primary text-primary-foreground'
														: 'text-muted-foreground hover:bg-muted hover:text-foreground'
												)
											}
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
			)}

			{/* Bottom Navigation */}
			<nav className="fixed bottom-0 left-0 right-0 h-16 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
				<ul className="flex items-center justify-around h-full">
					{navItems.map((item) => (
						<li key={item.to}>
							<NavLink
								to={item.to}
								className={({ isActive }) =>
									cn(
										'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors',
										isActive ? 'text-primary' : 'text-muted-foreground'
									)
								}
							>
								<item.icon className="h-5 w-5" />
								<span className="text-xs">{item.label}</span>
							</NavLink>
						</li>
					))}
				</ul>
			</nav>
		</div>
	);
}
