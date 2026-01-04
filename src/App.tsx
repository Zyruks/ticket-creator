import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { RootLayout } from '@/components/Layout';
import { Toaster } from '@/components/ui/sonner';
import { ContextPage, HomePage, SettingsPage, TrainingPage } from '@/pages';

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<RootLayout />}>
					<Route path="/" element={<HomePage />} />
					<Route path="/training" element={<TrainingPage />} />
					<Route path="/context" element={<ContextPage />} />
					<Route path="/settings" element={<SettingsPage />} />
				</Route>
			</Routes>
			<Toaster position="bottom-right" />
		</BrowserRouter>
	);
}
