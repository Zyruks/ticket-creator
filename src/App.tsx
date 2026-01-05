import { Toaster } from '@components';
import { RootLayout } from '@layout';
import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

const HomePage = lazy(() => import('@/pages/Home/HomePage'));
const TrainingPage = lazy(() => import('@/pages/Training/TrainingPage'));
const ContextPage = lazy(() => import('@/pages/Context/ContextPage'));
const SettingsPage = lazy(() => import('@/pages/Settings/SettingsPage'));

const PageLoader = () => (
	<div className="flex h-screen items-center justify-center">
		<div className="text-muted-foreground">Loading...</div>
	</div>
);

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<RootLayout />}>
					<Route
						path="/"
						element={
							<Suspense fallback={<PageLoader />}>
								<HomePage />
							</Suspense>
						}
					/>
					<Route
						path="/training"
						element={
							<Suspense fallback={<PageLoader />}>
								<TrainingPage />
							</Suspense>
						}
					/>
					<Route
						path="/context"
						element={
							<Suspense fallback={<PageLoader />}>
								<ContextPage />
							</Suspense>
						}
					/>
					<Route
						path="/settings"
						element={
							<Suspense fallback={<PageLoader />}>
								<SettingsPage />
							</Suspense>
						}
					/>
				</Route>
			</Routes>
			<Toaster position="bottom-right" />
		</BrowserRouter>
	);
}
