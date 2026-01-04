import { type RepositoryContext } from '@domain/repository';
import { Trash2 } from 'lucide-react';
import { cn } from '@common';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ContextSummaryProps {
	context: RepositoryContext | null;
	onClear: () => void;
}

export const ContextSummary = ({ context, onClear }: ContextSummaryProps) => {
	// 1. CLASSES OBJECT
	const classes = {
		summaryGrid: cn('grid grid-cols-2 md:grid-cols-4 gap-4'),
		summaryItem: cn('text-center p-4 bg-muted rounded-lg'),
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
					<Button variant="outline" onClick={onClear}>
						<Trash2 className="h-4 w-4 mr-2" />
						Clear
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				<div className={classes.summaryGrid}>
					<div className={classes.summaryItem}>
						<div className="text-2xl font-bold">{context.summary.totalFiles}</div>
						<div className="text-sm text-muted-foreground">Files</div>
					</div>
					<div className={classes.summaryItem}>
						<div className="text-2xl font-bold">{context.summary.totalDirectories}</div>
						<div className="text-sm text-muted-foreground">Directories</div>
					</div>
					<div className={classes.summaryItem}>
						<div className="text-2xl font-bold">{context.summary.importantPaths.length}</div>
						<div className="text-sm text-muted-foreground">Key Files</div>
					</div>
					<div className={classes.summaryItem}>
						<div className="text-2xl font-bold">
							{Object.keys(context.summary.filesByExtension).length}
						</div>
						<div className="text-sm text-muted-foreground">File Types</div>
					</div>
				</div>

				<div className="mt-4">
					<h4 className="font-medium mb-2">File Types</h4>
					<div className="flex flex-wrap gap-2">
						{Object.entries(context.summary.filesByExtension)
							.sort((a, b) => b[1] - a[1])
							.slice(0, 10)
							.map(([ext, count]) => (
								<Badge key={ext} variant="secondary">
									{ext}: {count}
								</Badge>
							))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
