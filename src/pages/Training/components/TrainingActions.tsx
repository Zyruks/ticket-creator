import { Download, Plus, Trash2, Upload } from 'lucide-react';
import { useCallback } from 'react';
import { toast } from 'sonner';

import { type TrainingExample } from '@domain/training';
import { Button } from '@/components/ui/button';

interface TrainingActionsProps {
	examples: TrainingExample[];
	onImport: (examples: TrainingExample[]) => void;
	onExport: () => void;
	onClear: () => void;
	onAddOpen: () => void;
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
			reader.onload = (e) => {
				try {
					const data = JSON.parse(e.target?.result as string) as TrainingExample[];
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
		[onImport]
	);

	return (
		<div className="flex flex-wrap gap-2 mb-6">
			<Button onClick={onAddOpen}>
				<Plus className="h-4 w-4 mr-2" />
				Add Example
			</Button>

			<label>
				<Button variant="outline" asChild>
					<span>
						<Upload className="h-4 w-4 mr-2" />
						Import JSON
						<input type="file" accept=".json" onChange={handleImportFile} className="sr-only" />
					</span>
				</Button>
			</label>

			<Button variant="outline" onClick={onExport} disabled={!hasExamples}>
				<Download className="h-4 w-4 mr-2" />
				Export JSON
			</Button>

			<Button
				variant="outline"
				className="text-destructive"
				onClick={onClear}
				disabled={!hasExamples}
			>
				<Trash2 className="h-4 w-4 mr-2" />
				Clear All
			</Button>
		</div>
	);
};
