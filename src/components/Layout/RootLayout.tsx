import { Outlet } from 'react-router-dom';
import { MobileNav } from './MobileNav';
import { Sidebar } from './Sidebar';

export function RootLayout() {
	return (
		<div className="flex min-h-screen bg-background">
			{/* Desktop Sidebar */}
			<Sidebar />

			{/* Mobile Navigation */}
			<MobileNav />

			{/* Main Content */}
			<main className="flex-1 overflow-y-auto pt-14 pb-16 md:pt-0 md:pb-0">
				<Outlet />
			</main>
		</div>
	);
}
