import { useTheme } from '@common';
import { Button } from '@components';
import { Moon, Sun } from 'lucide-react';
import { Outlet } from 'react-router-dom';
import { MobileNav } from './MobileNav';
import { Sidebar } from './Sidebar';

export function RootLayout() {
	const { isDark, toggleTheme } = useTheme();

	return (
		<div className="flex min-h-screen bg-background transition-colors duration-300 ease-in-out">
			{/* Desktop Sidebar */}
			<Sidebar />

			{/* Mobile Navigation */}
			<MobileNav />

			{/* Main Content */}
			<main className="flex-1 overflow-y-auto pt-14 pb-16 md:pt-0 md:pb-0">
				<Outlet />
			</main>

			{/* Theme Toggle - Fixed Position */}
			<Button
				size="icon"
				onClick={toggleTheme}
				className="fixed top-20 right-4 z-50 rounded-full shadow-lg md:top-4"
				aria-label="Toggle theme"
			>
				{isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
			</Button>
		</div>
	);
}
