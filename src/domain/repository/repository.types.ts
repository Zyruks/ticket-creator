/**
 * Repository Context Types
 */

export interface RepositoryNode {
	name: string;
	type: 'file' | 'directory';
	path: string;
	extension?: string;
	important?: boolean;
	size?: number;
	children?: RepositoryNode[];
}

export interface RepositorySummary {
	totalFiles: number;
	totalDirectories: number;
	filesByExtension: Record<string, number>;
	importantPaths: string[];
}

export interface RepositoryContext {
	meta: {
		generatedAt: string;
		repositoryPath: string;
		repositoryName: string;
	};
	summary: RepositorySummary;
	tree: RepositoryNode;
	compactTree: string;
}
