import { cn } from '@common';
import { useRepositoryStore } from '@domain';
import { FolderTree } from 'lucide-react';
import { useCallback } from 'react';
import { ContextSummary, ContextTree, ImportSection } from '@/pages/Context/components';

export const ContextPage = () => {
	const classes = {
		container: cn('container mx-auto max-w-4xl px-4 py-8'),
		header: cn('mb-8 flex items-center gap-3'),
		contextContainer: cn('space-y-6'),
	};

	const { context, isLoaded, importFromJson, clearContext } = useRepositoryStore();

	const handleImport = useCallback(
		(json: string) => {
			return importFromJson(json);
		},
		[importFromJson],
	);

	const handleClear = useCallback(() => {
		clearContext();
	}, [clearContext]);

	return (
		<div className={classes.container}>
			<div className={classes.header}>
				<FolderTree className="h-8 w-8 text-primary" />
				<div>
					<h1 className="font-bold text-3xl">Repository Context</h1>
					<p className="text-muted-foreground">Import your repository structure for context-aware tickets</p>
				</div>
			</div>

			<ImportSection
				isLoaded={isLoaded}
				onImport={handleImport}
			/>

			{isLoaded && context && (
				<div className={classes.contextContainer}>
					<ContextSummary
						context={context}
						onClear={handleClear}
					/>
					<ContextTree tree={context.tree} />
				</div>
			)}
		</div>
	);
};
