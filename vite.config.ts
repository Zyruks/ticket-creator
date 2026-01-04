import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(), tailwindcss()],
	resolve: {
		alias: {
			'@': path.resolve(__dirname, './src'),
			'@common': path.resolve(__dirname, './src/common'),
			'@domain': path.resolve(__dirname, './src/domain'),
			'@pages': path.resolve(__dirname, './src/pages'),
			'@components': path.resolve(__dirname, './src/components'),
		},
	},
});
