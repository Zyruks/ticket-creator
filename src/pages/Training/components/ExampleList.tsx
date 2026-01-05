import { cn } from '@common';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle, ScrollArea } from '@components';
import type { TrainingExample } from '@domain';
import { Edit, Trash2 } from 'lucide-react';

interface ExampleListProps {
	/**
	 * Array of training examples to display.
	 */
	examples: TrainingExample[];
	/**
	 * Callback when delete button is clicked.
	 */
	onDelete: (id: string) => void;
	/**
	 * Callback when edit button is clicked.
	 */
	onEdit: (example: TrainingExample) => void;
}

export const ExampleList = ({ examples, onEdit, onDelete }: ExampleListProps) => {
	// CLASSES OBJECT
	const classes = {
		listContainer: cn('space-y-4'),
		cardHeader: cn('pb-3'),
		cardHeaderContent: cn('flex items-start justify-between'),
		cardActions: cn('flex gap-1'),
		scrollArea: cn('h-32'),
	};

	return (
		<div className={classes.listContainer}>
			{examples.map((example) => (
				<Card key={example.id}>
					<CardHeader className={classes.cardHeader}>
						<div className={classes.cardHeaderContent}>
							<div className="flex-1">
								<CardTitle className="font-medium text-base">
									{example.input.length > 100 ? `${example.input.slice(0, 100)}...` : example.input}
								</CardTitle>
								<CardDescription className="mt-1">
									Added {new Date(example.createdAt).toLocaleDateString()}
								</CardDescription>
							</div>
							<div className={classes.cardActions}>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => onEdit(example)}
								>
									<Edit className="h-4 w-4" />
								</Button>
								<Button
									variant="ghost"
									size="icon"
									onClick={() => onDelete(example.id)}
								>
									<Trash2 className="h-4 w-4 text-destructive" />
								</Button>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<ScrollArea className={classes.scrollArea}>
							<pre className="whitespace-pre-wrap rounded-md bg-muted p-3 font-mono text-muted-foreground text-xs">
								{example.output}
							</pre>
						</ScrollArea>
					</CardContent>
				</Card>
			))}
		</div>
	);
};
