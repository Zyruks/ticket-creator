import { useTrainingStore } from '@domain/stores';
import type { TrainingExample } from '@domain/training';
import { BookOpen, Download, Edit, FileJson, Plus, Save, Trash2, Upload, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';

export function TrainingPage() {
	const { examples, addExample, updateExample, deleteExample, importExamples, clearExamples } =
		useTrainingStore();

	const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
	const [editingExample, setEditingExample] = useState<TrainingExample | null>(null);
	const [inputValue, setInputValue] = useState('');
	const [outputValue, setOutputValue] = useState('');

	const handleAddExample = () => {
		if (!inputValue.trim() || !outputValue.trim()) {
			toast.error('Both input and output are required');
			return;
		}

		addExample(inputValue.trim(), outputValue.trim());
		setInputValue('');
		setOutputValue('');
		setIsAddDialogOpen(false);
		toast.success('Training example added');
	};

	const handleUpdateExample = () => {
		if (!editingExample) return;

		if (!inputValue.trim() || !outputValue.trim()) {
			toast.error('Both input and output are required');
			return;
		}

		updateExample(editingExample.id, {
			input: inputValue.trim(),
			output: outputValue.trim(),
		});
		setEditingExample(null);
		setInputValue('');
		setOutputValue('');
		toast.success('Training example updated');
	};

	const handleEditExample = (example: TrainingExample) => {
		setEditingExample(example);
		setInputValue(example.input);
		setOutputValue(example.output);
	};

	const handleDeleteExample = (id: string) => {
		deleteExample(id);
		toast.success('Training example deleted');
	};

	const handleExport = () => {
		const data = JSON.stringify(examples, null, 2);
		const blob = new Blob([data], { type: 'application/json' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.href = url;
		a.download = 'training-examples.json';
		a.click();
		URL.revokeObjectURL(url);
		toast.success('Exported training examples');
	};

	const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (e) => {
			try {
				const data = JSON.parse(e.target?.result as string) as TrainingExample[];
				if (Array.isArray(data)) {
					importExamples(data);
					toast.success(`Imported ${data.length} training examples`);
				} else {
					toast.error('Invalid file format');
				}
			} catch {
				toast.error('Failed to parse JSON file');
			}
		};
		reader.readAsText(file);
		event.target.value = '';
	};

	const handleClearAll = () => {
		if (examples.length === 0) return;
		clearExamples();
		toast.success('All training examples cleared');
	};

	return (
		<div className="container mx-auto max-w-4xl py-8 px-4 bg-white">
			<div className="flex items-center justify-between mb-8">
				<div className="flex items-center gap-3">
					<BookOpen className="h-8 w-8 text-primary" />
					<div>
						<h1 className="text-3xl font-bold">Training Examples</h1>
						<p className="text-muted-foreground">Add examples to teach the AI your ticket style</p>
					</div>
				</div>

				<div className="flex items-center gap-2">
					<Badge variant="secondary" className="text-sm">
						{examples.length} example{examples.length !== 1 ? 's' : ''}
					</Badge>
				</div>
			</div>

			{/* Action Buttons */}
			<div className="flex flex-wrap gap-2 mb-6">
				<Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
					<DialogTrigger asChild>
						<Button>
							<Plus className="h-4 w-4 mr-2" />
							Add Example
						</Button>
					</DialogTrigger>
					<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
						<DialogHeader>
							<DialogTitle>Add Training Example</DialogTitle>
							<DialogDescription>
								Provide an input request and the expected ticket output
							</DialogDescription>
						</DialogHeader>
						<div className="space-y-4 py-4">
							<div className="space-y-2">
								<Label htmlFor="input">Input Request</Label>
								<Textarea
									id="input"
									value={inputValue}
									onChange={(e) => setInputValue(e.target.value)}
									placeholder="e.g., Update the header color to match the new brand guidelines"
									className="min-h-[80px]"
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="output">Expected Ticket Output (Markdown)</Label>
								<Textarea
									id="output"
									value={outputValue}
									onChange={(e) => setOutputValue(e.target.value)}
									placeholder="## Objective / Problem Statement&#10;Update the header component to use the new brand color..."
									className="min-h-[200px] font-mono text-sm"
								/>
							</div>
						</div>
						<DialogFooter>
							<Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
								Cancel
							</Button>
							<Button onClick={handleAddExample}>
								<Save className="h-4 w-4 mr-2" />
								Save Example
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>

				<label>
					<Button variant="outline" asChild>
						<span>
							<Upload className="h-4 w-4 mr-2" />
							Import JSON
							<input type="file" accept=".json" onChange={handleImport} className="sr-only" />
						</span>
					</Button>
				</label>

				<Button variant="outline" onClick={handleExport} disabled={examples.length === 0}>
					<Download className="h-4 w-4 mr-2" />
					Export JSON
				</Button>

				<Button
					variant="outline"
					className="text-destructive"
					onClick={handleClearAll}
					disabled={examples.length === 0}
				>
					<Trash2 className="h-4 w-4 mr-2" />
					Clear All
				</Button>
			</div>

			{/* Examples List */}
			{examples.length === 0 ? (
				<Card className="border-dashed">
					<CardContent className="flex flex-col items-center justify-center py-12">
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
			) : (
				<div className="space-y-4">
					{examples.map((example) => (
						<Card key={example.id}>
							<CardHeader className="pb-3">
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<CardTitle className="text-base font-medium">
											{example.input.length > 100
												? `${example.input.slice(0, 100)}...`
												: example.input}
										</CardTitle>
										<CardDescription className="mt-1">
											Added {new Date(example.createdAt).toLocaleDateString()}
										</CardDescription>
									</div>
									<div className="flex gap-1">
										<Button variant="ghost" size="icon" onClick={() => handleEditExample(example)}>
											<Edit className="h-4 w-4" />
										</Button>
										<Button
											variant="ghost"
											size="icon"
											onClick={() => handleDeleteExample(example.id)}
										>
											<Trash2 className="h-4 w-4 text-destructive" />
										</Button>
									</div>
								</div>
							</CardHeader>
							<CardContent>
								<ScrollArea className="h-32">
									<pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono bg-muted p-3 rounded-md">
										{example.output}
									</pre>
								</ScrollArea>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{/* Edit Dialog */}
			<Dialog open={!!editingExample} onOpenChange={(open) => !open && setEditingExample(null)}>
				<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
					<DialogHeader>
						<DialogTitle>Edit Training Example</DialogTitle>
						<DialogDescription>Update the input request or expected output</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="edit-input">Input Request</Label>
							<Textarea
								id="edit-input"
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								className="min-h-[80px]"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="edit-output">Expected Ticket Output (Markdown)</Label>
							<Textarea
								id="edit-output"
								value={outputValue}
								onChange={(e) => setOutputValue(e.target.value)}
								className="min-h-[200px] font-mono text-sm"
							/>
						</div>
					</div>
					<DialogFooter>
						<Button variant="outline" onClick={() => setEditingExample(null)}>
							<X className="h-4 w-4 mr-2" />
							Cancel
						</Button>
						<Button onClick={handleUpdateExample}>
							<Save className="h-4 w-4 mr-2" />
							Save Changes
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}
