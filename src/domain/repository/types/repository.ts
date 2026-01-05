export interface RepositoryNode {
	/**
	 * Node type - file or directory
	 */
	type: 'file' | 'directory';

	/**
	 * Name of the file or directory
	 */
	name: string;

	/**
	 * Full path to the file or directory
	 */
	path: string;

	/**
	 * Child nodes for directories
	 */
	children?: RepositoryNode[];

	/**
	 * File extension (without the dot)
	 */
	extension?: string;

	/**
	 * File size in bytes
	 */
	size?: number;

	/**
	 * Whether this path is marked as important
	 */
	important?: boolean;
}

export interface RepositorySummary {
	/**
	 * Total number of files in repository
	 */
	totalFiles: number;

	/**
	 * Total number of directories in repository
	 */
	totalDirectories: number;

	/**
	 * Count of files grouped by extension
	 */
	filesByExtension: Record<string, number>;

	/**
	 * List of paths marked as important
	 */
	importantPaths: string[];
}

type RepositoryContextMeta = {
	/**
	 * Name of the repository
	 */
	repositoryName: string;

	/**
	 * Absolute path to repository
	 */
	repositoryPath: string;

	/**
	 * ISO timestamp when context was generated
	 */
	generatedAt: string;
};

export interface RepositoryContext {
	/**
	 * Metadata about the repository
	 */
	meta: RepositoryContextMeta;

	/**
	 * Full tree structure of the repository
	 */
	tree: RepositoryNode;

	/**
	 * Statistical summary of repository contents
	 */
	summary: RepositorySummary;

	/**
	 * Compact string representation of the tree
	 */
	compactTree: string;
}
