#!/usr/bin/env node

/**
 * Repository Indexer Script
 *
 * Generates a JSON file containing the folder structure of a repository,
 * respecting .gitignore patterns. Run this on your target repo (e.g., your-repo)
 * and import the generated JSON into the Ticket Creator app.
 *
 * Usage:
 *   node scripts/index-repo.mjs /path/to/repository [output-file.json]
 *
 * Example:
 *   node scripts/index-repo.mjs ~/Github/your-repo ./repo-context.json
 */

import { execSync } from 'node:child_process';
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

// Default patterns to always ignore (on top of .gitignore)
const ALWAYS_IGNORE = [
	'.git',
	'.DS_Store',
	'Thumbs.db',
	'.idea',
	'.vscode',
	'*.log',
	'*.lock',
	'package-lock.json',
	'pnpm-lock.yaml',
	'yarn.lock',
];

// File extensions we care about for context
const IMPORTANT_EXTENSIONS = [
	'.ts',
	'.tsx',
	'.js',
	'.jsx',
	'.mjs',
	'.cjs',
	'.css',
	'.scss',
	'.sass',
	'.less',
	'.json',
	'.yaml',
	'.yml',
	'.md',
	'.mdx',
	'.html',
	'.vue',
	'.svelte',
];

/**
 * Parse .gitignore file and return patterns
 */
function parseGitignore(repoPath) {
	const gitignorePath = join(repoPath, '.gitignore');
	const patterns = [...ALWAYS_IGNORE];

	if (existsSync(gitignorePath)) {
		const content = readFileSync(gitignorePath, 'utf-8');
		const lines = content
			.split('\n')
			.map((line) => line.trim())
			.filter((line) => line && !line.startsWith('#'));
		patterns.push(...lines);
	}

	return patterns;
}

/**
 * Check if a path should be ignored based on patterns
 */
function shouldIgnore(relativePath, patterns) {
	const name = basename(relativePath);

	for (const pattern of patterns) {
		// Simple pattern matching (not full glob, but covers most cases)
		if (pattern === name) return true;
		if (pattern.endsWith('/') && name === pattern.slice(0, -1)) return true;
		if (pattern.startsWith('*') && name.endsWith(pattern.slice(1))) return true;
		if (pattern.endsWith('*') && name.startsWith(pattern.slice(0, -1))) return true;
		if (pattern.includes('/') && relativePath.includes(pattern.replace(/\/$/, ''))) return true;
		if (relativePath === pattern || relativePath.startsWith(`${pattern}/`)) return true;
	}

	return false;
}

/**
 * Get files tracked by git (respects .gitignore automatically)
 */
function getGitTrackedFiles(repoPath) {
	try {
		const output = execSync('git ls-files', { cwd: repoPath, encoding: 'utf-8' });
		return output.split('\n').filter(Boolean);
	} catch {
		console.warn(
			'Warning: Not a git repository or git not available. Falling back to manual traversal.'
		);
		return null;
	}
}

/**
 * Build tree structure from file list
 */
function buildTree(files, repoPath) {
	const tree = {
		name: basename(repoPath),
		type: 'directory',
		children: [],
		path: '.',
	};

	const nodeMap = new Map();
	nodeMap.set('.', tree);

	// Sort files for consistent output
	files.sort();

	for (const filePath of files) {
		const parts = filePath.split('/');
		let currentPath = '.';
		let parentNode = tree;

		for (let i = 0; i < parts.length; i++) {
			const part = parts[i];
			const isFile = i === parts.length - 1;
			const nodePath = currentPath === '.' ? part : `${currentPath}/${part}`;

			if (!nodeMap.has(nodePath)) {
				const fullPath = join(repoPath, nodePath);
				const node = {
					name: part,
					type: isFile ? 'file' : 'directory',
					path: nodePath,
				};

				if (isFile) {
					// Add file extension info
					const ext = part.includes('.') ? `.${part.split('.').pop()}` : '';
					if (ext) node.extension = ext;

					// Check if it's an important file type
					node.important = IMPORTANT_EXTENSIONS.includes(ext);

					// Get file size
					try {
						const stats = statSync(fullPath);
						node.size = stats.size;
					} catch {
						// File might not exist or be accessible
					}
				} else {
					node.children = [];
				}

				parentNode.children.push(node);
				nodeMap.set(nodePath, node);
			}

			if (!isFile) {
				parentNode = nodeMap.get(nodePath);
			}
			currentPath = nodePath;
		}
	}

	return tree;
}

/**
 * Generate a summary of the repository structure
 */
function generateSummary(tree) {
	const stats = {
		totalFiles: 0,
		totalDirectories: 0,
		filesByExtension: {},
		importantPaths: [],
	};

	function traverse(node, depth = 0) {
		if (node.type === 'file') {
			stats.totalFiles++;
			if (node.extension) {
				stats.filesByExtension[node.extension] = (stats.filesByExtension[node.extension] || 0) + 1;
			}

			// Track important paths (components, pages, hooks, utils, etc.)
			const lowerPath = node.path.toLowerCase();
			if (
				lowerPath.includes('component') ||
				lowerPath.includes('page') ||
				lowerPath.includes('hook') ||
				lowerPath.includes('util') ||
				lowerPath.includes('service') ||
				lowerPath.includes('store') ||
				lowerPath.includes('context') ||
				lowerPath.includes('provider') ||
				node.name === 'index.ts' ||
				node.name === 'index.tsx'
			) {
				stats.importantPaths.push(node.path);
			}
		} else {
			stats.totalDirectories++;
			for (const child of node.children || []) {
				traverse(child, depth + 1);
			}
		}
	}

	traverse(tree);
	return stats;
}

/**
 * Generate a compact text representation for token-efficient prompts
 */
function generateCompactTree(tree, indent = '') {
	let result = '';

	if (tree.type === 'directory') {
		result += `${indent}${tree.name}/\n`;
		const sortedChildren = [...(tree.children || [])].sort((a, b) => {
			// Directories first, then files
			if (a.type !== b.type) return a.type === 'directory' ? -1 : 1;
			return a.name.localeCompare(b.name);
		});

		for (const child of sortedChildren) {
			result += generateCompactTree(child, `${indent}  `);
		}
	} else {
		result += `${indent}${tree.name}\n`;
	}

	return result;
}

/**
 * Main function
 */
function main() {
	const args = process.argv.slice(2);

	if (args.length === 0) {
		console.log('Repository Indexer - Generate JSON context for AI ticket creation\n');
		console.log('Usage:');
		console.log('  node scripts/index-repo.mjs <repository-path> [output-file]');
		console.log('\nExample:');
		console.log('  node scripts/index-repo.mjs ~/Github/your-repo ./repo-context.json');
		console.log('\nThe output JSON can be imported into the Ticket Creator app.');
		process.exit(0);
	}

	const repoPath = args[0];
	const outputPath = args[1] || 'repo-context.json';

	if (!existsSync(repoPath)) {
		console.error(`Error: Repository path does not exist: ${repoPath}`);
		process.exit(1);
	}

	console.log(`\n📁 Indexing repository: ${repoPath}`);
	console.log('─'.repeat(50));

	// Try git ls-files first, fall back to manual traversal
	let files = getGitTrackedFiles(repoPath);

	if (!files) {
		// Manual traversal respecting .gitignore
		const patterns = parseGitignore(repoPath);
		files = [];

		function traverse(dir, base = '') {
			const { readdirSync } = require('node:fs');
			try {
				const entries = readdirSync(dir, { withFileTypes: true });
				for (const entry of entries) {
					const relativePath = base ? `${base}/${entry.name}` : entry.name;

					if (shouldIgnore(relativePath, patterns)) continue;

					if (entry.isDirectory()) {
						traverse(join(dir, entry.name), relativePath);
					} else {
						files.push(relativePath);
					}
				}
			} catch {
				console.warn(`Warning: Could not read directory ${dir}`);
			}
		}

		traverse(repoPath);
	}

	console.log(`✅ Found ${files.length} files`);

	// Build tree structure
	const tree = buildTree(files, repoPath);
	const summary = generateSummary(tree);
	const compactTree = generateCompactTree(tree);

	// Create output
	const output = {
		meta: {
			generatedAt: new Date().toISOString(),
			repositoryPath: repoPath,
			repositoryName: basename(repoPath),
		},
		summary,
		tree,
		compactTree,
	};

	// Write output
	writeFileSync(outputPath, JSON.stringify(output, null, 2));
	console.log(`\n📄 Output written to: ${outputPath}`);

	// Print summary
	console.log('\n📊 Summary:');
	console.log(`   Files: ${summary.totalFiles}`);
	console.log(`   Directories: ${summary.totalDirectories}`);
	console.log(`   Important paths: ${summary.importantPaths.length}`);
	console.log('\n   File types:');

	const sortedExtensions = Object.entries(summary.filesByExtension)
		.sort((a, b) => b[1] - a[1])
		.slice(0, 10);

	for (const [ext, count] of sortedExtensions) {
		console.log(`     ${ext}: ${count}`);
	}

	console.log('\n✨ Done! Import this JSON into the Ticket Creator app.\n');
}

main();
