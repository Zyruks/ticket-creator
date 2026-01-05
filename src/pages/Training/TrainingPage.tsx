import { cn } from '@common';
import { Badge, Button, Card, CardContent } from '@components';
import { type TrainingExample, useTrainingStore } from '@domain';
import { BookOpen, FileJson, Plus } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import {
	AddExampleDialog,
	EditExampleDialog,
	ExampleList,
	TrainingActions,
} from '@/pages/Training/components';

export const TrainingPage = () => {
	const classes = {
		container: cn('container mx-auto max-w-4xl bg-white px-4 py-8'),
		header: cn('mb-8 flex items-center justify-between'),
		emptyStateCard: cn('border-dashed'),
		emptyStateContent: cn('flex flex-col items-center justify-center py-12'),
	};

	const { examples, addExample, updateExample, deleteExample, importExamples, clearExamples } =
		useTrainingStore();

	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [editingExample, setEditingExample] = useState<TrainingExample | null>(null);

	const hasExamples = examples.length > 0;
	const exampleCountLabel = `${examples.length} example${examples.length !== 1 ? 's' : ''}`;

	// CALLBACKS
	const handleImport = useCallback(
		(data: TrainingExample[]) => {
			importExamples(data);
		},
		[importExamples],
	);

	const handleExport = useCallback(() => {
		const data = JSON.stringify(examples, null, 2);
		const blob = new Blob([data], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const anchorElement = document.createElement('a');
		anchorElement.href = url;
		anchorElement.download = 'training-examples.json';
		anchorElement.click();
		URL.revokeObjectURL(url);
		toast.success('Exported training examples');
	}, [examples]);

	const handleClearAll = useCallback(() => {
		if (examples.length === 0) return;
		clearExamples();
		toast.success('All training examples cleared');
	}, [examples.length, clearExamples]);

	const renderEmptyState = () => (
		<Card className={classes.emptyStateCard}>
			<CardContent className={classes.emptyStateContent}>
				<FileJson className="mb-4 h-12 w-12 text-muted-foreground" />
				<h3 className="mb-2 font-semibold text-lg">No training examples yet</h3>
				<p className="mb-4 text-center text-muted-foreground">
					Add examples of your request → ticket pairs to improve AI generation quality
				</p>
				<Button onClick={() => setIsAddDialogOpen(true)}>
					<Plus className="mr-2 h-4 w-4" />
					Add Your First Example
				</Button>
			</CardContent>
		</Card>
	);

	return (
		<div className={classes.container}>
			<div className={classes.header}>
				<div className="flex items-center gap-3">
					<BookOpen className="h-8 w-8 text-primary" />
					<div>
						<h1 className="font-bold text-3xl">Training Examples</h1>
						<p className="text-muted-foreground">Add examples to teach the AI your ticket style</p>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<Badge
						variant="secondary"
						className="text-sm"
					>
						{exampleCountLabel}
					</Badge>
				</div>
			</div>

			<TrainingActions
				examples={examples}
				onImport={handleImport}
				onExport={handleExport}
				onClear={handleClearAll}
				onAddOpen={() => setIsAddDialogOpen(true)}
			/>

			{hasExamples ? (
				<ExampleList
					examples={examples}
					onEdit={setEditingExample}
					onDelete={deleteExample}
				/>
			) : (
				renderEmptyState()
			)}

			<AddExampleDialog
				isOpen={isAddDialogOpen}
				onOpenChange={setIsAddDialogOpen}
				onAdd={addExample}
			/>

			<EditExampleDialog
				example={editingExample}
				onClose={() => setEditingExample(null)}
				onUpdate={updateExample}
			/>
		</div>
	);
};

export default TrainingPage;
