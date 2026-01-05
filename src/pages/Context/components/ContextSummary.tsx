import { cn } from '@common';
import type { RepositoryContext } from '@domain';
import { Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ContextSummaryProps {
	/**
	 * Repository context data.
	 */
	context: RepositoryContext | null;
	/**
	 * Callback to clear the context.
	 */
	onClear: () => void;
}

export const ContextSummary = ({ context, onClear }: ContextSummaryProps) => {
	const classes = {
		summaryGrid: cn('grid grid-cols-2 gap-4 md:grid-cols-4'),
		summaryItem: cn('rounded-lg bg-muted p-4 text-center'),
	};

	if (!context) return null;

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle>{context.meta.repositoryName}</CardTitle>
						<CardDescription>
							Indexed on {new Date(context.meta.generatedAt).toLocaleString()}
						</CardDescription>
					</div>
					<Button
						variant="outline"
						onClick={onClear}
					>
						<Trash2 className="mr-2 h-4 w-4" />
						Clear
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div className={classes.summaryGrid}>
					<div className={classes.summaryItem}>
						<div className="font-bold text-2xl">{context.summary.totalFiles}</div>
						<div className="text-muted-foreground text-sm">Files</div>
					</div>
					<div className={classes.summaryItem}>
						<div className="font-bold text-2xl">{context.summary.totalDirectories}</div>
						<div className="text-muted-foreground text-sm">Directories</div>
					</div>
					<div className={classes.summaryItem}>
						<div className="font-bold text-2xl">{context.summary.importantPaths.length}</div>
						<div className="text-muted-foreground text-sm">Key Files</div>
					</div>
					<div className={classes.summaryItem}>
						<div className="font-bold text-2xl">{Object.keys(context.summary.filesByExtension).length}</div>
						<div className="text-muted-foreground text-sm">File Types</div>
					</div>
				</div>

				<div className="mt-4">
					<h4 className="mb-2 font-medium">File Types</h4>
					<div className="flex flex-wrap gap-2">
						{Object.entries(context.summary.filesByExtension)
							.sort((a, b) => b[1] - a[1])
							.slice(0, 10)
							.map(([ext, count]) => (
								<Badge
									key={ext}
									variant="secondary"
								>
									{ext}: {count}
								</Badge>
							))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
