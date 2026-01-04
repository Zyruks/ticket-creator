import { useTrainingStore } from '@domain/stores';
import type { TrainingExample } from '@domain/training';
import { BookOpen, FileJson, Plus } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';

import { cn } from '@common';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
	AddExampleDialog,
	EditExampleDialog,
	ExampleList,
	TrainingActions,
} from '@/pages/Training/components';

export const TrainingPage = () => {
	// 1. CLASSES OBJECT
	const classes = {
		container: cn('container mx-auto max-w-4xl py-8 px-4 bg-white'),
		header: cn('flex items-center justify-between mb-8'),
		emptyStateCard: cn('border-dashed'),
		emptyStateContent: cn('flex flex-col items-center justify-center py-12'),
	};

	// 2. HOOKS
	const { examples, addExample, updateExample, deleteExample, importExamples, clearExamples } =
		useTrainingStore();

	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [editingExample, setEditingExample] = useState<TrainingExample | null>(null);

	// 3. DERIVED STATE
	const hasExamples = examples.length > 0;
	const exampleCountLabel = `${examples.length} example${examples.length !== 1 ? 's' : ''}`;

	// 4. CALLBACKS
	const handleImport = useCallback(
		(data: TrainingExample[]) => {
			importExamples(data);
		},
		[importExamples]
	);

	const handleExport = useCallback(() => {
		const data = JSON.stringify(examples, null, 2);
		const blob = new Blob([data], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'training-examples.json';
		a.click();
		URL.revokeObjectURL(url);
		toast.success('Exported training examples');
	}, [examples]);

	const handleClearAll = useCallback(() => {
		if (examples.length === 0) return;
		clearExamples();
		toast.success('All training examples cleared');
	}, [examples.length, clearExamples]);

	// 5. RENDER HELPERS
	const renderEmptyState = () => (
		<Card className={classes.emptyStateCard}>
			<CardContent className={classes.emptyStateContent}>
				<FileJson className="h-12 w-12 text-muted-foreground mb-4" />
				<h3 className="text-lg font-semibold mb-2">No training examples yet</h3>
				<p className="text-muted-foreground text-center mb-4">
					Add examples of your request → ticket pairs to improve AI generation quality
				</p>
				<Button onClick={() => setIsAddDialogOpen(true)}>
					<Plus className="h-4 w-4 mr-2" />
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
						<h1 className="text-3xl font-bold">Training Examples</h1>
						<p className="text-muted-foreground">Add examples to teach the AI your ticket style</p>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<Badge variant="secondary" className="text-sm">
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
