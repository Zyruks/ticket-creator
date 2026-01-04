import { Edit, Trash2 } from 'lucide-react';
import { cn } from '@common';
import { type TrainingExample } from '@domain/training';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ExampleListProps {
	examples: TrainingExample[];
	onEdit: (example: TrainingExample) => void;
	onDelete: (id: string) => void;
}

export const ExampleList = ({ examples, onEdit, onDelete }: ExampleListProps) => {
	// 1. CLASSES OBJECT
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
								<CardTitle className="text-base font-medium">
									{example.input.length > 100 ? `${example.input.slice(0, 100)}...` : example.input}
								</CardTitle>
								<CardDescription className="mt-1">
									Added {new Date(example.createdAt).toLocaleDateString()}
								</CardDescription>
							</div>
							<div className={classes.cardActions}>
								<Button variant="ghost" size="icon" onClick={() => onEdit(example)}>
									<Edit className="h-4 w-4" />
								</Button>
								<Button variant="ghost" size="icon" onClick={() => onDelete(example.id)}>
									<Trash2 className="h-4 w-4 text-destructive" />
								</Button>
							</div>
						</div>
					</CardHeader>
					<CardContent>
						<ScrollArea className={classes.scrollArea}>
							<pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono bg-muted p-3 rounded-md">
								{example.output}
							</pre>
						</ScrollArea>
					</CardContent>
				</Card>
			))}
		</div>
	);
};
