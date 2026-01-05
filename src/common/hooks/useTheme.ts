import { useCallback, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

/**
 * Hook to manage theme (light/dark mode)
 * Persists preference to localStorage and syncs with system preference
 */
export function useTheme() {
	const [theme, setThemeState] = useState<Theme>(() => {
		if (typeof window === 'undefined') return 'system';
		return (localStorage.getItem('theme') as Theme) || 'system';
	});

	const applyTheme = useCallback((newTheme: Theme) => {
		const root = document.documentElement;
		const isDark =
			newTheme === 'dark' || (newTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

		root.classList.toggle('dark', isDark);
	}, []);

	const setTheme = useCallback(
		(newTheme: Theme) => {
			setThemeState(newTheme);
			localStorage.setItem('theme', newTheme);
			applyTheme(newTheme);
		},
		[applyTheme],
	);

	const toggleTheme = useCallback(() => {
		const root = document.documentElement;
		const isDark = root.classList.contains('dark');
		setTheme(isDark ? 'light' : 'dark');
	}, [setTheme]);

	// Apply theme on mount and when system preference changes
	useEffect(() => {
		applyTheme(theme);

		const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
		const handleChange = () => {
			if (theme === 'system') {
				applyTheme('system');
			}
		};

		mediaQuery.addEventListener('change', handleChange);
		return () => mediaQuery.removeEventListener('change', handleChange);
	}, [theme, applyTheme]);

	const isDark =
		theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

	return { theme, setTheme, toggleTheme, isDark };
}
