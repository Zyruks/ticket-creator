import { Button } from '@components';
import type { TrainingExample } from '@domain';
import { Download, Plus, Trash2, Upload } from 'lucide-react';
import { useCallback } from 'react';
import { toast } from 'sonner';

interface TrainingActionsProps {
	/**
	 * Array of training examples.
	 */
	examples: TrainingExample[];

	/**
	 * Callback when add example button is clicked.
	 */
	onAddOpen: () => void;

	/**
	 * Callback to clear all training examples.
	 */
	onClear: () => void;

	/**
	 * Callback to export training examples.
	 */
	onExport: () => void;

	/**
	 * Callback to import training examples.
	 */
	onImport: (examples: TrainingExample[]) => void;
}

export const TrainingActions = ({
	examples,
	onImport,
	onExport,
	onClear,
	onAddOpen,
}: TrainingActionsProps) => {
	const hasExamples = examples.length > 0;

	const handleImportFile = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0];
			if (!file) return;

			const reader = new FileReader();
			reader.onload = (event) => {
				try {
					const data = JSON.parse(event.target?.result as string) as TrainingExample[];
					if (Array.isArray(data)) {
						onImport(data);
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
		},
		[onImport],
	);

	return (
		<div className="mb-6 flex flex-wrap gap-2">
			<Button onClick={onAddOpen}>
				<Plus className="mr-2 h-4 w-4" />
				Add Example
			</Button>

			<label>
				<Button
					variant="outline"
					asChild
				>
					<span>
						<Upload className="mr-2 h-4 w-4" />
						Import JSON
						<input
							type="file"
							accept=".json"
							onChange={handleImportFile}
							className="sr-only"
						/>
					</span>
				</Button>
			</label>

			<Button
				variant="outline"
				onClick={onExport}
				disabled={!hasExamples}
			>
				<Download className="mr-2 h-4 w-4" />
				Export JSON
			</Button>

			<Button
				variant="outline"
				className="text-destructive"
				onClick={onClear}
				disabled={!hasExamples}
			>
				<Trash2 className="mr-2 h-4 w-4" />
				Clear All
			</Button>
		</div>
	);
};
