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
			'@layout': path.resolve(__dirname, './src/layout'),
			'@components': path.resolve(__dirname, './src/components'),
		},
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					// React ecosystem
					'react-vendor': ['react', 'react-dom', 'react-router-dom'],

					// OpenAI SDK
					'openai-sdk': ['openai'],

					// Markdown rendering
					markdown: ['react-markdown', 'remark-gfm'],

					// Radix UI components
					'radix-ui': [
						'@radix-ui/react-dialog',
						'@radix-ui/react-label',
						'@radix-ui/react-scroll-area',
						'@radix-ui/react-select',
						'@radix-ui/react-slot',
						'@radix-ui/react-tabs',
					],

					// State management & utils
					utils: ['zustand', 'clsx', 'tailwind-merge', 'class-variance-authority'],

					// Icons
					icons: ['lucide-react'],
				},
			},
		},
		chunkSizeWarningLimit: 600,
	},
});
